import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Building2, Clock, ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useImageUpload } from '@/hooks/useImageUpload';
import { displayPrice, parsePriceShorthand } from '@/utils/priceFormatter';
import { supabase } from '@/integrations/supabase/client';

const PostProperty = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { images, uploading, addImages, removeImage, clearImages, uploadAllImages } = useImageUpload();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [priceDisplay, setPriceDisplay] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    area: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    furnishing: '',
    propertyType: '',
    amenities: [] as string[],
    age: '',
    posterName: '',
    posterPhone: '',
    posterEmail: '',
  });
  

  const amenitiesList = [
    'Gym', 'Swimming Pool', 'Parking', 'Security', '24/7 Power Backup',
    'Lift', 'Garden', 'Terrace', 'CCTV', 'Generator', 'Water Supply',
    'Solar Panels', 'Central AC', 'Clubhouse', 'Children Play Area'
  ];

  const handleInputChange = (field: string, value: string) => {
    if (field === 'price') {
      const numericValue = parsePriceShorthand(value);
      setPriceDisplay(displayPrice(numericValue));
      setFormData(prev => ({
        ...prev,
        [field]: numericValue.toString()
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addImages(e.target.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to post a property.",
        variant: "destructive",
      });
      navigate('/sign-in');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Upload images first
      const imageUrls = await uploadAllImages();
      
      // Insert property
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          location: formData.location,
          area: parseInt(formData.area),
          price: parseFloat(formData.price),
          bedrooms: formData.bedrooms,
          bathrooms: formData.bathrooms,
          furnishing: formData.furnishing,
          property_type: formData.propertyType,
          amenities: formData.amenities,
          age: formData.age,
          poster_name: formData.posterName,
          poster_phone: formData.posterPhone,
          poster_email: formData.posterEmail,
          status: 'pending'
        })
        .select()
        .single();

      if (propertyError) throw propertyError;

      // Insert property images
      if (imageUrls.length > 0) {
        const imageInserts = imageUrls.map((url, index) => ({
          property_id: propertyData.id,
          image_url: url,
          display_order: index
        }));

        const { error: imageError } = await supabase
          .from('property_images')
          .insert(imageInserts);

        if (imageError) throw imageError;
      }

      toast({
        title: "Property Submitted!",
        description: "Your property has been submitted for approval. We'll contact you soon.",
      });

      // Reset form
      setFormData({
        title: '', description: '', location: '', area: '', price: '',
        bedrooms: '', bathrooms: '', furnishing: '', propertyType: '',
        amenities: [], age: '', posterName: '', posterPhone: '', posterEmail: '',
      });
      setPriceDisplay('');
      clearImages();
      
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Post Your Property
          </h1>
          <p className="text-lg text-muted-foreground">
            List your property with us and reach thousands of potential buyers
          </p>
        </div>

        {/* Auth Notice */}
        {!user && (
          <Card className="mb-8 bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Sign in to post properties</p>
                  <p className="text-sm text-muted-foreground">
                    You need to be signed in to post a property. 
                    <Link to="/sign-in" className="text-primary hover:underline ml-1">
                      Sign in now
                    </Link>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Provide basic details about your property
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Property Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Luxury 3BHK Apartment in Gachibowli"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g., Gachibowli, Hyderabad"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your property in detail..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="text"
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="e.g., 1.25 cr, 50 lakh, 2.5L"
                    required
                  />
                  {priceDisplay && (
                    <p className="text-sm text-muted-foreground">
                      Formatted: {priceDisplay}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="area">Area (sq ft) *</Label>
                  <Input
                    id="area"
                    type="number"
                    value={formData.area}
                    onChange={(e) => handleInputChange('area', e.target.value)}
                    placeholder="e.g., 1450"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Property Age *</Label>
                  <Select value={formData.age} onValueChange={(value) => handleInputChange('age', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select age" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-construction">Under Construction</SelectItem>
                      <SelectItem value="0-1">0-1 Years</SelectItem>
                      <SelectItem value="1-3">1-3 Years</SelectItem>
                      <SelectItem value="3-5">3-5 Years</SelectItem>
                      <SelectItem value="5-10">5-10 Years</SelectItem>
                      <SelectItem value="10+">10+ Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Details */}
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="propertyType">Property Type *</Label>
                  <Select value={formData.propertyType} onValueChange={(value) => handleInputChange('propertyType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="independent-house">Independent House</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms *</Label>
                  <Select value={formData.bedrooms} onValueChange={(value) => handleInputChange('bedrooms', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="BHK" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 BHK</SelectItem>
                      <SelectItem value="2">2 BHK</SelectItem>
                      <SelectItem value="3">3 BHK</SelectItem>
                      <SelectItem value="4">4 BHK</SelectItem>
                      <SelectItem value="5">5+ BHK</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms *</Label>
                  <Select value={formData.bathrooms} onValueChange={(value) => handleInputChange('bathrooms', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Count" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="furnishing">Furnishing *</Label>
                  <Select value={formData.furnishing} onValueChange={(value) => handleInputChange('furnishing', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="furnished">Furnished</SelectItem>
                      <SelectItem value="semi-furnished">Semi-Furnished</SelectItem>
                      <SelectItem value="unfurnished">Unfurnished</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-2">
                <Label>Amenities</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {amenitiesList.map((amenity) => (
                    <Badge
                      key={amenity}
                      variant={formData.amenities.includes(amenity) ? "default" : "outline"}
                      className="cursor-pointer justify-center py-2"
                      onClick={() => toggleAmenity(amenity)}
                    >
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Property Images</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6">
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <div className="mt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        disabled={uploading}
                        onClick={() => document.getElementById('image-upload')?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {uploading ? 'Uploading...' : 'Choose Images'}
                      </Button>
                      <input
                        id="image-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Upload multiple images (JPEG, PNG, WebP)
                    </p>
                  </div>
                </div>
                
                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {images.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.url}
                          alt="Property preview"
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(image.id)}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                This information will be kept private and used for verification
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="posterName">Your Name *</Label>
                  <Input
                    id="posterName"
                    value={formData.posterName}
                    onChange={(e) => handleInputChange('posterName', e.target.value)}
                    placeholder="Full Name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="posterPhone">Phone Number *</Label>
                  <Input
                    id="posterPhone"
                    type="tel"
                    value={formData.posterPhone}
                    onChange={(e) => handleInputChange('posterPhone', e.target.value)}
                    placeholder="10-digit phone number"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="posterEmail">Email Address *</Label>
                  <Input
                    id="posterEmail"
                    type="email"
                    value={formData.posterEmail}
                    onChange={(e) => handleInputChange('posterEmail', e.target.value)}
                    placeholder="email@example.com"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Approval Notice */}
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="font-medium text-amber-800">Pending Approval</p>
                  <p className="text-sm text-amber-700">
                    Your property will be reviewed by our admin team before being published. This usually takes 24-48 hours.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button 
            type="submit" 
            size="lg" 
            className="w-full btn-hero"
            disabled={!user || isSubmitting || uploading}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Property for Approval'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PostProperty;
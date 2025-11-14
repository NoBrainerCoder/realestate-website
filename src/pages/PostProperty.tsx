import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload, X, Building2, Clock, ImageIcon, Home, Key, Check, ChevronsUpDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { displayPrice, parsePriceShorthand } from '@/utils/priceFormatter';
import { supabase } from '@/integrations/supabase/client';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const PostProperty = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    if (!user) {
      // Redirect to sign in if not authenticated
      navigate('/sign-in', { state: { from: '/post-property' } });
    }
  }, [user, navigate]);
  const { media, uploading, addMedia, removeMedia, clearMedia, uploadAllMedia } = useMediaUpload();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [priceDisplay, setPriceDisplay] = useState('');
  const [showPropertyTypeModal, setShowPropertyTypeModal] = useState(true);
  const [propertyFor, setPropertyFor] = useState<'rent' | 'sell' | ''>('');
  const [locationOpen, setLocationOpen] = useState(false);

  // Hyderabad areas list for autocomplete
  const hyderabadAreas = [
    'Abids', 'Aghapura', 'Aler', 'Alkapur Township', 'Alwal', 'Amangal', 'Amberpet', 'Ameenpur', 
    'Ameerpet', 'Anantharam', 'Anekal', 'Attapur', 'Aushapur', 'Bachupally', 'Badangpet', 
    'Bahadurpally', 'Bandlaguda Jagir', 'Banjara Hills', 'Barkas', 'Beeramguda', 'Begumpet', 
    'BHEL', 'Bhongir', 'Boduppal', 'Bolaram', 'Bonthapally', 'Borabanda', 'Bowenpally', 
    'Chaderghat', 'Chaitanyapuri', 'Champapet', 'Chandanagar', 'Chandrayangutta', 'Cherlapally', 
    'Chevella', 'Chilkuru', 'Chinthal', 'Chintakunta', 'Choutuppal', 'Dammaiguda', 'Dilsukhnagar', 
    'Domalguda', 'Dr A.S.Rao Nagar', 'ECIL', 'Edulabad', 'Erragadda', 'Falaknuma', 'Farrukhnagar', 
    'Gachibowli', 'Gaganpahad', 'Gajwel', 'Gandimaisamma', 'Ghatkesar', 'Gowlipura', 'Habsiguda', 
    'Hafeezpet', 'Hayathnagar', 'Hyderguda', 'Himayatnagar', 'Hitech City', 'HMT Colony', 
    'Hussain Sagar', 'Jadcherla', 'Jaggampet', 'Jeedimetla', 'Jillelaguda', 'Jubilee Hills', 
    'Kachiguda', 'Kadthal', 'Kakatiya Hills', 'Kandlakoya', 'Kapra', 'Karmanghat', 'Keesara', 
    'Kismatpur', 'Kokapet', 'Kompally', 'Kondapur', 'Kongara Kalan', 'Kothaguda', 'Kothapet', 
    'KPHB', 'Kukatpally', 'Kurmaguda', 'LB Nagar', 'Lallaguda', 'Lingampally', 'Lingojiguda', 
    'Madhapur', 'Madinaguda', 'Maheshwaram', 'Malkajgiri', 'Mallampet', 'Malakpet', 'Mamidpally', 
    'Mandi Bazar', 'Mansoorabad', 'Manikonda', 'Medchal', 'Meerpet', 'Mehdipatnam', 'Miyapur', 
    'Moinabad', 'Moosapet', 'Moula Ali', 'Nagaram', 'Nagole', 'Nallagandla', 'Nampally', 
    'Narapally', 'Narsangi', 'Narsapur', 'Narsingi', 'Neknampur', 'Neredmet', 'Nizampet', 
    'Omerkhan Daira', 'Osman Nagar', 'Osmania University', 'Padma Nagar', 'Patancheru', 
    'Peerzadiguda', 'Peddamberpet', 'Peerancheru', 'Pocharam', 'Pragathi Nagar', 'Pragatinagar',
    'Quthbullapur', 'Rajendra Nagar', 'Ramachandrapuram', 'Ramgopalpet', 'Rampally', 
    'Ramanthapur', 'Ranga Reddy', 'Rani Gunj', 'RC Puram', 'Risalabazar', 'Safilguda', 
    'Sangareddy', 'Saroornagar', 'Sathupalli', 'Secunderabad', 'Serilingampally', 'Shadnagar', 
    'Shamirpet', 'Shankarpally', 'Sharadanagar', 'Shapur', 'Shivaji Nagar', 'Siddipet', 
    'Sikandrabad', 'Sikenderguda', 'Sitaphalmandi', 'Sivarampalli', 'Somajiguda', 'Suchitra', 
    'Sultan Bazar', 'Sun City', 'Suraram', 'Tarnaka', 'Tellapur', 'Thatti Annaram', 
    'Tippu Khan Colony', 'Toli Chowki', 'Tolichowki', 'Tukkuguda', 'Turbalaguda', 'Uppal', 
    'Vanastalipuram', 'Vanasthalipuram', 'Vanasthali Hills', 'Vattepally', 'Vikarabad', 
    'Vijay Nagar Colony', 'Warangal Highway', 'Whitefields', 'Yadadri', 'Yapral', 'Yousufguda', 
    'Zahirabad', 'Zaheerabad'
  ].sort();

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
    posterType: 'owner' as 'owner' | 'agent' | 'builder',
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
    } else if (field === 'propertyType') {
      // Auto-fill N/A for land-only property types
      const landPropertyTypes = ['plot', 'open-plot', 'farmhouse-land', 'agriculture-land', 'open-land'];
      if (landPropertyTypes.includes(value)) {
        setFormData(prev => ({ 
          ...prev, 
          [field]: value,
          bedrooms: 'N/A',
          bathrooms: 'N/A',
          furnishing: 'N/A',
          age: 'N/A'
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [field]: value
        }));
      }
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

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addMedia(e.target.files);
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
      // Upload media files first
      const uploadedMedia = await uploadAllMedia();
      
      // All properties require admin approval
      const propertyStatus = 'pending';

      // Insert property with property_for field
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
          property_for: propertyFor, // Add this field
          amenities: formData.amenities,
          age: formData.age,
          poster_name: formData.posterName,
          poster_phone: formData.posterPhone,
          poster_email: formData.posterEmail,
          status: propertyStatus
        })
        .select()
        .single();

      if (propertyError) throw propertyError;

      // Insert property media (images and videos)
      if (uploadedMedia.length > 0) {
        const mediaInserts = uploadedMedia.map((item, index) => ({
          property_id: propertyData.id,
          image_url: item.url,
          media_type: item.type,
          display_order: index
        }));

        const { error: mediaError } = await supabase
          .from('property_images')
          .insert(mediaInserts);

        if (mediaError) throw mediaError;
      }

      // Send email notification to admin for new property submissions (non-admin only)
      if (!isAdmin) {
        try {
          await supabase.functions.invoke('send-email', {
            body: {
              type: 'new_property_admin',
              to: 'myinfrahub.com@gmail.com',
              data: {
                property_title: formData.title,
                location: formData.location,
                price: formData.price,
                poster_name: formData.posterName,
                poster_email: formData.posterEmail,
                poster_phone: formData.posterPhone
              }
            }
          });
        } catch (emailError) {
          console.error('Failed to send admin notification:', emailError);
        }
      }

      toast({
        title: "Property Submitted Successfully",
        description: "Your property has been submitted and is under review by our admin team for approval before publishing.",
      });

      // Reset form
      setFormData({
        title: '', description: '', location: '', area: '', price: '',
        bedrooms: '', bathrooms: '', furnishing: '', propertyType: '',
        amenities: [], age: '', posterName: '', posterPhone: '', posterEmail: '',
        posterType: 'owner',
      });
      setPriceDisplay('');
      clearMedia();
      
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
    <>
      {/* Property Type Selection Modal */}
      <Dialog open={showPropertyTypeModal && !propertyFor} onOpenChange={setShowPropertyTypeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">Choose Property Listing Type</DialogTitle>
            <DialogDescription className="text-center">
              Select whether you want to rent out or sell your property
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button
              onClick={() => {
                setPropertyFor('rent');
                setShowPropertyTypeModal(false);
              }}
              className="h-32 flex flex-col gap-3 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              size="lg"
            >
              <Home className="h-12 w-12" />
              <span className="text-lg font-semibold">Rent</span>
            </Button>
            <Button
              onClick={() => {
                setPropertyFor('sell');
                setShowPropertyTypeModal(false);
              }}
              className="h-32 flex flex-col gap-3 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              size="lg"
            >
              <Key className="h-12 w-12" />
              <span className="text-lg font-semibold">Sell</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="min-h-screen bg-muted/30 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Post Your Property {propertyFor && <span className="text-primary">({propertyFor === 'rent' ? 'For Rent' : 'For Sale'})</span>}
            </h1>
            <p className="text-lg text-muted-foreground">
              List your property with us and reach thousands of potential {propertyFor === 'rent' ? 'tenants' : 'buyers'}
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
          {/* User Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Who are you?</CardTitle>
              <CardDescription>
                Select your classification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Label>I am a *</Label>
                <RadioGroup
                  value={formData.posterType}
                  onValueChange={(value) => handleInputChange('posterType', value as 'owner' | 'agent' | 'builder')}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="owner" id="owner" />
                    <Label htmlFor="owner" className="cursor-pointer">🏡 Owner</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="agent" id="agent" />
                    <Label htmlFor="agent" className="cursor-pointer">🧑‍💼 Agent</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="builder" id="builder" />
                    <Label htmlFor="builder" className="cursor-pointer">🏗️ Builder</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

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
                  <Popover open={locationOpen} onOpenChange={setLocationOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={locationOpen}
                        className="w-full justify-between"
                      >
                        {formData.location || "Select location..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search location..." />
                        <CommandEmpty>No location found.</CommandEmpty>
                        <CommandGroup className="max-h-64 overflow-auto">
                          {hyderabadAreas.map((area) => (
                            <CommandItem
                              key={area}
                              value={area}
                              onSelect={(currentValue) => {
                                handleInputChange('location', currentValue);
                                setLocationOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.location === area ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {area}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="description">Description *</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      if (!formData.location || !formData.propertyType || !formData.bedrooms) {
                        toast({
                          title: "Fill Required Fields",
                          description: "Please fill in location, property type, and bedrooms first.",
                          variant: "destructive",
                        });
                        return;
                      }
                      
                      try {
                        const { data, error } = await supabase.functions.invoke('generate-description', {
                          body: { propertyData: formData }
                        });
                        
                        if (error) throw error;
                        
                        handleInputChange('description', data.description);
                        toast({
                          title: "Description Generated",
                          description: "AI has generated a property description for you!",
                        });
                      } catch (error: any) {
                        toast({
                          title: "Generation Failed",
                          description: error.message || "Failed to generate description",
                          variant: "destructive",
                        });
                      }
                    }}
                    className="text-xs"
                  >
                    ✨ Generate with AI
                  </Button>
                </div>
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
                  <Label htmlFor="area">
                    Area ({formData.propertyType === 'open-plot' ? 'sq y' : 'sq ft'}) *
                  </Label>
                  <Input
                    id="area"
                    type="number"
                    value={formData.area}
                    onChange={(e) => handleInputChange('area', e.target.value)}
                    placeholder={formData.propertyType === 'open-plot' ? 'e.g., 200' : 'e.g., 1450'}
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
                      <SelectItem value="N/A">N/A</SelectItem>
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
                      <SelectItem value="flat">Flat</SelectItem>
                      <SelectItem value="plot">Plot</SelectItem>
                      <SelectItem value="open-plot">Open Plot</SelectItem>
                      <SelectItem value="farmhouse-land">Farmhouse Land</SelectItem>
                      <SelectItem value="agriculture-land">Agriculture Land</SelectItem>
                      <SelectItem value="open-land">Open Land</SelectItem>
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
                      <SelectItem value="N/A">N/A</SelectItem>
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
                      <SelectItem value="N/A">N/A</SelectItem>
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
                      <SelectItem value="N/A">N/A</SelectItem>
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
              
              {/* Media Upload */}
              <div className="space-y-2">
                <Label>Property Images & Videos</Label>
                <div 
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 transition-colors hover:border-primary/50"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add('border-primary', 'bg-primary/5');
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove('border-primary', 'bg-primary/5');
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('border-primary', 'bg-primary/5');
                    if (e.dataTransfer.files) {
                      addMedia(e.dataTransfer.files);
                    }
                  }}
                >
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <div className="mt-4 flex gap-2 justify-center">
                      <Button 
                        type="button" 
                        variant="outline" 
                        disabled={uploading}
                        onClick={() => document.getElementById('media-upload')?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        {uploading ? 'Uploading...' : 'Choose Files'}
                      </Button>
                      <input
                        id="media-upload"
                        type="file"
                        multiple
                        accept="image/*,video/mp4,video/webm,video/mov"
                        onChange={handleMediaUpload}
                        className="hidden"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Drag & drop files here, or click to browse
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supported: Images (JPEG, PNG, WebP) and Videos (MP4, MOV, WebM)
                    </p>
                  </div>
                </div>
                
                {media.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {media.map((item) => (
                      <div key={item.id} className="relative group">
                        {item.type === 'image' ? (
                          <img
                            src={item.url}
                            alt="Property preview"
                            className="w-full h-24 object-cover rounded-md"
                          />
                        ) : (
                          <video
                            src={item.url}
                            className="w-full h-24 object-cover rounded-md"
                            muted
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => removeMedia(item.id)}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <div className="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                          {item.type === 'video' ? '🎥' : '📷'}
                        </div>
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
          <Card className="bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                <div>
                  <p className="font-medium text-amber-800 dark:text-amber-300">Pending Approval</p>
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    Your property has been submitted and is under review by our admin team for approval before publishing.
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
    </>
  );
};

export default PostProperty;
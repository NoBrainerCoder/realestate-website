import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Eye, 
  Edit, 
  CheckCircle, 
  XCircle, 
  MapPin, 
  BedDouble, 
  Bath, 
  Ruler, 
  IndianRupee,
  Phone,
  Mail,
  User,
  Building2,
  ShoppingCart,
  Trash2,
  Plus
} from 'lucide-react';
import { displayPrice } from '@/utils/priceFormatter';

const AdminProperties = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch properties
  const { data: properties, isLoading } = useQuery({
    queryKey: ['admin-properties', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('properties')
        .select(`
          *,
          property_images (
            id,
            image_url,
            media_type,
            display_order
          )
        `)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  // Update property status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, rejection_reason }: { id: string; status: string; rejection_reason?: string }) => {
      const updateData: any = { status };
      if (rejection_reason) {
        updateData.rejection_reason = rejection_reason;
      }

      const { error } = await supabase
        .from('properties')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;

      // Send email notification if rejecting
      if (status === 'rejected' && rejection_reason) {
        const property = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single();

        if (property.data) {
          try {
            await supabase.functions.invoke('send-email', {
              body: {
                to: property.data.poster_email,
                subject: 'Property Submission Rejected - MyInfraHub',
                html: `
                  <h2>Property Submission Update</h2>
                  <p>Dear ${property.data.poster_name},</p>
                  <p>We regret to inform you that your property submission "${property.data.title}" has been rejected.</p>
                  <p><strong>Reason:</strong> ${rejection_reason}</p>
                  <p>If you have any questions or would like to resubmit with corrections, please contact us.</p>
                  <br>
                  <p>Best regards,<br>MyInfraHub Team</p>
                `
              }
            });
            console.log('Rejection email sent successfully');
          } catch (emailError) {
            console.error('Failed to send rejection email:', emailError);
          }
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      queryClient.invalidateQueries({ queryKey: ['admin-properties-stats'] });
      setIsRejectDialogOpen(false);
      setRejectionReason('');
      toast({
        title: 'Success',
        description: 'Property status updated successfully'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update property status',
        variant: 'destructive'
      });
    }
  });

  // Update property details
  const updatePropertyMutation = useMutation({
    mutationFn: async (property: any) => {
      const { error } = await supabase
        .from('properties')
        .update({
          title: property.title,
          description: property.description,
          price: property.price,
          location: property.location,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          area: property.area,
          furnishing: property.furnishing,
          amenities: property.amenities
        })
        .eq('id', property.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      setIsEditDialogOpen(false);
      toast({
        title: 'Success',
        description: 'Property updated successfully'
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update property',
        variant: 'destructive'
      });
    }
  });

  const handleStatusUpdate = (id: string, status: string, rejection_reason?: string) => {
    updateStatusMutation.mutate({ id, status, rejection_reason });
  };

  const handleSoldOut = async (id: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ 
          status: 'sold_out',
          sold_out_date: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) throw error;
      
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      toast({
        title: 'Success',
        description: 'Property marked as sold out. It will be automatically removed after 3 days.'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to mark property as sold out',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteMedia = async (mediaId: string) => {
    try {
      const { error } = await supabase
        .from('property_images')
        .delete()
        .eq('id', mediaId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      toast({
        title: 'Success',
        description: 'Media deleted successfully'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete media',
        variant: 'destructive'
      });
    }
  };

  const handleAdminMediaUpload = async (propertyId: string, files: FileList) => {
    try {
      const fileArray = Array.from(files);
      
      // Count images and videos
      const imageCount = fileArray.filter(f => f.type.startsWith('image/')).length;
      const videoCount = fileArray.filter(f => f.type.startsWith('video/')).length;
      const existingImages = selectedProperty?.property_images?.filter((m: any) => m.media_type === 'image').length || 0;
      const existingVideos = selectedProperty?.property_images?.filter((m: any) => m.media_type === 'video').length || 0;
      
      if (existingImages + imageCount > 10) {
        toast({
          title: 'Error',
          description: 'Maximum 10 images allowed',
          variant: 'destructive'
        });
        return;
      }
      
      if (existingVideos + videoCount > 3) {
        toast({
          title: 'Error',
          description: 'Maximum 3 videos allowed',
          variant: 'destructive'
        });
        return;
      }

      toast({
        title: 'Uploading',
        description: 'Uploading media files...'
      });

      for (const file of fileArray) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${propertyId}/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('property-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(filePath);

        const mediaType = file.type.startsWith('video/') ? 'video' : 'image';

        await supabase
          .from('property_images')
          .insert({
            property_id: propertyId,
            image_url: publicUrl,
            media_type: mediaType,
          });
      }

      toast({
        title: 'Success',
        description: 'Media uploaded successfully'
      });
      await queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
    } catch (error: any) {
      console.error('Error uploading media:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload media',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // First delete associated images
      const { error: imagesError } = await supabase
        .from('property_images')
        .delete()
        .eq('property_id', id);

      if (imagesError) throw imagesError;

      // Then delete the property
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      queryClient.invalidateQueries({ queryKey: ['admin-properties-stats'] });
      toast({
        title: 'Success',
        description: 'Property deleted successfully'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete property',
        variant: 'destructive'
      });
    }
  };

  const handleRejectClick = (property: any) => {
    setSelectedProperty(property);
    setIsRejectDialogOpen(true);
  };

  const handleRejectSubmit = () => {
    if (!rejectionReason.trim()) {
      toast({
        title: 'Error',
        description: 'Please provide a rejection reason',
        variant: 'destructive'
      });
      return;
    }
    handleStatusUpdate(selectedProperty.id, 'rejected', rejectionReason);
  };

  const handleEditSubmit = (formData: FormData) => {
    const property = {
      ...selectedProperty,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      location: formData.get('location') as string,
      bedrooms: formData.get('bedrooms') as string,
      bathrooms: formData.get('bathrooms') as string,
      area: parseInt(formData.get('area') as string),
      furnishing: formData.get('furnishing') as string,
    };
    
    updatePropertyMutation.mutate(property);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
      case 'sold_out':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Sold Out</Badge>;
      default:
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">Pending</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 page-transition">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Property Management</h1>
            <p className="text-lg text-muted-foreground">Review and manage property submissions</p>
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="sold_out">Sold Out</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-6">
          {properties?.map((property) => (
            <Card key={property.id} className="card-elegant">
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{property.title}</CardTitle>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {property.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <IndianRupee className="h-4 w-4" />
                        {displayPrice(property.price)}
                      </div>
                      <div className="flex items-center gap-1">
                        <BedDouble className="h-4 w-4" />
                        {property.bedrooms} BHK
                      </div>
                      <div className="flex items-center gap-1">
                        <Ruler className="h-4 w-4" />
                        {property.area} sq ft
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(property.status)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Poster Type</p>
                    <div className="flex items-center gap-1 text-sm">
                      {property.poster_type === 'builder' && '🏗️ Builder'}
                      {property.poster_type === 'agent' && '🧑‍💼 Agent'}
                      {property.poster_type === 'owner' && '🏡 Owner'}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Contact Person</p>
                    <div className="flex items-center gap-1 text-sm">
                      <User className="h-4 w-4" />
                      {property.poster_name}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <div className="flex items-center gap-1 text-sm">
                      <Mail className="h-4 w-4" />
                      {property.poster_email}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone</p>
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-4 w-4" />
                      {property.poster_phone}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedProperty(property)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{selectedProperty?.title}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">Property Details</h4>
                            <div className="space-y-2 text-sm">
                              <p><strong>Type:</strong> {selectedProperty?.property_type}</p>
                              <p><strong>Price:</strong> {displayPrice(selectedProperty?.price)}</p>
                              <p><strong>Location:</strong> {selectedProperty?.location}</p>
                              <p><strong>Bedrooms:</strong> {selectedProperty?.bedrooms}</p>
                              <p><strong>Bathrooms:</strong> {selectedProperty?.bathrooms}</p>
                              <p><strong>Area:</strong> {selectedProperty?.area} sq ft</p>
                              <p><strong>Furnishing:</strong> {selectedProperty?.furnishing}</p>
                              <p><strong>Age:</strong> {selectedProperty?.age}</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Contact Information</h4>
                            <div className="space-y-2 text-sm">
                              <p><strong>Name:</strong> {selectedProperty?.poster_name}</p>
                              <p><strong>Email:</strong> {selectedProperty?.poster_email}</p>
                              <p><strong>Phone:</strong> {selectedProperty?.poster_phone}</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Description</h4>
                          <p className="text-sm">{selectedProperty?.description}</p>
                        </div>
                        {selectedProperty?.amenities && selectedProperty.amenities.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2">Amenities</h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedProperty.amenities.map((amenity: string, index: number) => (
                                <Badge key={index} variant="secondary">{amenity}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">Property Media</h4>
                            <div className="flex items-center gap-2">
                              <input
                                type="file"
                                id="admin-media-upload"
                                multiple
                                accept="image/*,video/*"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files && selectedProperty) {
                                    handleAdminMediaUpload(selectedProperty.id, e.target.files);
                                  }
                                }}
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => document.getElementById('admin-media-upload')?.click()}
                                disabled={updatePropertyMutation.isPending}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Media
                              </Button>
                            </div>
                          </div>
                          {selectedProperty?.property_images && selectedProperty.property_images.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              {selectedProperty.property_images.map((media: any) => (
                                <div key={media.id} className="relative group">
                                  {media.media_type === 'video' ? (
                                    <video 
                                      src={media.image_url} 
                                      controls
                                      className="w-full h-32 object-cover rounded-lg"
                                      onMouseEnter={(e) => e.currentTarget.play()}
                                      onMouseLeave={(e) => e.currentTarget.pause()}
                                      muted
                                    />
                                  ) : (
                                    <img 
                                      src={media.image_url} 
                                      alt="Property" 
                                      className="w-full h-32 object-cover rounded-lg"
                                    />
                                  )}
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <button className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Trash2 className="h-4 w-4" />
                                      </button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Media</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete this {media.media_type}? This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => handleDeleteMedia(media.id)}>
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-muted-foreground">No media uploaded yet</p>
                          )}
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Rejection Dialog */}
                  <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reject Property</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Please provide a reason for rejecting this property. An email will be sent to the property owner.
                        </p>
                        <Textarea
                          placeholder="Enter rejection reason..."
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          rows={4}
                        />
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => {
                          setIsRejectDialogOpen(false);
                          setRejectionReason('');
                        }}>
                          Cancel
                        </Button>
                        <Button 
                          variant="destructive" 
                          onClick={handleRejectSubmit}
                          disabled={updateStatusMutation.isPending}
                        >
                          {updateStatusMutation.isPending ? 'Rejecting...' : 'Reject Property'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedProperty(property)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Edit Property</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        handleEditSubmit(new FormData(e.target as HTMLFormElement));
                      }}>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Title</label>
                            <Input name="title" defaultValue={selectedProperty?.title} required />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Description</label>
                            <Textarea name="description" defaultValue={selectedProperty?.description} required />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Price</label>
                              <Input name="price" type="number" defaultValue={selectedProperty?.price} required />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Area (sq ft)</label>
                              <Input name="area" type="number" defaultValue={selectedProperty?.area} required />
                            </div>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Location</label>
                            <Input name="location" defaultValue={selectedProperty?.location} required />
                          </div>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label className="text-sm font-medium">Bedrooms</label>
                              <Input name="bedrooms" defaultValue={selectedProperty?.bedrooms} required />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Bathrooms</label>
                              <Input name="bathrooms" defaultValue={selectedProperty?.bathrooms} required />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Furnishing</label>
                              <Input name="furnishing" defaultValue={selectedProperty?.furnishing} required />
                            </div>
                          </div>
                        </div>
                        <DialogFooter className="mt-6">
                          <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" disabled={updatePropertyMutation.isPending}>
                            {updatePropertyMutation.isPending ? 'Saving...' : 'Save Changes'}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>

                  {property.status === 'pending' && (
                    <>
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleStatusUpdate(property.id, 'approved')}
                        disabled={updateStatusMutation.isPending}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleRejectClick(property)}
                        disabled={updateStatusMutation.isPending}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                          >
                            Delete Property
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to delete this property?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the property
                              from both the admin panel and the live website.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(property.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}

                  {property.status === 'approved' && (
                    <>
                      <Button 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleSoldOut(property.id)}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Mark as Sold Out
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleRejectClick(property)}
                        disabled={updateStatusMutation.isPending}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                          >
                            Delete Property
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to delete this property?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the property
                              from both the admin panel and the live website.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(property.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}

                  {property.status === 'rejected' && (
                    <>
                      <Button 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleStatusUpdate(property.id, 'approved')}
                        disabled={updateStatusMutation.isPending}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                          >
                            Delete Property
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to delete this property?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the property
                              from both the admin panel and the live website.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(property.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}

                  {property.status === 'sold_out' && (
                    <>
                      {(() => {
                        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                        const soldOutDate = property.sold_out_date ? new Date(property.sold_out_date) : null;
                        const isWithinSevenDays = soldOutDate && soldOutDate >= sevenDaysAgo;
                        
                        return isWithinSevenDays ? (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="sm"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Property
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure you want to delete this property?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the property
                                  from both the admin panel and the live website.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(property.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        ) : null;
                      })()}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {properties?.length === 0 && (
          <Card className="card-elegant">
            <CardContent className="text-center py-12">
              <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Properties Found</h3>
              <p className="text-muted-foreground">
                {statusFilter === 'all' 
                  ? 'No properties have been submitted yet.' 
                  : `No ${statusFilter} properties found.`
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminProperties;
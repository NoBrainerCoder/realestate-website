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
  Building2
} from 'lucide-react';
import { displayPrice } from '@/utils/priceFormatter';

const AdminProperties = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
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
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('properties')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-properties'] });
      queryClient.invalidateQueries({ queryKey: ['admin-properties-stats'] });
      toast({
        title: 'Success',
        description: 'Property status updated successfully'
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update property status',
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

  const handleStatusUpdate = (id: string, status: string) => {
    updateStatusMutation.mutate({ id, status });
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                      </div>
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
                        onClick={() => handleStatusUpdate(property.id, 'rejected')}
                        disabled={updateStatusMutation.isPending}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}

                  {property.status === 'approved' && (
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleStatusUpdate(property.id, 'rejected')}
                      disabled={updateStatusMutation.isPending}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  )}

                  {property.status === 'rejected' && (
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleStatusUpdate(property.id, 'approved')}
                      disabled={updateStatusMutation.isPending}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
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
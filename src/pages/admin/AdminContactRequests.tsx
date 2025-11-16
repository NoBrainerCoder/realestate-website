import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Eye, CheckCircle, Trash2, Mail, Phone, User, MapPin, Building2, Hash, MessageCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import QuantumLoader from '@/components/QuantumLoader';
import { formatDistanceToNow } from 'date-fns';

const AdminContactRequests = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [propertyOwner, setPropertyOwner] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { data: requests, isLoading } = useQuery({
    queryKey: ['admin-contact-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const handleMarkContacted = async (id: string) => {
    const { error } = await supabase
      .from('contact_requests')
      .update({ status: 'contacted' })
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive'
      });
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['admin-contact-requests'] });
    toast({
      title: 'Success',
      description: 'Request marked as contacted'
    });
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('contact_requests')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete request',
        variant: 'destructive'
      });
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['admin-contact-requests'] });
    toast({
      title: 'Success',
      description: 'Request deleted successfully'
    });
  };

  const handleViewDetails = async (request: any) => {
    setSelectedRequest(request);
    
    // Fetch property owner details
    const { data: propertyData, error } = await supabase
      .from('properties')
      .select('poster_name, poster_phone, poster_email, poster_type')
      .eq('id', request.property_id)
      .single();
    
    if (!error && propertyData) {
      setPropertyOwner(propertyData);
    }
    
    setDetailsOpen(true);
  };

  const handleWhatsApp = (phone: string | null) => {
    if (!phone) {
      toast({
        title: 'Error',
        description: 'Phone number not available',
        variant: 'destructive'
      });
      return;
    }
    
    // Sanitize phone number - remove all non-digits
    const sanitizedPhone = phone.replace(/\D/g, '');
    
    // Open WhatsApp
    window.open(`https://wa.me/${sanitizedPhone}`, '_blank');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <QuantumLoader size="65" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Contact Requests</h1>
          <p className="text-lg text-muted-foreground">
            Manage incoming property contact requests
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>All Contact Requests ({requests?.length || 0})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!requests || requests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No contact requests yet
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div
                    key={request.id}
                    className="border rounded-lg p-4 hover:border-primary/50 transition-colors"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-2">
                        <div className="flex items-start gap-2 mb-2">
                          <Building2 className="h-5 w-5 text-primary mt-1" />
                          <div>
                            <p className="font-semibold text-foreground">{request.property_title}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {request.property_location}
                            </p>
                            <div className="flex items-center gap-1 mt-1">
                              <Hash className="h-3 w-3 text-primary" />
                              <Badge variant="outline" className="text-xs">
                                {request.property_code}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm font-medium">{request.user_name}</p>
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">{request.user_email}</p>
                        </div>
                        {request.user_phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">{request.user_phone}</p>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2 justify-center">
                        <Badge variant={request.status === 'contacted' ? 'default' : 'secondary'}>
                          {request.status === 'contacted' ? 'Contacted' : 'Pending'}
                        </Badge>
                        <div className="flex flex-wrap gap-2">
                          {request.user_phone && (
                            <Button
                              size="sm"
                              variant="success"
                              onClick={() => handleWhatsApp(request.user_phone)}
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetails(request)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {request.status !== 'contacted' && (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleMarkContacted(request.id)}
                              title="Mark as Contacted"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(request.id)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Contact Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Property Information</h3>
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <p><span className="font-medium">Code:</span> {selectedRequest.property_code}</p>
                  <p><span className="font-medium">Title:</span> {selectedRequest.property_title}</p>
                  <p><span className="font-medium">Location:</span> {selectedRequest.property_location}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Requester Information (User Who Requested Callback)</h3>
                <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                  <p><span className="font-medium">Name:</span> {selectedRequest.user_name}</p>
                  <p><span className="font-medium">Phone:</span> {selectedRequest.user_phone || 'Not provided'}</p>
                  <p><span className="font-medium">Email:</span> {selectedRequest.user_email}</p>
                  <p><span className="font-medium">Requested:</span> {new Date(selectedRequest.created_at).toLocaleString()}</p>
                  <p><span className="font-medium">Status:</span> {selectedRequest.status}</p>
                </div>
                {selectedRequest.user_phone && (
                  <Button
                    className="w-full mt-4"
                    variant="success"
                    onClick={() => handleWhatsApp(selectedRequest.user_phone)}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat on WhatsApp
                  </Button>
                )}
              </div>

              {propertyOwner && (
                <div>
                  <h3 className="font-semibold mb-2">Property Owner / Agent Information</h3>
                  <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                    <p><span className="font-medium">Type:</span> {propertyOwner.poster_type}</p>
                    <p><span className="font-medium">Name:</span> {propertyOwner.poster_name}</p>
                    <p><span className="font-medium">Phone:</span> {propertyOwner.poster_phone}</p>
                    <p><span className="font-medium">Email:</span> {propertyOwner.poster_email}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminContactRequests;

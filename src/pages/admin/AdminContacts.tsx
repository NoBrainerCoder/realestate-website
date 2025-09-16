import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
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
  Mail, 
  Phone, 
  User, 
  Calendar, 
  MessageSquare,
  CheckCircle,
  Clock
} from 'lucide-react';

const AdminContacts = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch contact submissions
  const { data: contacts, isLoading } = useQuery({
    queryKey: ['admin-contacts', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  // Update contact status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-contacts'] });
      queryClient.invalidateQueries({ queryKey: ['admin-contact-stats'] });
      toast({
        title: 'Success',
        description: 'Contact status updated successfully'
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update contact status',
        variant: 'destructive'
      });
    }
  });

  const handleStatusUpdate = (id: string, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'responded':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Responded</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">In Progress</Badge>;
      default:
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">New</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
            <h1 className="text-4xl font-bold text-foreground mb-2">Contact Management</h1>
            <p className="text-lg text-muted-foreground">View and manage customer inquiries</p>
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Contacts</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="responded">Responded</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-6">
          {contacts?.map((contact) => (
            <Card key={contact.id} className="card-elegant">
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{contact.subject}</CardTitle>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {contact.name}
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {contact.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {contact.phone}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(contact.created_at)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(contact.status)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {contact.message}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedContact(contact)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Contact Details</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-2">Contact Information</h4>
                            <div className="space-y-2 text-sm">
                              <p><strong>Name:</strong> {selectedContact?.name}</p>
                              <p><strong>Email:</strong> {selectedContact?.email}</p>
                              <p><strong>Phone:</strong> {selectedContact?.phone}</p>
                              <p><strong>Subject:</strong> {selectedContact?.subject}</p>
                              <p><strong>Submitted:</strong> {selectedContact && formatDate(selectedContact.created_at)}</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Status</h4>
                            {selectedContact && getStatusBadge(selectedContact.status)}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Message</h4>
                          <div className="bg-muted/50 p-4 rounded-lg">
                            <p className="text-sm whitespace-pre-wrap">{selectedContact?.message}</p>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`mailto:${contact.email}?subject=Re: ${contact.subject}`)}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Reply via Email
                  </Button>

                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`tel:${contact.phone}`)}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>

                  {contact.status === 'new' && (
                    <Button 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleStatusUpdate(contact.id, 'in_progress')}
                      disabled={updateStatusMutation.isPending}
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Mark In Progress
                    </Button>
                  )}

                  {contact.status !== 'responded' && (
                    <Button 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleStatusUpdate(contact.id, 'responded')}
                      disabled={updateStatusMutation.isPending}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark Responded
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {contacts?.length === 0 && (
          <Card className="card-elegant">
            <CardContent className="text-center py-12">
              <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Contact Submissions Found</h3>
              <p className="text-muted-foreground">
                {statusFilter === 'all' 
                  ? 'No contact submissions have been received yet.' 
                  : `No ${statusFilter} contact submissions found.`
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminContacts;
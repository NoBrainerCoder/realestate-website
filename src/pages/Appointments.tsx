import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MapPin, User, Mail, Phone, MessageSquare, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useState } from 'react';

const Appointments = () => {
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    property_id: '',
    visitor_name: '',
    visitor_email: user?.email || '',
    visitor_phone: '',
    preferred_date: '',
    preferred_time: '',
    message: '',
  });

  // Fetch properties for the dropdown
  const { data: properties = [] } = useQuery({
    queryKey: ['properties-for-appointment'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('id, title, location')
        .eq('status', 'approved')
        .order('title');
      
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch appointments
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['appointments', user?.id, isAdmin],
    queryFn: async () => {
      if (!user) return [];

      let query = supabase
        .from('appointment_requests')
        .select(`
          *,
          properties (
            id,
            title,
            location,
            property_images (
              image_url
            )
          )
        `)
        .order('created_at', { ascending: false });

      // If not admin, filter by email
      if (!isAdmin) {
        query = query.eq('visitor_email', user.email);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  // Book appointment mutation
  const bookAppointmentMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase
        .from('appointment_requests')
        .insert([{
          property_id: data.property_id,
          visitor_name: data.visitor_name,
          visitor_email: data.visitor_email,
          visitor_phone: data.visitor_phone,
          preferred_date: data.preferred_date,
          preferred_time: data.preferred_time,
          message: data.message,
          status: 'pending',
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Your appointment request has been sent to the admin for verification.');
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      setIsFormOpen(false);
      setFormData({
        property_id: '',
        visitor_name: '',
        visitor_email: user?.email || '',
        visitor_phone: '',
        preferred_date: '',
        preferred_time: '',
        message: '',
      });
    },
    onError: (error) => {
      toast.error('Failed to book appointment');
      console.error('Booking error:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.property_id || !formData.visitor_name || !formData.visitor_email || 
        !formData.visitor_phone || !formData.preferred_date || !formData.preferred_time) {
      toast.error('Please fill in all required fields');
      return;
    }

    bookAppointmentMutation.mutate(formData);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Please sign in to view appointments</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 page-transition">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-slide-up">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {isAdmin ? 'All Appointment Requests' : 'My Appointments'}
          </h1>
          <p className="text-lg text-muted-foreground">
            {appointments.length} appointment{appointments.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Booking Form */}
        {!isAdmin && (
          <Card className="mb-8 fade-in-scale">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Book New Appointment</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFormOpen(!isFormOpen)}
                >
                  {isFormOpen ? 'Hide Form' : 'Show Form'}
                </Button>
              </CardTitle>
            </CardHeader>
            {isFormOpen && (
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="property">Property *</Label>
                      <Select
                        value={formData.property_id}
                        onValueChange={(value) => setFormData({ ...formData, property_id: value })}
                      >
                        <SelectTrigger id="property">
                          <SelectValue placeholder="Select a property" />
                        </SelectTrigger>
                        <SelectContent>
                          {properties.map((property: any) => (
                            <SelectItem key={property.id} value={property.id}>
                              {property.title} - {property.location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.visitor_name}
                        onChange={(e) => setFormData({ ...formData, visitor_name: e.target.value })}
                        placeholder="Your full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.visitor_email}
                        onChange={(e) => setFormData({ ...formData, visitor_email: e.target.value })}
                        placeholder="your@email.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.visitor_phone}
                        onChange={(e) => setFormData({ ...formData, visitor_phone: e.target.value })}
                        placeholder="+1234567890"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date">Preferred Date *</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.preferred_date}
                        onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time">Preferred Time *</Label>
                      <Input
                        id="time"
                        type="time"
                        value={formData.preferred_time}
                        onChange={(e) => setFormData({ ...formData, preferred_time: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message (Optional)</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Any additional information..."
                      rows={3}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={bookAppointmentMutation.isPending}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {bookAppointmentMutation.isPending ? 'Booking...' : 'Book Appointment'}
                  </Button>
                </form>
              </CardContent>
            )}
          </Card>
        )}

        {appointments.length === 0 ? (
          <Card className="fade-in-scale">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">No appointments found</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 stagger-children">
            {appointments.map((appointment: any) => (
              <Card key={appointment.id} className="hover-lift overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        {appointment.properties?.title || 'Property'}
                      </CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {appointment.properties?.location || 'Location not available'}
                      </div>
                    </div>
                    <Badge variant={getStatusVariant(appointment.status)} className="capitalize">
                      {appointment.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <User className="h-4 w-4 mr-2 text-primary" />
                        <span className="font-medium mr-2">Name:</span>
                        <span className="text-muted-foreground">{appointment.visitor_name}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 mr-2 text-primary" />
                        <span className="font-medium mr-2">Email:</span>
                        <span className="text-muted-foreground">{appointment.visitor_email}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-primary" />
                        <span className="font-medium mr-2">Phone:</span>
                        <span className="text-muted-foreground">{appointment.visitor_phone}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-primary" />
                        <span className="font-medium mr-2">Date:</span>
                        <span className="text-muted-foreground">
                          {format(new Date(appointment.preferred_date), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-primary" />
                        <span className="font-medium mr-2">Time:</span>
                        <span className="text-muted-foreground">{appointment.preferred_time}</span>
                      </div>
                      {appointment.message && (
                        <div className="flex items-start text-sm">
                          <MessageSquare className="h-4 w-4 mr-2 text-primary mt-0.5" />
                          <div>
                            <span className="font-medium mr-2">Message:</span>
                            <p className="text-muted-foreground mt-1">{appointment.message}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;

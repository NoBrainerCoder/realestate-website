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
import { Calendar, Clock, MapPin, User, Mail, Phone, MessageSquare, Plus, CalendarDays } from 'lucide-react';
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

  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['appointments', user?.id, isAdmin],
    queryFn: async () => {
      if (!user) return [];
      let query = supabase
        .from('appointment_requests')
        .select(`*, properties (id, title, location)`)
        .order('created_at', { ascending: false });
      if (!isAdmin) {
        query = query.eq('visitor_email', user.email);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

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
    onError: () => {
      toast.error('Failed to book appointment');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.property_id || !formData.visitor_name || !formData.visitor_email ||
        !formData.visitor_phone || !formData.preferred_date || !formData.preferred_time) {
      toast.error('Please fill in all required fields');
      return;
    }
    bookAppointmentMutation.mutate(formData);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <CalendarDays className="h-16 w-16 mx-auto text-muted-foreground/50" />
            <h2 className="text-xl font-semibold text-foreground">Sign in to view appointments</h2>
            <p className="text-muted-foreground">Please sign in to book and manage your property viewing appointments.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'confirmed': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-background page-transition">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8 text-slide-up">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {isAdmin ? 'All Appointment Requests' : 'My Appointments'}
          </h1>
          <p className="text-muted-foreground">
            {isAdmin
              ? 'Manage all property viewing appointments'
              : 'Book and track your property viewing appointments'}
          </p>
        </div>

        {/* Book Appointment Section - Users Only */}
        {!isAdmin && (
          <Card className="mb-8 fade-in-scale border-primary/20">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Plus className="h-5 w-5 text-primary" />
                  Book New Appointment
                </CardTitle>
                <Button
                  variant={isFormOpen ? 'outline' : 'default'}
                  size="sm"
                  onClick={() => setIsFormOpen(!isFormOpen)}
                >
                  {isFormOpen ? 'Cancel' : 'Book Appointment'}
                </Button>
              </div>
            </CardHeader>
            {isFormOpen && (
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="property">Select Property *</Label>
                      <Select
                        value={formData.property_id}
                        onValueChange={(value) => setFormData({ ...formData, property_id: value })}
                      >
                        <SelectTrigger id="property">
                          <SelectValue placeholder="Choose a property to visit" />
                        </SelectTrigger>
                        <SelectContent>
                          {properties.map((property: any) => (
                            <SelectItem key={property.id} value={property.id}>
                              {property.title} — {property.location}
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
                        placeholder="Your phone number"
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
                      placeholder="Any additional details or questions..."
                      rows={3}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={bookAppointmentMutation.isPending}
                  >
                    <CalendarDays className="h-4 w-4 mr-2" />
                    {bookAppointmentMutation.isPending ? 'Submitting...' : 'Submit Appointment Request'}
                  </Button>
                </form>
              </CardContent>
            )}
          </Card>
        )}

        {/* Appointments List */}
        {appointments.length === 0 ? (
          <Card className="fade-in-scale">
            <CardContent className="py-16 text-center space-y-4">
              <CalendarDays className="h-20 w-20 mx-auto text-muted-foreground/30" />
              <h3 className="text-xl font-semibold text-foreground">No appointments booked yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {isAdmin
                  ? 'No appointment requests have been received yet.'
                  : 'You haven\'t booked any property viewing appointments yet. Click "Book Appointment" above to get started.'}
              </p>
              {!isAdmin && !isFormOpen && (
                <Button onClick={() => setIsFormOpen(true)} className="mt-2">
                  <Plus className="h-4 w-4 mr-2" />
                  Book Your First Appointment
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 stagger-children">
            {appointments.map((appointment: any) => (
              <Card key={appointment.id} className="hover-lift overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">
                        {appointment.properties?.title || 'Property'}
                      </CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground">
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
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <User className="h-4 w-4 mr-2 text-primary" />
                        <span className="text-muted-foreground">{appointment.visitor_name}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 mr-2 text-primary" />
                        <span className="text-muted-foreground">{appointment.visitor_email}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-4 w-4 mr-2 text-primary" />
                        <span className="text-muted-foreground">{appointment.visitor_phone}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-primary" />
                        <span className="text-muted-foreground">
                          {format(new Date(appointment.preferred_date), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2 text-primary" />
                        <span className="text-muted-foreground">{appointment.preferred_time}</span>
                      </div>
                      {appointment.message && (
                        <div className="flex items-start text-sm">
                          <MessageSquare className="h-4 w-4 mr-2 text-primary mt-0.5" />
                          <p className="text-muted-foreground">{appointment.message}</p>
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

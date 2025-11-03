import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, User, Mail, Phone, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

const Appointments = () => {
  const { user, isAdmin } = useAuth();

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-yellow-500';
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
                    <Badge className={`${getStatusColor(appointment.status)} text-white capitalize`}>
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

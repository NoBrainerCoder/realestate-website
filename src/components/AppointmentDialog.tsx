import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AppointmentDialogProps {
  propertyId: string;
  propertyTitle: string;
}

const AppointmentDialog = ({ propertyId, propertyTitle }: AppointmentDialogProps) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const bookingMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const data = {
        property_id: propertyId,
        visitor_name: formData.get('name') as string,
        visitor_email: formData.get('email') as string,
        visitor_phone: formData.get('phone') as string,
        preferred_date: formData.get('date') as string,
        preferred_time: formData.get('time') as string,
        message: formData.get('message') as string,
      };

      const { error } = await supabase
        .from('appointment_requests')
        .insert([data]);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Appointment Requested',
        description: 'Your visit request has been submitted. The property owner will contact you soon.',
      });
      setOpen(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to book appointment. Please try again.',
        variant: 'destructive',
      });
      console.error('Booking error:', error);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    bookingMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full btn-hero">
          <Calendar className="h-4 w-4 mr-2" />
          Book a Visit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule a Property Visit</DialogTitle>
          <DialogDescription>
            Book an appointment to visit {propertyTitle}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" required placeholder="John Doe" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required placeholder="john@example.com" />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" name="phone" type="tel" required placeholder="+91 98765 43210" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Preferred Date</Label>
              <Input 
                id="date" 
                name="date" 
                type="date" 
                required 
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <Label htmlFor="time">Preferred Time</Label>
              <Input id="time" name="time" type="time" required />
            </div>
          </div>
          <div>
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea 
              id="message" 
              name="message" 
              placeholder="Any specific requirements or questions..."
              rows={3}
            />
          </div>
          <Button type="submit" className="w-full" disabled={bookingMutation.isPending}>
            {bookingMutation.isPending ? 'Booking...' : 'Request Appointment'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDialog;
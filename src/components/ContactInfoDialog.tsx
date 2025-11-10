import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

interface ContactInfoDialogProps {
  trigger?: React.ReactNode;
  className?: string;
}

const ContactInfoDialog = ({ trigger, className }: ContactInfoDialogProps) => {
  const [open, setOpen] = useState(false);
  const phoneNumber = '+919866123350';
  const email = 'myinfrahub.com@gmail.com';
  const whatsappLink = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className={className}>
            <Phone className="h-4 w-4 mr-2" />
            Contact
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-2xl">Contact Information</DialogTitle>
          <DialogDescription>
            Get in touch with us through any of these channels
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Phone */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-full">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Phone Number</h3>
                <p className="text-foreground/80 text-sm">Call us for immediate assistance</p>
              </div>
            </div>
            <a
              href={`tel:${phoneNumber}`}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all duration-200 font-medium hover-lift"
            >
              <Phone className="h-4 w-4" />
              Call Now: {phoneNumber}
            </a>
          </div>

          {/* WhatsApp */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#25D366]/10 rounded-full">
                <MessageCircle className="h-5 w-5 text-[#25D366]" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">WhatsApp</h3>
                <p className="text-foreground/80 text-sm">Chat with us instantly</p>
              </div>
            </div>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-lg transition-all duration-200 font-medium hover-lift"
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </a>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-full">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Email</h3>
                <p className="text-foreground/80 text-sm">Send us your queries</p>
              </div>
            </div>
            <a
              href={`mailto:${email}`}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all duration-200 font-medium hover-lift"
            >
              <Mail className="h-4 w-4" />
              Send Email
            </a>
          </div>

          {/* Location */}
          <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
            <div className="p-3 bg-primary/10 rounded-full">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Our Service Area</h3>
              <p className="text-foreground/80">Hyderabad, Telangana</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactInfoDialog;
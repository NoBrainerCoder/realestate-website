import { Link } from 'react-router-dom';
import { Building2, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 stagger-children">
          {/* Company Info */}
          <div className="space-y-4 reveal-left revealed">
            <div className="flex items-center space-x-2 hover-scale">
              <Building2 className="h-8 w-8 animate-float" />
              <span className="text-xl font-bold">MyInfraHub</span>
            </div>
            <p className="text-primary-foreground/80">
              Your trusted partner in finding the perfect property. We connect buyers and sellers across Hyderabad.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 stagger-children">
              <li>
                <Link to="/" className="text-primary-foreground/80 hover:text-primary-foreground transition-all duration-300 hover:translate-x-2 block">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/properties" className="text-primary-foreground/80 hover:text-primary-foreground transition-all duration-300 hover:translate-x-2 block">
                  Properties
                </Link>
              </li>
              <li>
                <Link to="/post-property" className="text-primary-foreground/80 hover:text-primary-foreground transition-all duration-300 hover:translate-x-2 block">
                  Post Property
                </Link>
              </li>
              <li>
                <Link to="/emi-calculator" className="text-primary-foreground/80 hover:text-primary-foreground transition-all duration-300 hover:translate-x-2 block">
                  EMI Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Company</h3>
            <ul className="space-y-2 stagger-children">
              <li>
                <Link to="/about" className="text-primary-foreground/80 hover:text-primary-foreground transition-all duration-300 hover:translate-x-2 block">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-primary-foreground/80 hover:text-primary-foreground transition-all duration-300 hover:translate-x-2 block">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-primary-foreground/80 hover:text-primary-foreground transition-all duration-300 hover:translate-x-2 block">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 reveal-right revealed">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-3 stagger-children">
              <div className="flex items-center space-x-3 hover:bg-white/10 p-2 rounded-lg transition-all duration-300 cursor-pointer group">
                <Phone className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                <span>9866123350</span>
              </div>
              <div className="flex items-center space-x-3 hover:bg-white/10 p-2 rounded-lg transition-all duration-300 cursor-pointer group">
                <Mail className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                <span>myinfrahub.com@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3 hover:bg-white/10 p-2 rounded-lg transition-all duration-300 cursor-pointer group">
                <MapPin className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                <span>Hyderabad, Telangana</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center fade-in-scale">
          <p className="text-primary-foreground/80">
            © 2024 MyInfraHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
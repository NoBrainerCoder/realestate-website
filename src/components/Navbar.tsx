import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Building2, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Properties', path: '/properties' },
    { name: 'Post Property', path: '/post-property' },
    { name: 'EMI Calculator', path: '/emi-calculator' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover-scale">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">MyInfraHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-primary bg-accent active'
                    : 'text-foreground hover:text-primary hover:bg-accent/50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            <Link to="/sign-in">
              <Button variant="outline" size="sm" className="hover-lift ripple">
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
            </Link>
            <Link to="/sign-up">
              <Button size="sm" className="btn-hero ripple">
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-sm slide-in-down">
            <div className="px-2 pt-2 pb-3 space-y-1 stagger-children">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-primary bg-accent active'
                      : 'text-foreground hover:text-primary hover:bg-accent/50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-2 border-t border-border">
                <Link to="/sign-in" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full ripple">
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
                <Link to="/sign-up" onClick={() => setIsMenuOpen(false)}>
                  <Button size="sm" className="w-full btn-hero ripple">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
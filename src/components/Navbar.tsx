import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Home, Building2, Calculator, Info, Mail, LogIn, UserPlus, LogOut, Shield } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import logoIcon from '@/assets/logo-icon-hq.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();

  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/properties', icon: Building2, label: 'Properties' },
    { to: '/emi-calculator', icon: Calculator, label: 'EMI Calculator' },
    { to: '/about', icon: Info, label: 'About Us' },
    { to: '/contact', icon: Mail, label: 'Contact' },
  ];

  return (
    <nav className="bg-primary backdrop-blur-md border-b border-primary-foreground/10 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover-scale">
            <img src={logoIcon} alt="MyInfraHub" className="h-10 w-auto md:h-11" />
            <span className="text-xl md:text-2xl font-bold">
              <span className="text-white">MyInfra</span>
              <span className="text-yellow-400">Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <div className="flex items-center space-x-1 bg-white/10 rounded-full p-1">
              {navLinks.map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full transition-colors ${
                    location.pathname === to
                      ? 'text-primary bg-white shadow-sm'
                      : 'text-white/90 hover:text-white hover:bg-white/20'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{label}</span>
                </Link>
              ))}
            </div>

            {/* Auth Section */}
            <div className="ml-6 flex items-center space-x-2">
              {user ? (
                <div className="flex items-center space-x-2">
                  {user && (
                    <Link
                      to="/post-property"
                      className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                        location.pathname === '/post-property'
                          ? 'text-primary bg-white shadow-sm'
                          : 'text-white/90 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Building2 className="h-4 w-4" />
                      My Properties
                    </Link>
                  )}
                  
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                        location.pathname.startsWith('/admin')
                          ? 'text-primary bg-white shadow-sm'
                          : 'text-white/90 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Shield className="h-4 w-4" />
                      Admin Panel
                    </Link>
                  )}
                  
                  <Button 
                    onClick={signOut}
                    variant="outline" 
                    size="sm" 
                    className="hover-lift ripple border-white/20 text-white hover:bg-white/10 hover:text-white"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/sign-in">
                    <Button variant="outline" size="sm" className="hover-lift ripple border-white/20 text-white hover:bg-white/10 hover:text-white">
                      <LogIn className="h-4 w-4 mr-2" />
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/sign-up">
                    <Button size="sm" className="ripple bg-white text-primary hover:bg-white/90">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-white hover:bg-white/10 hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden py-4 space-y-2 border-t border-white/10 slide-in-down">
            <div className="space-y-1 stagger-children">
              {navLinks.map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                    location.pathname === to
                      ? 'text-primary bg-white shadow-sm'
                      : 'text-white/90 hover:text-white hover:bg-white/10'
                  }`}
                  onClick={closeMenu}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              ))}

              {/* Mobile Auth Links */}
              <div className="border-t border-white/10 pt-2 mt-2">
                {user ? (
                  <>
                    <div className="px-3 py-2 text-sm text-white/70">
                      Signed in as: {user.email}
                    </div>
                    
                    {user && (
                      <Link
                        to="/post-property"
                        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                          location.pathname === '/post-property'
                            ? 'text-primary bg-white shadow-sm'
                            : 'text-white/90 hover:text-white hover:bg-white/10'
                        }`}
                        onClick={closeMenu}
                      >
                        <Building2 className="h-4 w-4" />
                        My Properties
                      </Link>
                    )}
                    
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                          location.pathname.startsWith('/admin')
                            ? 'text-primary bg-white shadow-sm'
                            : 'text-white/90 hover:text-white hover:bg-white/10'
                        }`}
                        onClick={closeMenu}
                      >
                        <Shield className="h-4 w-4" />
                        Admin Panel
                      </Link>
                    )}
                    
                    <Button
                      onClick={() => {
                        signOut();
                        closeMenu();
                      }}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start mt-2 ripple border-white/20 text-white hover:bg-white/10 hover:text-white"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Link to="/sign-in" onClick={closeMenu}>
                      <Button variant="outline" size="sm" className="w-full justify-start ripple border-white/20 text-white hover:bg-white/10 hover:text-white">
                        <LogIn className="h-4 w-4 mr-2" />
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/sign-up" onClick={closeMenu}>
                      <Button size="sm" className="w-full ripple bg-white text-primary hover:bg-white/90">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
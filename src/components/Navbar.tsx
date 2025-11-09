import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Home, Building2, Calculator, Info, Mail, LogIn, UserPlus, LogOut, Shield, Calendar, PlusCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
// DarkModeToggle removed - dark mode is now permanent

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();

  const closeMenu = () => setIsOpen(false);

  const navLinks = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/properties?type=buy', icon: Building2, label: 'Buy' },
    { to: '/properties?type=rent', icon: Building2, label: 'Rent' },
    { to: '/post-property', icon: Building2, label: 'Sell' },
    { to: '/emi-calculator', icon: Calculator, label: 'EMI Calculator' },
    { to: '/about', icon: Info, label: 'About Us' },
    { to: '/contact', icon: Mail, label: 'Contact' },
    { to: '/appointments', icon: Calendar, label: 'Appointments' },
  ];

  return (
    <nav className="bg-primary backdrop-blur-md border-b border-primary-foreground/10 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center hover-scale">
            <span className="text-2xl md:text-3xl font-bold">
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

            {/* CTA Button */}
            <Link to="/post-property" className="ml-4">
              <Button 
                className="bg-gradient-to-r from-[#ff7b00] to-[#ff9f40] hover:from-[#ff6600] hover:to-[#ff8c2e] text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border-0"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Post Free Property
              </Button>
            </Link>

            {/* Dark mode is now permanent - no toggle needed */}

            {/* Auth Section */}
            <div className="ml-2 flex items-center space-x-2">
              {user ? (
                <div className="flex items-center space-x-2">
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
                    className="hover-lift ripple bg-transparent border-white text-white hover:bg-white/10 hover:text-white hover:border-white"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/sign-in">
                    <Button variant="outline" size="sm" className="hover-lift ripple bg-transparent border-white text-white hover:bg-white/10 hover:text-white hover:border-white">
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
          <div className="flex items-center gap-2 lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 hover:text-white"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
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

              {/* Post Free Property CTA - Mobile */}
              <Link to="/post-property" onClick={closeMenu}>
                <Button 
                  className="w-full bg-gradient-to-r from-[#ff7b00] to-[#ff9f40] hover:from-[#ff6600] hover:to-[#ff8c2e] text-white shadow-lg hover:scale-105 transition-all duration-300 border-0"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Post Free Property
                </Button>
              </Link>

              {/* Mobile Auth Links */}
              <div className="border-t border-white/10 pt-2 mt-2">
                {user ? (
                  <>
                    <div className="px-3 py-2 text-sm text-white/70">
                      Signed in as: {user.email}
                    </div>
                    
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
                      className="w-full justify-start mt-2 ripple bg-transparent border-white text-white hover:bg-white/10 hover:text-white hover:border-white"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Link to="/sign-in" onClick={closeMenu}>
                      <Button variant="outline" size="sm" className="w-full justify-start ripple bg-transparent border-white text-white hover:bg-white/10 hover:text-white hover:border-white">
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
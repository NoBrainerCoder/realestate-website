import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Home, Building2, Calculator, Mail, LogIn, UserPlus, LogOut, Shield, PlusCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const navLinks = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/properties', icon: Building2, label: 'Properties' },
  { to: '/post-property', icon: PlusCircle, label: 'Post Property' },
  { to: '/emi-calculator', icon: Calculator, label: 'EMI Calculator' },
  { to: '/contact', icon: Mail, label: 'Contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="bg-primary border-b border-primary-foreground/10 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center">
            <span className="text-xl md:text-2xl font-bold">
              <span className="text-white">MyInfra</span>
              <span className="text-yellow-400">Hub</span>
            </span>
          </Link>

          {/* Desktop */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                  location.pathname === to
                    ? 'bg-white text-primary'
                    : 'text-white/90 hover:bg-white/10'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}

            <div className="ml-3 flex items-center gap-2">
              {user ? (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-white/90 hover:bg-white/10"
                    >
                      <Shield className="h-4 w-4" /> Admin
                    </Link>
                  )}
                  <Button onClick={signOut} variant="outline" size="sm" className="bg-transparent border-white/30 text-white hover:bg-white/10">
                    <LogOut className="h-4 w-4 mr-1.5" /> Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/sign-in">
                    <Button variant="outline" size="sm" className="bg-transparent border-white/30 text-white hover:bg-white/10">
                      <LogIn className="h-4 w-4 mr-1.5" /> Sign In
                    </Button>
                  </Link>
                  <Link to="/sign-up">
                    <Button size="sm" className="bg-white text-primary hover:bg-white/90">
                      <UserPlus className="h-4 w-4 mr-1.5" /> Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile button */}
          <div className="lg:hidden">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 hover:text-white" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <div
          className={`lg:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
            isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-3 space-y-1 border-t border-white/10">
            {navLinks.map(({ to, icon: Icon, label }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={closeMenu}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-white/90 hover:bg-white/10 active:bg-white/15'
                  }`}
                >
                  <Icon className="h-5 w-5" /> {label}
                </Link>
              );
            })}
            <div className="border-t border-white/10 pt-3 mt-2 space-y-2 px-1">
              {user ? (
                <>
                  {isAdmin && (
                    <Link to="/admin" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white/90 hover:bg-white/10">
                      <Shield className="h-5 w-5" /> Admin
                    </Link>
                  )}
                  <Button onClick={() => { signOut(); closeMenu(); }} variant="outline" className="w-full h-11 bg-transparent border-white/30 text-white hover:bg-white/10">
                    <LogOut className="h-4 w-4 mr-1.5" /> Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/sign-in" onClick={closeMenu} className="block">
                    <Button variant="outline" className="w-full h-11 bg-transparent border-white/30 text-white hover:bg-white/10">
                      <LogIn className="h-4 w-4 mr-1.5" /> Sign In
                    </Button>
                  </Link>
                  <Link to="/sign-up" onClick={closeMenu} className="block">
                    <Button className="w-full h-11 bg-white text-primary hover:bg-white/90">
                      <UserPlus className="h-4 w-4 mr-1.5" /> Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
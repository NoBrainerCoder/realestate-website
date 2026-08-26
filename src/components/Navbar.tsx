import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Home, Building2, Calculator, Mail, LogIn, UserPlus, LogOut, Shield, PlusCircle, Key, Tag, CalendarDays } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const navLinks = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/properties?type=buy', icon: Building2, label: 'Buy' },
  { to: '/properties?type=rent', icon: Key, label: 'Rent' },
  { to: '/post-property', icon: Tag, label: 'Sell' },
  { to: '/appointments', icon: CalendarDays, label: 'Appointments' },
  { to: '/post-property', icon: PlusCircle, label: 'Post Property' },
  { to: '/emi-calculator', icon: Calculator, label: 'EMI Calculator' },
  { to: '/contact', icon: Mail, label: 'Contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();

  const closeMenu = () => setIsOpen(false);
  const currentPath = `${location.pathname}${location.search}`;

  const isActive = (to: string) => {
    if (to.includes('?')) return currentPath === to;
    return location.pathname === to && !location.search;
  };

  return (
    <nav className="bg-primary border-b border-primary-foreground/10 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 gap-4">
          <Link to="/" className="flex items-center shrink-0">
            <span className="text-xl md:text-2xl font-bold">
              <span className="text-white">MyInfra</span>
              <span className="text-yellow-400">Hub</span>
            </span>
          </Link>

          {/* Desktop — centred link bar */}
          <div className="hidden lg:flex flex-1 items-center justify-center gap-0.5">
            {navLinks.map(({ to, icon: Icon, label }) => (
              <Link
                key={label}
                to={to}
                className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm transition-colors after:absolute after:left-2.5 after:right-2.5 after:-bottom-0.5 after:h-[2px] after:rounded-full after:bg-[#FFA500] after:transition-transform after:duration-300 after:origin-left ${
                  isActive(to)
                    ? 'text-white after:scale-x-100'
                    : 'text-white/85 hover:text-white after:scale-x-0 hover:after:scale-x-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2 shrink-0">
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
                <Button
                  onClick={signOut}
                  size="sm"
                  className="rounded-full bg-white/10 backdrop-blur-md border border-white/25 text-white hover:bg-white/20"
                >
                  <LogOut className="h-4 w-4 mr-1.5" /> Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/sign-in">
                  <Button
                    size="sm"
                    className="rounded-full bg-white/10 backdrop-blur-md border border-white/25 text-white hover:bg-white/20"
                  >
                    <LogIn className="h-4 w-4 mr-1.5" /> Sign In
                  </Button>
                </Link>
                <Link to="/sign-up">
                  <Button size="sm" className="rounded-full bg-white text-primary hover:bg-white/90">
                    <UserPlus className="h-4 w-4 mr-1.5" /> Sign Up
                  </Button>
                </Link>
              </>
            )}
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
            isOpen ? 'max-h-[700px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-3 space-y-1 border-t border-white/10">
            {navLinks.map(({ to, icon: Icon, label }) => (
              <Link
                key={label}
                to={to}
                onClick={closeMenu}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive(to)
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-white/90 hover:bg-white/10 active:bg-white/15'
                }`}
              >
                <Icon className="h-5 w-5" /> {label}
              </Link>
            ))}
            <div className="border-t border-white/10 pt-3 mt-2 space-y-2 px-1">
              {user ? (
                <>
                  {isAdmin && (
                    <Link to="/admin" onClick={closeMenu} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white/90 hover:bg-white/10">
                      <Shield className="h-5 w-5" /> Admin
                    </Link>
                  )}
                  <Button onClick={() => { signOut(); closeMenu(); }} className="w-full h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/25 text-white hover:bg-white/20">
                    <LogOut className="h-4 w-4 mr-1.5" /> Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/sign-in" onClick={closeMenu} className="block">
                    <Button className="w-full h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/25 text-white hover:bg-white/20">
                      <LogIn className="h-4 w-4 mr-1.5" /> Sign In
                    </Button>
                  </Link>
                  <Link to="/sign-up" onClick={closeMenu} className="block">
                    <Button className="w-full h-11 rounded-full bg-white text-primary hover:bg-white/90">
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

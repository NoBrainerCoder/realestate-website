import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Home, Building2, Calculator, Mail, LogIn, UserPlus, LogOut, Shield, Calendar, PlusCircle, ChevronDown } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const propertyTypeCategories = [
  { label: 'Apartment', type: 'Flat / Apartment' },
  { label: 'Villa', type: 'Villa' },
  { label: 'Independent House', type: 'Independent House' },
  { label: 'Duplex', type: 'Duplex House' },
  { label: 'Penthouse', type: 'Penthouse' },
  { label: 'Plot', type: 'Residential Plot' },
  { label: 'Commercial', type: 'Commercial Building' },
  { label: 'Office Space', type: 'Office Space' },
  { label: 'Shop / Showroom', type: 'Shop / Showroom' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [buyDropdown, setBuyDropdown] = useState(false);
  const [sellDropdown, setSellDropdown] = useState(false);
  const [mobileBuyOpen, setMobileBuyOpen] = useState(false);
  const buyRef = useRef<HTMLDivElement>(null);
  const sellRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();

  const closeMenu = () => {
    setIsOpen(false);
    setMobileBuyOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsVisible(false);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (buyRef.current && !buyRef.current.contains(e.target as Node)) setBuyDropdown(false);
      if (sellRef.current && !sellRef.current.contains(e.target as Node)) setSellDropdown(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const navLinks = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/emi-calculator', icon: Calculator, label: 'Calculator' },
    { to: '/contact', icon: Mail, label: 'Contact' },
    { to: '/appointments', icon: Calendar, label: 'Appointments' },
  ];

  return (
    <nav className={`bg-primary backdrop-blur-md border-b border-primary-foreground/10 sticky top-0 z-50 transition-transform duration-300 ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      <div className="container mx-auto px-3">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center hover-scale">
            <span className="text-xl md:text-2xl font-bold">
              <span className="text-white">MyInfra</span>
              <span className="text-yellow-400">Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <div className="flex items-center space-x-0.5 bg-white/10 rounded-full p-0.5">
              {/* Home */}
              <Link
                to="/"
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-all duration-200 ${
                  location.pathname === '/'
                    ? 'text-primary bg-white shadow-sm'
                    : 'text-white/90 hover:text-[#FFA500] hover:bg-white/20'
                }`}
              >
                <Home className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">Home</span>
              </Link>

              {/* Buy Dropdown */}
              <div ref={buyRef} className="relative"
                onMouseEnter={() => setBuyDropdown(true)}
                onMouseLeave={() => setBuyDropdown(false)}
              >
                <button
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-full transition-all duration-200 text-white/90 hover:text-[#FFA500] hover:bg-white/20"
                  onClick={() => setBuyDropdown(!buyDropdown)}
                >
                  <Building2 className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">Buy</span>
                  <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${buyDropdown ? 'rotate-180' : ''}`} />
                </button>
                {buyDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-popover border border-border rounded-lg shadow-xl py-1 z-50 animate-in fade-in-0 zoom-in-95 duration-200">
                    <Link
                      to="/properties?type=buy"
                      className="block px-4 py-2 text-sm text-popover-foreground hover:bg-accent transition-colors"
                      onClick={() => setBuyDropdown(false)}
                    >
                      All Properties
                    </Link>
                    <div className="h-px bg-border my-1" />
                    {propertyTypeCategories.map((cat) => (
                      <Link
                        key={cat.type}
                        to={`/properties?type=buy&propertyType=${encodeURIComponent(cat.type)}`}
                        className="block px-4 py-2 text-sm text-popover-foreground hover:bg-accent transition-colors"
                        onClick={() => setBuyDropdown(false)}
                      >
                        {cat.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Rent */}
              <Link
                to="/properties?type=rent"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-all duration-200 text-white/90 hover:text-[#FFA500] hover:bg-white/20"
              >
                <Building2 className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">Rent</span>
              </Link>

              {/* Sell Dropdown */}
              <div ref={sellRef} className="relative"
                onMouseEnter={() => setSellDropdown(true)}
                onMouseLeave={() => setSellDropdown(false)}
              >
                <button
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-full transition-all duration-200 text-white/90 hover:text-[#FFA500] hover:bg-white/20"
                  onClick={() => setSellDropdown(!sellDropdown)}
                >
                  <Building2 className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">Sell</span>
                  <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${sellDropdown ? 'rotate-180' : ''}`} />
                </button>
                {sellDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-popover border border-border rounded-lg shadow-xl py-1 z-50 animate-in fade-in-0 zoom-in-95 duration-200">
                    <Link
                      to="/post-property"
                      className="block px-4 py-2 text-sm text-popover-foreground hover:bg-accent transition-colors font-medium"
                      onClick={() => setSellDropdown(false)}
                    >
                      Post Your Property
                    </Link>
                    <div className="h-px bg-border my-1" />
                    {propertyTypeCategories.map((cat) => (
                      <Link
                        key={cat.type}
                        to={`/post-property?type=${encodeURIComponent(cat.type)}`}
                        className="block px-4 py-2 text-sm text-popover-foreground hover:bg-accent transition-colors"
                        onClick={() => setSellDropdown(false)}
                      >
                        {cat.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Rest of nav links */}
              {navLinks.slice(1).map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-all duration-200 ${
                    location.pathname === to
                      ? 'text-primary bg-white shadow-sm'
                      : 'text-white/90 hover:text-[#FFA500] hover:bg-white/20'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">{label}</span>
                </Link>
              ))}
            </div>

            {/* Post Property CTA */}
            <Link to="/post-property" className="ml-3">
              <Button
                size="sm"
                className="btn-post-property bg-gradient-to-r from-[#FF8C00] to-[#FFB84D] hover:from-[#ff6600] hover:to-[#ff8c2e] text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border-0 text-xs px-3 py-1.5 h-8"
              >
                <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
                Post Property
              </Button>
            </Link>

            {/* Auth Section */}
            <div className="ml-1.5 flex items-center space-x-1.5">
              {user ? (
                <div className="flex items-center space-x-1.5">
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md transition-colors ${
                        location.pathname.startsWith('/admin')
                          ? 'text-primary bg-white shadow-sm'
                          : 'text-white/90 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Shield className="h-3.5 w-3.5" />
                      <span className="text-xs">Admin</span>
                    </Link>
                  )}
                  <Button
                    onClick={signOut}
                    variant="outline"
                    size="sm"
                    className="sign-btn hover-lift ripple bg-transparent border-2 border-[#7FB3FF] text-white hover:bg-gradient-to-r hover:from-[#6CA6FF] hover:to-[#1E90FF] hover:shadow-[0_0_10px_rgba(111,170,255,0.7)] hover:scale-105 hover:border-[#7FB3FF] text-xs px-2.5 py-1.5 h-8 rounded-lg transition-all duration-300"
                  >
                    <LogOut className="h-3.5 w-3.5 mr-1.5" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-1.5">
                  <Link to="/sign-in">
                    <Button variant="outline" size="sm" className="sign-btn hover-lift ripple bg-transparent border-2 border-[#7FB3FF] text-white hover:bg-gradient-to-r hover:from-[#6CA6FF] hover:to-[#1E90FF] hover:shadow-[0_0_10px_rgba(111,170,255,0.7)] hover:scale-105 hover:border-[#7FB3FF] text-xs px-2.5 py-1.5 h-8 rounded-lg transition-all duration-300 group">
                      <LogIn className="h-3.5 w-3.5 mr-1.5" />
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/sign-up">
                    <Button size="sm" className="ripple bg-white text-primary hover:bg-white/90 text-xs px-2.5 py-1.5 h-8">
                      <UserPlus className="h-3.5 w-3.5 mr-1.5" />
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
              <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-md text-white/90 hover:text-white hover:bg-white/10 transition-colors" onClick={closeMenu}>
                <Home className="h-4 w-4" /> Home
              </Link>

              {/* Mobile Buy with sub-items */}
              <div>
                <button
                  className="flex items-center justify-between w-full px-3 py-2 rounded-md text-white/90 hover:text-white hover:bg-white/10 transition-colors"
                  onClick={() => setMobileBuyOpen(!mobileBuyOpen)}
                >
                  <span className="flex items-center gap-3"><Building2 className="h-4 w-4" /> Buy</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${mobileBuyOpen ? 'rotate-180' : ''}`} />
                </button>
                {mobileBuyOpen && (
                  <div className="pl-10 space-y-1 mt-1">
                    <Link to="/properties?type=buy" className="block py-1.5 text-sm text-white/70 hover:text-white transition-colors" onClick={closeMenu}>All Properties</Link>
                    {propertyTypeCategories.map((cat) => (
                      <Link key={cat.type} to={`/properties?type=buy&propertyType=${encodeURIComponent(cat.type)}`} className="block py-1.5 text-sm text-white/70 hover:text-white transition-colors" onClick={closeMenu}>
                        {cat.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link to="/properties?type=rent" className="flex items-center gap-3 px-3 py-2 rounded-md text-white/90 hover:text-white hover:bg-white/10 transition-colors" onClick={closeMenu}>
                <Building2 className="h-4 w-4" /> Rent
              </Link>

              <Link to="/post-property" className="flex items-center gap-3 px-3 py-2 rounded-md text-white/90 hover:text-white hover:bg-white/10 transition-colors" onClick={closeMenu}>
                <Building2 className="h-4 w-4" /> Sell
              </Link>

              {navLinks.slice(1).map(({ to, icon: Icon, label }) => (
                <Link key={to} to={to} className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${location.pathname === to ? 'text-primary bg-white shadow-sm' : 'text-white/90 hover:text-white hover:bg-white/10'}`} onClick={closeMenu}>
                  <Icon className="h-4 w-4" /> {label}
                </Link>
              ))}

              <Link to="/post-property" onClick={closeMenu}>
                <Button className="w-full bg-gradient-to-r from-[#ff7b00] to-[#ff9f40] hover:from-[#ff6600] hover:to-[#ff8c2e] text-white shadow-lg border-0">
                  <PlusCircle className="h-4 w-4 mr-2" /> Post Free Property
                </Button>
              </Link>

              {/* Mobile Auth */}
              <div className="border-t border-white/10 pt-2 mt-2">
                {user ? (
                  <>
                    <div className="px-3 py-2 text-sm text-white/70">Signed in as: {user.email}</div>
                    {isAdmin && (
                      <Link to="/admin" className="flex items-center gap-2 px-3 py-2 rounded-md text-white/90 hover:text-white hover:bg-white/10 transition-colors" onClick={closeMenu}>
                        <Shield className="h-4 w-4" /> Admin Panel
                      </Link>
                    )}
                    <Button onClick={() => { signOut(); closeMenu(); }} variant="outline" size="sm" className="w-full justify-start mt-2 bg-transparent border-2 border-[#7FB3FF] text-white hover:bg-gradient-to-r hover:from-[#6CA6FF] hover:to-[#1E90FF] rounded-lg transition-all duration-300">
                      <LogOut className="h-4 w-4 mr-2" /> Sign Out
                    </Button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Link to="/sign-in" onClick={closeMenu}>
                      <Button variant="outline" size="sm" className="w-full justify-start bg-transparent border-2 border-[#7FB3FF] text-white rounded-lg">
                        <LogIn className="h-4 w-4 mr-2" /> Sign In
                      </Button>
                    </Link>
                    <Link to="/sign-up" onClick={closeMenu}>
                      <Button size="sm" className="w-full bg-white text-primary hover:bg-white/90">
                        <UserPlus className="h-4 w-4 mr-2" /> Sign Up
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

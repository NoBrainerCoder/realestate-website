import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { X, MapPin, Bed, Bath, Maximize, ImageOff, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const AdminSlideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { data: properties = [] } = useQuery({
    queryKey: ['slideshow-properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select(`*, property_images (id, image_url, media_type, display_order)`)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const nextSlide = useCallback(() => {
    if (properties.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % properties.length);
  }, [properties.length]);

  const prevSlide = useCallback(() => {
    if (properties.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + properties.length) % properties.length);
  }, [properties.length]);

  // Auto-advance
  useEffect(() => {
    if (!isPlaying || properties.length === 0) return;
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [isPlaying, nextSlide, properties.length]);

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (document.fullscreenElement) document.exitFullscreen();
        setIsFullscreen(false);
      }
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === ' ') { e.preventDefault(); setIsPlaying((p) => !p); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [nextSlide, prevSlide]);

  const enterFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } catch {
      setIsFullscreen(true);
    }
  };

  useEffect(() => {
    const handler = () => { if (!document.fullscreenElement) setIsFullscreen(false); };
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
    return `₹${price.toLocaleString()}`;
  };

  if (properties.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-lg">No approved properties to display.</p>
      </div>
    );
  }

  const property = properties[currentIndex];
  const images = (property.property_images || []).sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0));
  const mainImage = images.find((img: any) => img.media_type === 'image')?.image_url;

  // Slideshow content (used in both normal and fullscreen)
  const slideshowContent = (
    <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      {mainImage ? (
        <img
          src={mainImage}
          alt={property.title}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
          key={property.id}
        />
      ) : (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <ImageOff className="h-24 w-24 text-muted-foreground/30" />
        </div>
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

      {/* Property Info */}
      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 text-white z-10">
        <div className="max-w-4xl animate-in slide-in-from-bottom-4 duration-500" key={`info-${property.id}`}>
          <Badge className="mb-4 bg-primary/90 text-primary-foreground text-sm px-4 py-1">
            {property.property_type}
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-3 drop-shadow-lg">{property.title}</h2>
          <div className="flex items-center gap-2 text-white/90 text-lg mb-4">
            <MapPin className="h-5 w-5" />
            <span>{property.location}</span>
          </div>
          <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-6">
            {formatPrice(property.price)}
          </div>
          <div className="flex flex-wrap gap-6 text-white/80 text-base">
            <div className="flex items-center gap-2"><Bed className="h-5 w-5" /> {property.bedrooms} Beds</div>
            <div className="flex items-center gap-2"><Bath className="h-5 w-5" /> {property.bathrooms} Baths</div>
            <div className="flex items-center gap-2"><Maximize className="h-5 w-5" /> {property.area} {property.area_unit}</div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-white/40 text-white">{property.furnishing}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
        <span className="text-white/70 text-sm bg-black/40 px-3 py-1 rounded-full">
          {currentIndex + 1} / {properties.length}
        </span>
        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-9 w-9" onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        {isFullscreen && (
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-9 w-9" onClick={() => { document.exitFullscreen?.(); setIsFullscreen(false); }}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Nav Arrows */}
      <Button variant="ghost" size="icon" className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12 z-20" onClick={prevSlide}>
        <ChevronLeft className="h-8 w-8" />
      </Button>
      <Button variant="ghost" size="icon" className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12 z-20" onClick={nextSlide}>
        <ChevronRight className="h-8 w-8" />
      </Button>

      {/* Progress dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
        {properties.slice(0, 20).map((_: any, i: number) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-2 rounded-full transition-all duration-300 ${i === currentIndex ? 'w-8 bg-yellow-400' : 'w-2 bg-white/40 hover:bg-white/60'}`}
          />
        ))}
        {properties.length > 20 && <span className="text-white/40 text-xs ml-1">+{properties.length - 20}</span>}
      </div>
    </div>
  );

  if (isFullscreen) {
    return <div className="fixed inset-0 z-[9999]">{slideshowContent}</div>;
  }

  return (
    <div className="min-h-screen bg-background page-transition">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">Property Slideshow</h1>
            <p className="text-muted-foreground">Full-screen property display for office presentations</p>
          </div>
          <Button onClick={enterFullscreen} className="bg-gradient-to-r from-primary to-primary/80">
            Start Full-Screen Slideshow
          </Button>
        </div>

        {/* Preview */}
        <div className="rounded-xl overflow-hidden border border-border shadow-xl" style={{ aspectRatio: '16/9' }}>
          {slideshowContent}
        </div>

        <p className="text-sm text-muted-foreground mt-4 text-center">
          Use ← → arrow keys to navigate, Space to pause/play, Esc to exit fullscreen
        </p>
      </div>
    </div>
  );
};

export default AdminSlideshow;

import { useState, useEffect } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import ImageLightbox from './ImageLightbox';

interface PropertyImage {
  id: string;
  image_url: string;
  media_type: 'image' | 'video';
  display_order: number;
}

interface PropertyImageCarouselProps {
  images: PropertyImage[];
  autoplay?: boolean;
  autoplayDelay?: number;
}

const PropertyImageCarousel = ({ 
  images, 
  autoplay = true, 
  autoplayDelay = 3000 
}: PropertyImageCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const sortedImages = [...images].sort((a, b) => a.display_order - b.display_order);

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <div className="relative group">
        <Carousel
          setApi={setApi}
          opts={{
            align: 'start',
            loop: true,
          }}
          plugins={autoplay ? [
            Autoplay({
              delay: autoplayDelay,
              stopOnInteraction: true,
              stopOnMouseEnter: true,
            }),
          ] : []}
          className="w-full"
        >
          <CarouselContent>
            {sortedImages.map((media, index) => (
              <CarouselItem key={media.id}>
                <div 
                  className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden cursor-pointer"
                  onClick={() => handleImageClick(index)}
                >
                  {media.media_type === 'video' ? (
                    <video
                      src={media.image_url}
                      controls
                      className="w-full h-full object-cover"
                      onMouseEnter={(e) => e.currentTarget.play()}
                      onMouseLeave={(e) => e.currentTarget.pause()}
                      muted
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <img
                      src={media.image_url}
                      alt="Property"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  )}
                  {/* Click to expand indicator */}
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-medium bg-black/50 px-4 py-2 rounded-full">
                      Click to expand
                    </span>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        <CarouselPrevious className="left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CarouselNext className="right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Carousel>

      {/* Dot Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              current === index + 1
                ? 'w-8 bg-primary'
                : 'w-2 bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

        {/* Image Counter */}
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium z-10">
          {current} / {count}
        </div>
      </div>

      {/* Lightbox */}
      <ImageLightbox
        media={sortedImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
};

export default PropertyImageCarousel;

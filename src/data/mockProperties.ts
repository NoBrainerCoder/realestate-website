export const mockProperties = [
  {
    id: '1',
    title: 'Luxury 3BHK Apartment in Gachibowli',
    location: 'Gachibowli, Hyderabad',
    price: 12500000,
    area: 1450,
    bedrooms: 3,
    bathrooms: 3,
    type: 'Apartment',
    furnishing: 'Semi-Furnished',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
    isNew: true,
    description: 'Beautiful 3BHK apartment with modern amenities in prime Gachibowli location.',
    amenities: ['Gym', 'Swimming Pool', 'Parking', 'Security', '24/7 Power Backup'],
    age: '2 years',
  },
  {
    id: '2',
    title: 'Spacious 2BHK in Kukatpally',
    location: 'Kukatpally, Hyderabad',
    price: 7500000,
    area: 1200,
    bedrooms: 2,
    bathrooms: 2,
    type: 'Apartment',
    furnishing: 'Furnished',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
    isNew: false,
    description: 'Well-maintained 2BHK apartment with all modern amenities.',
    amenities: ['Parking', 'Security', 'Lift', 'Water Supply'],
    age: '5 years',
  },
  {
    id: '3',
    title: 'Independent Villa in Madhapur',
    location: 'Madhapur, Hyderabad',
    price: 25000000,
    area: 2800,
    bedrooms: 4,
    bathrooms: 4,
    type: 'Villa',
    furnishing: 'Unfurnished',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
    isNew: true,
    description: 'Stunning independent villa with garden and modern architecture.',
    amenities: ['Garden', 'Parking', 'Security', 'Generator Backup'],
    age: 'Under Construction',
  },
  {
    id: '4',
    title: 'Commercial Space in Ameerpet',
    location: 'Ameerpet, Hyderabad',
    price: 18000000,
    area: 2000,
    bedrooms: 0,
    bathrooms: 2,
    type: 'Commercial',
    furnishing: 'Unfurnished',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop',
    isNew: false,
    description: 'Prime commercial space perfect for offices or retail business.',
    amenities: ['Parking', 'Lift', 'Security', 'Central AC'],
    age: '3 years',
  },
  {
    id: '5',
    title: 'Modern 1BHK Studio in Hitech City',
    location: 'Hitech City, Hyderabad',
    price: 4500000,
    area: 650,
    bedrooms: 1,
    bathrooms: 1,
    type: 'Apartment',
    furnishing: 'Furnished',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
    isNew: true,
    description: 'Compact and modern studio apartment in IT hub.',
    amenities: ['Gym', 'Swimming Pool', 'Security', 'Parking'],
    age: '1 year',
  },
  {
    id: '6',
    title: 'Duplex House in Kondapur',
    location: 'Kondapur, Hyderabad',
    price: 15000000,
    area: 2200,
    bedrooms: 3,
    bathrooms: 3,
    type: 'Independent House',
    furnishing: 'Semi-Furnished',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
    isNew: false,
    description: 'Spacious duplex with terrace garden and premium fittings.',
    amenities: ['Terrace Garden', 'Parking', 'Security', 'Solar Panels'],
    age: '4 years',
  }
];

export const getPropertyById = (id: string) => {
  return mockProperties.find(property => property.id === id);
};

export const filterProperties = (filters: any) => {
  return mockProperties.filter(property => {
    if (filters.area && !property.location.toLowerCase().includes(filters.area.toLowerCase())) {
      return false;
    }
    if (filters.bhk && property.bedrooms !== parseInt(filters.bhk)) {
      return false;
    }
    if (filters.propertyType && property.type.toLowerCase() !== filters.propertyType.toLowerCase()) {
      return false;
    }
    if (filters.furnishing && property.furnishing.toLowerCase() !== filters.furnishing.toLowerCase()) {
      return false;
    }
    if (filters.budget && (property.price < filters.budget[0] || property.price > filters.budget[1])) {
      return false;
    }
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      return property.title.toLowerCase().includes(searchLower) || 
             property.location.toLowerCase().includes(searchLower);
    }
    return true;
  });
};
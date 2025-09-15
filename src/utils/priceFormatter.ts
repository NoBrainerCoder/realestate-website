// Utility functions for price formatting

export const formatPriceInput = (input: string): string => {
  // Remove any non-numeric characters except decimal point
  const cleaned = input.replace(/[^\d.]/g, '');
  
  // Handle shorthand formats
  const lowerInput = input.toLowerCase().trim();
  
  // Convert shorthand to actual numbers
  if (lowerInput.includes('cr') || lowerInput.includes('crore')) {
    const numericPart = parseFloat(cleaned);
    if (!isNaN(numericPart)) {
      return (numericPart * 10000000).toString(); // 1 crore = 10,000,000
    }
  }
  
  if (lowerInput.includes('l') || lowerInput.includes('lakh')) {
    const numericPart = parseFloat(cleaned);
    if (!isNaN(numericPart)) {
      return (numericPart * 100000).toString(); // 1 lakh = 100,000
    }
  }
  
  if (lowerInput.includes('k') || lowerInput.includes('thousand')) {
    const numericPart = parseFloat(cleaned);
    if (!isNaN(numericPart)) {
      return (numericPart * 1000).toString(); // 1k = 1,000
    }
  }
  
  return cleaned;
};

export const displayPrice = (price: string | number): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numPrice)) return '0';
  
  // Format as crores and lakhs for display
  if (numPrice >= 10000000) {
    const crores = numPrice / 10000000;
    return `₹${crores.toFixed(2)} Cr`;
  } else if (numPrice >= 100000) {
    const lakhs = numPrice / 100000;
    return `₹${lakhs.toFixed(2)} L`;
  } else if (numPrice >= 1000) {
    const thousands = numPrice / 1000;
    return `₹${thousands.toFixed(1)}K`;
  } else {
    return `₹${numPrice.toLocaleString()}`;
  }
};

export const parsePriceShorthand = (input: string): number => {
  const result = formatPriceInput(input);
  return parseFloat(result) || 0;
};
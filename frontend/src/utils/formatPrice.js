export const formatPrice = (price) => {
  if (price === undefined || price === null) return '৳0';
  return `৳${Number(price).toLocaleString('en-BD')}`;
};

export const formatPriceCompact = (price) => {
  if (price >= 100000) return `৳${(price / 100000).toFixed(1)}L`;
  if (price >= 1000) return `৳${(price / 1000).toFixed(0)}K`;
  return `৳${price}`;
};

export const getDiscountPercent = (price, discountPrice) => {
  if (!discountPrice || discountPrice >= price) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
};

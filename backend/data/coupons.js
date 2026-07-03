const coupons = [
  {
    code: 'SAVE10',
    discountType: 'percentage',
    discountValue: 10,
    minPurchase: 5000,
    maxUses: 100,
    usedCount: 0,
    expiresAt: new Date('2027-12-31'),
    isActive: true
  },
  {
    code: 'FLAT500',
    discountType: 'fixed',
    discountValue: 500,
    minPurchase: 3000,
    maxUses: 50,
    usedCount: 0,
    expiresAt: new Date('2027-12-31'),
    isActive: true
  },
  {
    code: 'WELCOME20',
    discountType: 'percentage',
    discountValue: 20,
    minPurchase: 10000,
    maxUses: 200,
    usedCount: 0,
    expiresAt: new Date('2027-06-30'),
    isActive: true
  }
];

export default coupons;

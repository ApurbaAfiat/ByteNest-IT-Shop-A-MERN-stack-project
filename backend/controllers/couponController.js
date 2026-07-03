import Coupon from '../models/couponModel.js';

// @desc     Validate and apply coupon
// @method   POST
// @endpoint /api/v1/coupons/apply
// @access   Private
const applyCoupon = async (req, res, next) => {
  try {
    const { code, cartTotal } = req.body;

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true
    });

    if (!coupon) {
      res.statusCode = 404;
      throw new Error('Invalid coupon code.');
    }

    if (coupon.expiresAt < new Date()) {
      res.statusCode = 400;
      throw new Error('Coupon has expired.');
    }

    if (coupon.usedCount >= coupon.maxUses) {
      res.statusCode = 400;
      throw new Error('Coupon usage limit reached.');
    }

    if (cartTotal < coupon.minPurchase) {
      res.statusCode = 400;
      throw new Error(`Minimum purchase of ৳${coupon.minPurchase} required.`);
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round((cartTotal * coupon.discountValue) / 100);
    } else {
      discount = coupon.discountValue;
    }

    // Don't let discount exceed cart total
    discount = Math.min(discount, cartTotal);

    // Increment used count
    coupon.usedCount += 1;
    await coupon.save();

    res.status(200).json({
      message: 'Coupon applied!',
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discount
    });
  } catch (error) {
    next(error);
  }
};

// @desc     Validate coupon (check only, don't apply)
// @method   POST
// @endpoint /api/v1/coupons/validate
// @access   Private
const validateCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true
    });

    if (!coupon) {
      res.statusCode = 404;
      throw new Error('Invalid coupon code.');
    }

    if (coupon.expiresAt < new Date()) {
      res.statusCode = 400;
      throw new Error('Coupon has expired.');
    }

    if (coupon.usedCount >= coupon.maxUses) {
      res.statusCode = 400;
      throw new Error('Coupon usage limit reached.');
    }

    res.status(200).json({
      valid: true,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minPurchase: coupon.minPurchase
    });
  } catch (error) {
    next(error);
  }
};

export { applyCoupon, validateCoupon };

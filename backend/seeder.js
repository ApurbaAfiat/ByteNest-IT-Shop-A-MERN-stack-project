import mongoose from 'mongoose';
import users from './data/users.js';
import products from './data/products.js';
import categories from './data/categories.js';
import coupons from './data/coupons.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Category from './models/categoryModel.js';
import Coupon from './models/couponModel.js';
import Order from './models/orderModel.js';
import connectDB from './config/db.js';
import colors from 'colors';
import 'dotenv/config';

connectDB();

const importData = async () => {
  try {
    // Clear all existing data
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();
    await Coupon.deleteMany();

    // Seed users (password hashing handled by pre-save hook)
    const createdUsers = await User.create(users);
    const adminUser = createdUsers[0]._id;

    // Seed categories
    await Category.insertMany(categories);
    console.log('Categories seeded!'.green);

    // Seed coupons
    await Coupon.insertMany(coupons);
    console.log('Coupons seeded!'.green);

    // Seed products (assign admin user to all)
    const sampleProducts = products.map(product => ({
      ...product,
      user: adminUser
    }));
    await Product.insertMany(sampleProducts);
    console.log('Products seeded!'.green);

    console.log('All Data Imported Successfully!'.green.inverse);
    process.exit();
  } catch (error) {
    console.log(`Error: ${error.message}`.red.inverse);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();
    await Coupon.deleteMany();

    console.log('All Data Destroyed!'.red.inverse);
    process.exit();
  } catch (error) {
    console.log(`Error: ${error.message}`.red.inverse);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}

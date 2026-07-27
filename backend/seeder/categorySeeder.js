// Run with: npm run seed
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Category = require('../models/Category');

const categories = [
  'Electronics',
  'Clothing',
  'Home & Kitchen',
  'Sports & Outdoors',
  'Books',
  'Toys & Games',
  'Beauty & Personal Care',
  'Groceries',
];

const seed = async () => {
  try {
    await connectDB();
    for (const name of categories) {
      await Category.updateOne({ name }, { $setOnInsert: { name } }, { upsert: true });
    }
    console.log(`Seeded ${categories.length} categories`);
  } catch (err) {
    console.error('Seeding failed:', err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seed();

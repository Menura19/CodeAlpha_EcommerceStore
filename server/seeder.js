import dotenv from 'dotenv';
import mongoose from 'mongoose';

import connectDB from './config/db.js';
import Product from './models/Product.js';

dotenv.config();

const products = [
  {
    name: 'Wireless Headphones',
    description: 'Comfortable wireless headphones with clear sound.',
    price: 12999,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    category: 'Electronics',
    stock: 12,
    rating: 4.5,
  },
  {
    name: 'Smart Watch',
    description: 'Fitness tracking smartwatch with modern design.',
    price: 18999,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    category: 'Electronics',
    stock: 8,
    rating: 4.3,
  },
  {
    name: 'Laptop Backpack',
    description: 'Durable backpack suitable for laptops and daily use.',
    price: 6499,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
    category: 'Accessories',
    stock: 20,
    rating: 4.6,
  },
  {
    name: 'Running Shoes',
    description: 'Lightweight running shoes for everyday workouts.',
    price: 9999,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    category: 'Fashion',
    stock: 15,
    rating: 4.4,
  },
  {
    name: 'Mechanical Keyboard',
    description: 'Responsive mechanical keyboard for work and gaming.',
    price: 14999,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3',
    category: 'Electronics',
    stock: 10,
    rating: 4.7,
  },
  {
    name: 'Wireless Mouse',
    description: 'Compact wireless mouse with smooth tracking.',
    price: 5499,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46',
    category: 'Electronics',
    stock: 25,
    rating: 4.2,
  },
];

const seedProducts = async () => {
  try {
    await connectDB();

    await Product.deleteMany();
    await Product.insertMany(products);

    console.log('Products seeded successfully');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`Seeder failed: ${error.message}`);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedProducts();
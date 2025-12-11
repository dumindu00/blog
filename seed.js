require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('./models/Post');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/portfolio';

const samplePosts = [
  {
    pageName: 'Home',
    title: 'Welcome Project',
    description: 'A short intro project for the homepage.',
    image: '/pic/home-1.jpg',
    link: ''
  },
  {
    pageName: 'FindMore',
    title: 'Research Tool',
    description: 'Tool that helps you find more resources.',
    image: '/pic/findmore-1.jpg',
    link: 'https://example.com/research'
  },
  {
    pageName: 'About',
    title: 'Portfolio Overview',
    description: 'About page project listing.',
    image: '/pic/about-1.jpg',
    link: ''
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding');
    // Remove existing
    await Post.deleteMany({});
    // Insert sample
    const created = await Post.insertMany(samplePosts);
    console.log('Seeded posts:', created.length);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();

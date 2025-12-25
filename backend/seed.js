const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');

dotenv.config();

const seedUser = {
  name: 'Demo Student',
  email: 'student@example.com',
  password: 'Password123!',
};

const seed = async () => {
  try {
    await connectDB();

    const existing = await User.findOne({ email: seedUser.email });
    if (existing) {
      console.log('Seed user already exists.');
      process.exit(0);
    }

    await User.create(seedUser);
    console.log('Seed user created: student@example.com / Password123!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seed();


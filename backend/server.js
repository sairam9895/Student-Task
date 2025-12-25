const express = require('express');
const net = require('net');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const User = require('./models/User');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

dotenv.config();

const ensureDefaultUser = async () => {
  const email = process.env.DEFAULT_USER_EMAIL || 'student@example.com';
  const name = process.env.DEFAULT_USER_NAME || 'Demo Student';
  const password = process.env.DEFAULT_USER_PASSWORD || 'Password123!';

  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Default user already exists.');
    return;
  }

  await User.create({ name, email, passwordHash: password });
  console.log(`Default user created: ${email}`);
};

const findAvailablePort = (preferredPort, attempts = 20) =>
  new Promise((resolve, reject) => {
    if (attempts <= 0) {
      reject(new Error('No available ports found'));
      return;
    }

    const server = net.createServer();
    server.unref();

    server.on('error', () => {
      server.close();
      resolve(findAvailablePort(preferredPort + 1, attempts - 1));
    });

    server.listen(preferredPort, () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });

const startServer = async () => {
  await connectDB();
  await ensureDefaultUser();

  const app = express();

  // CORS configuration - allow Vercel frontend and localhost
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:3000',
  ].filter(Boolean);

  app.use(cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  }));
  app.use(express.json());

  app.get('/', (req, res) => {
    res.send('API is running...');
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/tasks', taskRoutes);

  // Error Handling Middleware
  app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  });

  const preferredPort = parseInt(process.env.PORT, 10) || 5001;
  const PORT = await findAvailablePort(preferredPort);

  if (PORT !== preferredPort) {
    console.log(`Preferred port ${preferredPort} in use, switched to ${PORT}`);
  }

  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
};

startServer();

import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { connectDB } from './lib/db.js'; // Adjust the path as needed
import authRoutes from './routes/auth.route.js'; // Adjust the path as needed
import messageRoutes from './routes/message.route.js'; // Adjust the path as needed
import { app, server } from './lib/socket.js'; // Adjust the path as needed

// Configure environment variables
dotenv.config();

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000", "https://spawn-nine.vercel.app"],
    credentials: true,
  })
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.send('Welcome to ChatApp');
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'));
  });
}

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB()
});

// Export the app for Vercel
export default app;
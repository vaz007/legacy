const app = require('./app');
const connectDB = require('./config/db');
require('dotenv').config();

// Connect to MongoDB
connectDB();

// Start the server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT || 5000, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle Unhandled Promise Rejections
process.on('unhandledRejection', (err, promise) => {
  // console.log(`Error: ${err.message}`.red)
  // close server and exit process
  server.close(() => {
    process.exit(1);
  });
});

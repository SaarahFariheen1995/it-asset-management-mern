const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
// const colors = require('colors'); // For coloured console output
const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

// Import new route files
const authRoutes = require('./routes/authRoutes');
const assetRoutes = require('./routes/assetRoutes');
const disposalRoutes = require('./routes/disposalRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');


const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/authRoutes'));
//app.use('/api/tasks', require('./routes/taskRoutes'));
app.use(express.urlencoded({ extended: false }));

// Use existing auth routes
app.use('/api/users', authRoutes);


// Export the app object for testing
// if (require.main === module) {
    connectDB();
    // If the file is run directly, start the server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log('Server running on port ${PORT}'));
  // }

// Use new feature routes
app.use('/api/assets', assetRoutes);
app.use('/api/disposals', disposalRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/assignments', assignmentRoutes);

// Error handling middleware (should be last)
app.use(errorHandler);

module.exports = app
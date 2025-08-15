const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const assetRoutes = require('./routes/assetRoutes');
const disposalRoutes = require('./routes/disposalRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');


const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', require('./routes/authRoutes'));
//app.use('/api/tasks', require('./routes/taskRoutes'));
app.use(express.urlencoded({ extended: false }));

app.use('/api/users', authRoutes);


    connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log('Server running on port ${PORT}'));

app.use('/api/assets', assetRoutes);
app.use('/api/disposals', disposalRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/assignments', assignmentRoutes);

app.use(errorHandler);

module.exports = app
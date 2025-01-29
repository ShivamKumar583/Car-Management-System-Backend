const express = require('express');
const cors = require('cors');
const database = require('./config/database');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
// const {cloudinaryConnect} = require('./config/cloudinary');
const setupSwagger = require('./config/swagger');
const userRoutes = require('./routes/userRoutes');
const carRoutes = require('./routes/carRoutes');
const multer = require('multer');
const { cloudinaryConnect } = require('./config/cloudinary');

require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// MongoDB connection
database.connect();

cloudinaryConnect();

// Initialize Swagger documentation
setupSwagger(app);

// Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/cars', carRoutes);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// def route
app.get('/' , (req,res) => {
    return res.json({
        success:true,
        message:'Your server is up and running.'
    })
})
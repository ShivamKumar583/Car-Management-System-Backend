const express = require('express');
const upload = require('../middleware/upload');  // Assuming your multer setup is in middleware/upload.js
const {createCar, getAllCars,getCarById,updateCar, deleteCar, getCarsByUserId, searchCars} = require('../controllers/carController');
const {verifyToken} = require('../utils/auth')

const router = express.Router();
// search 
router.get('/search', searchCars); // Search route

// Create a car
router.post('/create', upload.array('images', 10),verifyToken, createCar);

// Get all cars
router.get('',verifyToken, getAllCars);

// Get a car by ID
router.get('/:id',verifyToken,getCarById);

// Get card by userId
router.get('/user/:id',verifyToken,getCarsByUserId);

// Update a car
router.put('/update/:id', upload.array('images', 10),verifyToken, updateCar);

// Delete a car
router.delete('/delete/:id',verifyToken, deleteCar);




module.exports = router;

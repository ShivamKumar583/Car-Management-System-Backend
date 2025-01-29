const express = require('express');
const {
  createCar,
  getAllCars,
  getCarById,
  getCarsByUserId,
  updateCar,
  deleteCar,
  searchCars
} = require('../controllers/carController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cars
 *   description: Car management APIs
 */

/**
 * @swagger
 * /cars/create:
 *   post:
 *     summary: Create a new car listing
 *     tags: [Cars]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - car_type
 *               - company
 *               - dealer
 *               - tags
 *               - images
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Tesla Model S"
 *               description:
 *                 type: string
 *                 example: "A premium electric sedan"
 *               car_type:
 *                 type: string
 *                 example: "Sedan"
 *               company:
 *                 type: string
 *                 example: "Tesla"
 *               dealer:
 *                 type: string
 *                 example: "Tesla Dealers"
 *               tags:
 *                 type: string
 *                 example: "electric, sedan, luxury"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Car created successfully
 *       400:
 *         description: More than 10 images uploaded or invalid data
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /cars:
 *   get:
 *     summary: Get all available cars
 *     tags: [Cars]
 *     responses:
 *       200:
 *         description: List of all cars
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /cars/{id}:
 *   get:
 *     summary: Get details of a specific car
 *     tags: [Cars]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "64bda0f5f7b9e01234567890"
 *     responses:
 *       200:
 *         description: Car details retrieved successfully
 *       404:
 *         description: Car not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /cars/user/{id}:
 *   get:
 *     summary: Get all cars created by a specific user
 *     tags: [Cars]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "64bd9fa3f7b9e01234567890"
 *     responses:
 *       200:
 *         description: List of cars created by the user
 *       404:
 *         description: No cars found for the user
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /cars/update/{id}:
 *   put:
 *     summary: Update car details
 *     tags: [Cars]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "64bda0f5f7b9e01234567890"
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               car_type:
 *                 type: string
 *               company:
 *                 type: string
 *               dealer:
 *                 type: string
 *               tags:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               existingImages:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["image1.jpg", "image2.jpg"]
 *     responses:
 *       200:
 *         description: Car updated successfully
 *       403:
 *         description: User not authorized to update this car
 *       404:
 *         description: Car not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /cars/delete/{id}:
 *   delete:
 *     summary: Delete a car listing
 *     tags: [Cars]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "64bda0f5f7b9e01234567890"
 *     responses:
 *       200:
 *         description: Car deleted successfully
 *       403:
 *         description: User not authorized to delete this car
 *       404:
 *         description: Car not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /cars/search:
 *   get:
 *     summary: Search for cars
 *     tags: [Cars]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         example: "Tesla"
 *     responses:
 *       200:
 *         description: List of matching cars
 *       400:
 *         description: Missing search query
 *       500:
 *         description: Internal server error
 */

router.post('/create', createCar);
router.get('/', getAllCars);
router.get('/:id', getCarById);
router.get('/user/:id', getCarsByUserId);
router.put('/update/:id', updateCar);
router.delete('/delete/:id', deleteCar);
router.get('/search', searchCars);

module.exports = router;

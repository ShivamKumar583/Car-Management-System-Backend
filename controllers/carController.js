const Car = require('../models/carModel');
const {uploadImagesToCloudinary} = require('../config/cloudinary')

exports.createCar = async (req, res) => {
    try {
      console.log('done-1')

        // Ensure only up to 10 images
        if (req.files.length > 10) {
          return res.status(400).json({success:false, message: 'You can only upload a maximum of 10 images' });
        }
        console.log('done0')

        // Upload images to Cloudinary
        const imageUrls = await uploadImagesToCloudinary(req.files);
        console.log('done1' , imageUrls)

        const car = new Car({
          title: req.body.title,
          description: req.body.description,
          car_type: req.body.car_type,
          company: req.body.company,
          dealer: req.body.dealer,
          tags: req.body.tags.split(','),
          images: imageUrls,
          user:req.user.id
        });

        console.log('done')
    
        await car.save();
        console.log('done with create')
        res.status(201).json({success:true, car});
      } catch (error) {
        res.status(500).json({ success:false,message: 'Error creating car', error });
      }
};

// Get all cars
exports.getAllCars = async (req, res) => {
    try {
      const cars = await Car.find();
      console.log('done');
      res.status(200).json({success:true, cars});
    } catch (error) {
      res.status(500).json({success:false, message: 'Error fetching cars', error });
    }
  };

// Get a car by ID
exports.getCarById = async (req, res) => {
    try {
      const car = await Car.findById(req.params.id);
      console.log('car' , car)
      if (!car) {
        return res.status(404).json({success:false, message: 'Car not found' });
      }
      res.status(200).json({success:true,car});
    } catch (error) {
      res.status(500).json({success:false, message: 'Error in fetching car details', error });
    }
  };

  // get car by userId
exports.getCarsByUserId = async (req, res) => {
  try {
    const userId = req.params.id;

    // Validate userId
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }

    // Find cars for the given userId
    const cars = await Car.find({ user:userId });

    // If no cars found
    if (!cars || cars.length === 0) {
      return res.status(404).json({ success: false, message: 'No cars found for this user' });
    }

    res.status(200).json({ success: true, data: cars });
  } catch (error) {
    console.error('Error fetching cars:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Update a car
exports.updateCar = async (req, res) => {
  try {
    const userId = req?.user?.id || req.body.userId; // Assuming req.user is populated via authentication middleware
    const carId = req.params.id;
    // Find the car by ID
    const car = await Car.findById(carId);

    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found' });
    }
 
    // Check if the user is the owner of the car
    if (car.user.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'You are not authorized to update this car' });
    }
    console.log('yaha0');

    // Ensure only up to 10 images
    if (req.files.length > 10) {
      return res.status(400).json({ success: false, message: 'You can only upload a maximum of 10 images' });
    }
    console.log('yaha');
    // Upload images to Cloudinary
    const imageUrls = await uploadImagesToCloudinary(req.files);
    console.log('imageUrls', imageUrls)
    if (!imageUrls) {

      if(!imageUrls.success){
        imageUrls = req.body.existingImages
      } 

      else {
        return res.status(400).json({ success: false, message: 'Unable to upload images to Cloudinary.' });
      }
    }
    console.log('yaha2');

    // Update the car
    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body?.description,
        tags: req.body?.tags?.split(','),
        images: imageUrls.length > 0 ? imageUrls : req.body.existingImages,
        car_type: req.body?.car_type,
        company: req.body?.company,
        dealer: req.body?.dealer,
      },
      { new: true }
    );

    res.status(200).json({ success: true, car: updatedCar });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error in updating car', error: error.message });
  }
};


// Delete a car
exports.deleteCar = async (req, res) => {
  try {
    const userId = req.user?.id; // Ensure the userId is retrieved correctly

    console.log('userId' , userId)
    // Find and delete the car where both ID and user match
    const car = await Car.findOneAndDelete({ _id: req.params.id, user: userId });

    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found or you are not authorized to delete it' });
    }

    res.status(200).json({ success: true, message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting car', error: error.message });
  }
};

// Search cars
exports.searchCars = async (req, res) => {
  try {
    const { query } = req.query;
    console.log('query' , query);
    if (!query) {
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }

    // Perform a case-insensitive search
    const cars = await Car.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { car_type: { $regex: query, $options: 'i' } },
        { company: { $regex: query, $options: 'i' } },
        { dealer: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ]
    });
    console.log('done wiht this')

    res.status(200).json({ success: true, cars });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error searching cars', error: error.message });
  }
};
const User = require('../models/userModel');
const { generateToken } = require('../utils/auth');
const bcrypt = require('bcryptjs');

// Register a new user
exports.register = async (req, res) => {
  const { email, password, name } = req.body;

  // Ensure username is not null or undefined
  if (!name || !email || !password) {
    return res.status(400).json({success:false, message: "All fields are required." });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({success:false, message: 'User already exists' });
    }

    // Create new user
    const newUser = new User({
      email,
      password,
      name, // Ensure username is being passed
    });

    await newUser.save(); // Save to the database

    // Generate JWT token
    const token = generateToken(newUser);

    // Create user object to send in the response
    const user = {
      id: newUser._id,
      username: newUser.name,
      email: newUser.email,
    };

    // Send response with token and user details
    res.status(201).json({success:true, token, user });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({success:false, message: 'Error registering user', error: error.message });
  }
};


// Login an existing user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).populate().exec();

    if (!user) {
      return res.status(400).json({success:false, message: 'Invalid credentials' });
    }

    // todo 
    const isMatch = await bcrypt.compare(password ,user.password);

    if (!isMatch) {
      return res.status(400).json({success:false, message: 'Invalid credentials' });
    }
    const token = generateToken(user);
    user.password = "";
    res.status(200).json({success:true, token, user });
  } catch (error) {
    res.status(500).json({success:false, message: 'Error logging in', error });
  }
};

// Get logged-in user data
exports.getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({success:false, message: 'User not found' });
    }
    res.status(200).json({success:true,user});
  } catch (error) {
    res.status(500).json({success:false, message: 'Error fetching user data', error });
  }
};


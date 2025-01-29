const mongoose = require('mongoose');

// Car Schema
const carSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    car_type: {
        type: String,
        required: true,
    },
    company: {
        type: String,
        required: true,
    },
    dealer: {
        type: String,
        required: true,
    },

    tags: {
        type: [String],
        required: true,
    },
    images: {
        type: [String],
        validate: {
            validator: function (val) {
                return val.length <= 10; // Maximum of 10 images
            },
            message: '{PATH} exceeds the limit of 10 images.',
        },
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to User model
        required: true,
    },
}, { timestamps: true });

const Car = mongoose.model('Car', carSchema);

module.exports = Car;

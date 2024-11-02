const mongoose = require('mongoose');

// User Schema and Model
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 30,
        match: /^[a-zA-Z0-9_.\s-]*$/,  // Allows letters, numbers, spaces, underscores, hyphens, and dots
        trim: true,  // Trims whitespace around the input
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        validate: {
            validator: function(v) {
                return /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*]{6,}$/.test(v);  // Enforces letters, numbers, and allows special characters
            },
            message: props => `Password must be at least 6 characters long and contain both letters and numbers.`,
        },
    },
});

const User = mongoose.model('User', userSchema);
module.exports = User;

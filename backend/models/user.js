const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String, 
        required: true 
    },
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: {
        type: String, 
        required: true 
    },
    email: {
        type: String, 
        required: true, 
        unique: true 
    },
    number: {
        type: String, 
        required: true 
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
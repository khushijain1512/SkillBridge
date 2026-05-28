const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user by email
router.get('/email/:email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user by ID (for backward compatibility)
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new user
router.post('/', async (req, res) => {
    try {
        const { name, email, role, phone, skills, category, image, pastExperience } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(200).json(existingUser);
        }
        
        const user = new User({
            name,
            email,
            role,
            phone: phone || '',
            skills: skills || category || ''
        });
        
        // Add optional fields if provided
        if (category) user.skills = category;
        if (image) user.image = image;
        if (pastExperience) user.pastExperience = pastExperience;
        
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update user by email
router.put('/email/:email', async (req, res) => {
    try {
        const { name, phone, skills, category, image, pastExperience } = req.body;
        const user = await User.findOne({ email: req.params.email });
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (skills) user.skills = skills;
        if (category) user.skills = category;
        if (image) user.image = image;
        if (pastExperience) user.pastExperience = pastExperience;
        
        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update user by ID (backward compatibility)
router.put('/:id', async (req, res) => {
    try {
        const { name, phone, skills } = req.body;
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (skills) user.skills = skills;
        
        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete user
router.delete('/:email', async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ email: req.params.email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
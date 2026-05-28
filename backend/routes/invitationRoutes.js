const express = require('express');
const Invitation = require('../models/Invitation');
const router = express.Router();

// Get all invitations
router.get('/', async (req, res) => {
    try {
        const invitations = await Invitation.find();
        res.json(invitations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create invitation
router.post('/', async (req, res) => {
    try {
        const { id, projectId, clientEmail, freelancerEmail, status, sentAt } = req.body;
        const invitation = new Invitation({ id, projectId, clientEmail, freelancerEmail, status, sentAt });
        const newInvitation = await invitation.save();
        res.status(201).json(newInvitation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update invitation status
router.put('/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const invitation = await Invitation.findOne({ id: req.params.id });
        if (!invitation) {
            return res.status(404).json({ message: 'Invitation not found' });
        }
        invitation.status = status;
        const updatedInvitation = await invitation.save();
        res.json(updatedInvitation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
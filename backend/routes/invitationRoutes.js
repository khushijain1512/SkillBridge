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

// Get invitations by freelancer email
router.get('/freelancer/:email', async (req, res) => {
    try {
        const invitations = await Invitation.find({ freelancerEmail: req.params.email });
        res.json(invitations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get invitations by client email
router.get('/client/:email', async (req, res) => {
    try {
        const invitations = await Invitation.find({ clientEmail: req.params.email });
        res.json(invitations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get invitations by project
router.get('/project/:projectId', async (req, res) => {
    try {
        const invitations = await Invitation.find({ projectId: req.params.projectId });
        res.json(invitations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create invitation
router.post('/', async (req, res) => {
    try {
        const { id, projectId, clientEmail, freelancerEmail, status, sentAt } = req.body;
        
        // Check if invitation already exists
        const existing = await Invitation.findOne({ projectId, freelancerEmail });
        if (existing) {
            return res.status(200).json(existing);
        }
        
        const invitation = new Invitation({ 
            id: id || `inv_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
            projectId, 
            clientEmail, 
            freelancerEmail, 
            status: status || 'pending', 
            sentAt: sentAt || Date.now() 
        });
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
        // Try to find by custom id field first, then by MongoDB _id
        let invitation = await Invitation.findOne({ id: req.params.id });
        if (!invitation) {
            invitation = await Invitation.findById(req.params.id);
        }
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

// Delete invitation
router.delete('/:id', async (req, res) => {
    try {
        let invitation = await Invitation.findOne({ id: req.params.id });
        if (!invitation) {
            invitation = await Invitation.findById(req.params.id);
        }
        if (!invitation) {
            return res.status(404).json({ message: 'Invitation not found' });
        }
        await invitation.deleteOne();
        res.json({ message: 'Invitation deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
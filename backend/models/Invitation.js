const mongoose = require('mongoose');

const invitationSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    projectId: { type: String, required: true },
    clientEmail: { type: String, required: true },
    freelancerEmail: { type: String, required: true },
    status: { type: String, default: 'pending' },
    sentAt: { type: Number, default: Date.now }
});

module.exports = mongoose.model('Invitation', invitationSchema);
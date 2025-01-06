const mongoose = require('mongoose');

const officerSchema = new mongoose.Schema({
    name: { type: String },
    status: {
        type: String,
        // enum: ['returned', 'recieved'], 
        // default: 'returned'
    },
    metalNo: {
        type: String,
        required: true
    },
    rank: {
        type: String,
        required: true
    },
    duty: {
        type: String,
        required: true
    },
    received: {
        type: [Object],
    },
    returned: {
        type: [Object],
    },
    registerNo: {
        type: String,
        required: true
    },
    phonenumber: {
        type: String,
        required: true
    },
    kgidNo: {
        type: String,
        required: true
    },
   
    remarks: {
        type: String
    },
    auditDate: {
        type: Date
    },
    maintenanceDate: {
        type: Date
    },
    lastAuditedDate: {
        type: Date
    }
});

module.exports = mongoose.model('KSPOfficers2', officerSchema);

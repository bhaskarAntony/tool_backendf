const mongoose = require('mongoose');

const SpecificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
});

const AmmunitionSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Ammunition Name
  bundleCount: { type: String, required: true }, // Bundle / Count
  dateOfUpload: { type: Date, required: true }, // Date of Upload
  emptyCasesCount: { type: Number, required: true }, // Number of Empty Cases
  firedCount: { type: Number, required: true }, // Ammunition Fired Count
  qrCode: { type: String }, // URL or base64 for the QR Code image
  description: { type: String, required: true }, // About Ammunition
  specifications: [SpecificationSchema], // Technical Specifications
  status: { 
    type: String, 
    enum: ['Available', 'Issued', 'Expired', 'Under Maintenance', 'Missing'], 
    default: 'Available',
  }, // Ammunition Status
  history: [
    {
      action: { type: String, required: true }, // Example: "Issued", "Returned"
      date: { type: Date, default: Date.now }, // Action date
      remarks: { type: String }, // Any additional remarks
    },
  ], // Action History
});

module.exports = mongoose.model('Item', AmmunitionSchema);

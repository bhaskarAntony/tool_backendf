const mongoose = require('mongoose');

const SpecificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
});

const ItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  specifications: [SpecificationSchema],
  History:[Object],
  isIssued:{type:Boolean, default:false},
  status: { 
    type: String, 
    enum: ['Available', 'Under Maintenance', 'Missing', 'Expired', 'issued'], 
    default: 'Available'
},
rackNumber: String,
lastAuditBy: String,
repairHistory: [String],
upcomingMaintenanceDate: Date,
});

module.exports = mongoose.model('Item', ItemSchema);

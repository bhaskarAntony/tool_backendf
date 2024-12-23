const mongoose = require("mongoose");

const MaintenanceLogSchema = new mongoose.Schema({
  registerNo: { type: String, required: true },
  maintenanceDate: { type: Date, required: true },
  status: { type: String, default: "Pending" },
  assignedOfficer: { type: String },
  log:{type:String}
//   cost: { type: Number },
});

module.exports = mongoose.model("MaintenanceLog2", MaintenanceLogSchema);

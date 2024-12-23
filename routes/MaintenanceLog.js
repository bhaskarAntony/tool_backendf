const express = require("express");
const router = express.Router();
const MaintenanceLog = require("../models/MaintenanceLog");

// Get all logs
router.get("/logs", async (req, res) => {
  const logs = await MaintenanceLog.find();
  res.json(logs);
});

// Add a log
router.post("/", async (req, res) => {
  const log = new MaintenanceLog(req.body);
  await log.save();
  res.status(201).json(log);
});

// Delete a log
router.delete("/:id", async (req, res) => {
  await MaintenanceLog.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

// Get stats for charts
router.get("/stats", async (req, res) => {
  const stats = await MaintenanceLog.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  res.json(
    stats.map((stat) => ({
      status: stat._id,
      count: stat.count,
    }))
  );
});

module.exports = router;

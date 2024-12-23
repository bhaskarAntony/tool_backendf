const express = require('express');
const { issueWeapons, issueFixedWeapons, takeFixedWeapons, returnWeapons } = require('../controlls/transactionController');
const weapon = require('../models/weapon');
const officer = require('../models/officer');
const transaction = require('../models/transaction');
const mongoose = require('mongoose')

const router = express.Router();

router.post('/issue', issueWeapons);
router.post('/issue/fixed/weapon/:id', issueFixedWeapons);
router.patch('/take/fixed/weapon/:id', takeFixedWeapons);
router.post('/return', returnWeapons);

// For a specific transaction by ID (use proper ObjectId)
router.get('/single/:transactionId', async (req, res) => {
  try {
      const { transactionId } = req.params;

      // Validate the ObjectId
      if (!mongoose.Types.ObjectId.isValid(transactionId)) {
          return res.status(400).json({ error: 'Invalid transaction ID' });
      }

      const transactiondata = await transaction.findById(transactionId);
      if (!transactiondata) {
          return res.status(404).json({ error: 'Transaction not found' });
      }

      const weaponDetails = await weapon.find({
          _id: { $in: transactiondata.weapons }, // Assuming `weaponsIds` field is in your schema
      });

      res.status(200).json({
          transactiondata,
          weaponDetails,
      });
  } catch (error) {
      console.error('Error fetching transaction weapons:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/list', async (req, res) => {
  try {
    // Fetch all transactions
    const transactions = await transaction.find();

    // Loop through each transaction and fetch the associated weapons manually
    for (let i = 0; i < transactions.length; i++) {
      const transaction = transactions[i];
      
      // Fetch the weapon details for each weapon ID in the transaction
      const weaponDetails = await weapon.find({
        _id: { $in: transaction.weapons } // Using $in to match any weapon ID in the weapons array
      });
      
      // Add weapon details to the transaction object
      transaction.weaponDetails = weaponDetails;
    }

    // Send back the transactions along with their weapon details
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});





router.get('/stats', async (req, res) => {
  try {
    // Basic statistics
    const totalWeapons = await weapon.countDocuments();
    const availableWeapons = await weapon.countDocuments({ status: 'Available' });
    const issuedWeapons = await weapon.countDocuments({ status: 'issued' });
    const totalOfficers = await officer.countDocuments();
    const officersWithWeapons = await officer.countDocuments({
      weaponsIssued: { $exists: true, $ne: [] },
    });

    // Daily status (mock data, replace with actual calculations if available)
    const dailyStatus = {
      labels: ['Weapon A', 'Weapon B', 'Weapon C'],
      data: [50, 40, 60],
    };

    // Monthly data (mock data, replace with actual calculations if available)
    const monthlyData = {
      labels: ['January', 'February', 'March'],
      issued: [30, 45, 20],
      remaining: [120, 105, 130],
    };

    // Radar chart data (replace with actual weapon data from your database)
    const weaponStats = await weapon.aggregate([
      { $match: { status: 'issued' } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);

    const weaponTypes = weaponStats.map((item) => item._id);
    const weaponCounts = weaponStats.map((item) => item.count);

    res.json({
      totalWeapons,
      availableWeapons,
      issuedWeapons,
      totalOfficers,
      officersWithWeapons,
      dailyStatus,
      monthlyData,
      weaponTypes, // For radar chart labels
      weaponStats: weaponCounts, // For radar chart data
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


module.exports = router;

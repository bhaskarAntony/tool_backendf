const express = require('express');
const { createOfficer, getAllOfficers, updateOfficer, getOfficerById, deleteOfficer } = require('../controlls/officerController');

const router = express.Router();

router.post('/', createOfficer);
router.get('/', getAllOfficers);
router.put('/edit/:id', updateOfficer);
router.get('/:id', getOfficerById);
router.delete('/:id', deleteOfficer);

module.exports = router;

const express = require('express');
const { createWeapon, getAllWeapons, getSingleWeapons, updateWeapon, deleteWeapon } = require('../controlls/weapon');

const router = express.Router();

router.post('/', createWeapon);
router.get('/', getAllWeapons);
router.get('/single/:id', getSingleWeapons);
router.patch('/update/:id', updateWeapon);
router.delete('/delete/:id', deleteWeapon);

module.exports = router;

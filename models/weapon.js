const mongoose = require('mongoose');

const weaponSchema = new mongoose.Schema({
    type: { type: String, required: true },
    category:{type:String, enum:['armoury', 'ammunition', 'munition'], required:true},
    registerNumber: { type: String, unique: true, required: true },
    buttno: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['Available', 'Under Maintenance', 'Missing', 'Expired', 'issued'], 
        default: 'In Service'
    },
    fixedToOfficer: { 
        type: {
            rank: String,
            metalno: String,
            officername: String
        },
        default: null
    },
    coy: String,
    rackNumber: String,
    lastAuditBy: String,
    repairHistory: [String],
    upcomingMaintenanceDate: Date,
    isIssued:{
        type:String,
        required:true
    },
    history:{
        type:[Object],

    }
});

module.exports = mongoose.model('KSPWeaponall2', weaponSchema);

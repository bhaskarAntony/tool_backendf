const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    officer: { type:Object},
    weapons: [{ type: Object}],
    weaponsIds:{type:Array},
    issueDate: { type: Date, default: Date.now },
    returnDate: { type: Date},
    used: { type: Boolean, default: false },
    purpose: String,
    returned:{
        type:Boolean,
        default:false
    }
});

module.exports = mongoose.model('KSPTransaction4', transactionSchema);

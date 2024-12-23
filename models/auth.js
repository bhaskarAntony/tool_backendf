const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    adminname: {
        type: String,
        required: true,
    },
   adminemail: {
        type: String,
        required: true,
    },
    phonenumber:{
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    rank: {
        type: String,
        required: true,
    },
});

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('RSRUsers', UserSchema);
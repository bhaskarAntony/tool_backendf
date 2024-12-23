const User = require('../models/auth');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    const { adminname, adminemail, password, rank, phonenumber } = req.body;

    try {
        const user = new User({
           adminname,
           adminemail,
           phonenumber,
           password,
           rank
        });

        await user.save();

        res.status(201).json({
            message: 'User registered successfully',
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Server error',
        });
    }
};

const login = async (req, res) => {
    const { adminemail, password } = req.body;

    try {
        const user = await User.findOne({ adminemail });

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({
                message: 'Invalid credentials',
            });
        }

        const token = jwt.sign({ id: user._id }, '133a889e51573dae5d1f527089e91a3c3c4d547490c4e762bd6a3416905a11c811e8c93bdf9a2cac853ae8c6ed89890deff99826d67b469d758667bc26d9df45', {
            expiresIn: '1d',
        });

        res.json({
            token,
            user: {
                id: user._id,
                name: user.adminname,
                email: user.adminemail,
                rank: user.rank,
            },
        });
    } catch (error) {
        res.status(500).json({
            error:error,
            message: 'Server error',
        });
    }
};

module.exports = { register, login };
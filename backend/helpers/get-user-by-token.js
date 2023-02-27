const jwt  = require('jsonwebtoken');
const { getUserById } = require('../controllers/UserController');
const User = require('../models/User');
require('dotenv').config();

// ger user by jwt token
const getUserByToken = async (token) => {

    if(!token){
        return res.status(401).json({ message: 'Acesso negado!'});
    }

    const decoded = jwt.verify(token, process.env.nossosecret);
    const userId  = decoded.id;
    const user    = await User.findOne({ _id : userId });
    
    return user;
}

module.exports = getUserByToken;
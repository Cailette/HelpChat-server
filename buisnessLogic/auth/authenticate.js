const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports = {
    authenticate: async function(password, userPassword) {  
        return bcrypt.compare(password, userPassword);
    },

    generateToken: async function(id, representative){
        return jwt.sign({ id: id, representative: representative}, process.env.SECRET_KEY);
    }
}
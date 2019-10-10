const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports = {
    authenticate: async function(password, userPassword) {  
        return bcrypt.compare(password, userPassword);
    },

    generateToken: async function(id, representative, secretKey){
        return jwt.sign({ id: id, representative: representative}, secretKey);
    }
}
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports = {
    authenticateUser: async function(user, password, secretKey) {  
        if(user.constructor.collection.name !== 'User') {
            return;
        }

        if(!bcrypt.compare(password, user.password)){
            return;
        }

        return jwt.sign({ 
            id: user._id, 
            representative: user.representative
        }, secretKey);
    },

    generateToken: async function(id, representative, secretKey){
        return jwt.sign({ id: id, representative: representative}, secretKey);
    }
}
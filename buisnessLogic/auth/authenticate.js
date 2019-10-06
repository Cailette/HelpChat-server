const jwt = require('jsonwebtoken');

module.exports = {
    authenticateUser: async function(user, secretKey) {  
        if(user.constructor.collection.name !== 'User') {
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
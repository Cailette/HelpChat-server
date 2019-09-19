const jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const userModel = require('../models/users');

module.exports = {
    authenticate: async function(req, res, next) {
        const user = await userModel.findOne({ email: req.body.email })

        if(!user || !bcrypt.compare(req.body.password, user.password)){
            return res.status(401).json({
                message: "Invalid mail or password!"
            });
        } 
        
        const token = jwt.sign({ 
            id: user._id, 
            isRepresentative: user.representative == null ? true : false,
            representative: user.representative? user.representative: user._id
        }, req.app.get('secretKey'));

        return res.status(200).json({
            message: "User found successfully!", 
            token: token
        });
    },

    authorizateUser: function(req, res, next) {
        jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function(err, decoded) {
            if (err) {
                res.json({
                    status:"error", 
                    message: err.message, 
                    data: null
                });
            }else{
                req.body.userId = decoded.id;
                req.body.isRepresentative = decoded.isRepresentative;
                req.body.representative = decoded.representative;
                next();
            }
        });
    },
    
    authorizateVisitor: function(req, res, next) {
        jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function(err, decoded) {
            if (err) {
                res.json({
                    status:"error", 
                    message: err.message, 
                    data: null
                });
            }else{
                req.body.visitorId = decoded.id;
                req.body.representative = decoded.representative;
                next();
            }
        });
    },
}
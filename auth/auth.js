
const jwt = require('jsonwebtoken');
const visitorsController = require('../app/api/controllers/visitors');

module.exports = {
    authenticateUser: function(req, res, next) {
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
                next();
            }
        });
    },
    
    authenticateVisitor: function(req, res, next) {
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
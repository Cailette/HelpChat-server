
const jwt = require('jsonwebtoken');

module.exports = {
    authenticateUser: function(req, res, next) {
        console.log(JSON.stringify(req.headers))
        jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function(err, decoded) {
            if (err) {
                res.json({status:"error", message: err.message, data:null});
            }else{
                req.body.userId = decoded.id;
                req.body.isRepresentative = decoded.isRepresentative;
                next();
            }
        });
    }
}
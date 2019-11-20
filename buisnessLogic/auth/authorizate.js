const jwt = require('jsonwebtoken');

module.exports = {
    authorizate: function(req, res, next) {
        jwt.verify(req.headers['x-access-token'], process.env.SECRET_KEY, function(err, decoded) {
            if (err) {
                res.status(401).json({
                    message: err.message, 
                    data: null
                });
            }else{
                req.body.id = decoded.id;
                req.body.representative = decoded.representative;
                next();
            }
        });
    },

    authorizateSocket: function(socket, next) {
        const token = socket.handshake.query.token;
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
          if(err) return next(err);
          next();
        });
    },
}
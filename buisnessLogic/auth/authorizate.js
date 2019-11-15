const jwt = require('jsonwebtoken');

module.exports = {
    authorizate: function(req, res, next) {
        jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function(err, decoded) {
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
        jwt.verify(token, 'HelpChatRestApi', (err, decoded) => {
          if(err) return next(err);
          socket.id = decoded.id;
          socket.representative = decoded.representative;
          next();
        });
    },
}
const jwt = require('jsonwebtoken');

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
                req.body.representative = decoded.representative;
                req.body.isAgent = true;
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
                req.body.isVisitor = true;
                next();
            }
        });
    },
    
    authenticateSocket: function(socket, next) {
        const token = socket.handshake.query.token;
        const sender = socket.handshake.query.sender;
        jwt.verify(token, 'HelpChatRestApi', (err, decoded) => {
          if(err) return next(err);
          socket.id = decoded.id;
          socket.representative = decoded.representative;
          socket.sender = sender;
          next();
        });
    },
}
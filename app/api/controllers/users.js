const userModel = require('../models/users');
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
    create: function(req, res, next) {
        userModel.create({ 
                firstname: req.body.firstname, 
                lastname: req.body.lastname, 
                email: req.body.email,
                password: req.body.password }, function (err, userInfo) {
            if (err) {
                next(err);
            } else {
                res.json({
                    status: 200, 
                    message: "User added successfully!", 
                    data: userInfo
                });
            }
        });
    },

    authenticate: function(req, res, next) {
        userModel.findOne({ email:req.body.email }, function(err, userInfo){
            if (err) {
                next(err);
            } else {
                if(bcrypt.compareSync(req.body.password, userInfo.password)) {
                    const token = jwt.sign({ id: userInfo._id }, req.app.get('secretKey'), { expiresIn: '24h' });
                    res.json({
                        status: 200, 
                        message: "User found successfully!", 
                        data:{ 
                            user: userInfo, 
                            token: token 
                        }
                    });
                }else{
                    res.json({
                        status: 401, 
                        message: "Invalid email or password!", 
                        data: null
                    });
                }
            }
        });
    },
}
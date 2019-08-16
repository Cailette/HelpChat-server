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

    getById: function(req, res, next) {
        userModel.findById(req.params.userId ? req.params.userId : req.body.userId, function(err, userInfo){
            if (err) {
                next(err);
            } else {
                res.json({
                    status: 200, 
                    message: "User found successfully!", 
                    data:{ 
                        user: userInfo
                    }
                }); 
            }
        }).select('-password');
    },

    updateById: function(req, res, next) {
        userModel.findById(req.body.userId, function(err, user){
            if (err) {
                next(err);
            } else {
                user.firstname = req.body.firstname || user.firstname;
                user.lastname = req.body.lastname || user.lastname;
                user.email = req.body.email || user.email;
                user.password = req.body.password || user.password;

                user.save(function (err, userUpdated) {
                    if (err) {
                        next(err);
                    } else {
                        res.json({
                            status: 200, 
                            message: "User updated successfully!", 
                            data:{ 
                                user: userUpdated
                            }
                        }); 
                    }
                });
            }
        });
    },

    switchActivity: function(req, res, next){
        userModel.findById(req.body.userId, function(err, user){
            if (err) {
                next(err);
            } else {
                user.isActive = !user.isActive;
                user.save(function (err, userUpdated) {
                    if (err) {
                        next(err);
                    } else {
                        res.json({
                            status: 200, 
                            message: "User updated successfully!", 
                            data:{ 
                                user: userUpdated
                            }
                        }); 
                    }
                });
            }
        });
    },
}
const userModel = require('../models/users');
const activityModel = require('../models/activity');
const workHoursModel = require('../models/workHours');
const activityController = require('./activity');
var bcrypt = require('bcryptjs');
var moment = require('moment');
const jwt = require('jsonwebtoken');

module.exports = {
    create: async function(req, res, next) {
        return await userModel.create({ 
            firstname: req.body.firstname, 
            lastname: req.body.lastname, 
            email: req.body.email,
            password: req.body.password,
            representative: req.params.addAgent ? req.body.userId : null })
            .then(userInfo => {
                res.status(201).json({
                    message: "User added successfully!", 
                    data: userInfo
                });
            }, err => {
                res.status(401).json({
                    message: "User can not be added!", 
                    data: err
                });
            })
            .catch(err => next(err));
    },

    authenticate: async function(req, res, next) {
        return await userModel.findOne({ email: req.body.email })
            .then(user => {
                if(bcrypt.compare(req.body.password, user.password)) {
                    const token = jwt.sign({ id: user._id }, req.app.get('secretKey'), { expiresIn: '24h' });
                    res.status(200).json({
                        message: "User found successfully!", 
                        data:{  
                            token: token 
                        }
                    });
                }else{
                    res.status(401).json({
                        message: "Invalid password!", 
                        data: null
                    });
                }
            }, err => {
                res.status(401).json({
                    message: "Invalid email!", 
                    data: err
                });
            })
            .catch(err => next(err));
    },

    getById: async function(req, res, next) {
        return await userModel.findById(req.params.AgentId ? req.params.AgentId : req.body.userId).select('-password')
            .then(userInfo => { 
                res.status(200).json({
                    message: "User found successfully!", 
                    data:{ 
                        user: userInfo
                    }
                }); 
            }, err => {
                res.status(401).json({
                    message: "User can not be found!", 
                    data: err
                });
            })
            .catch(err => next(err));
    },

    updateById: async function(req, res, next) {
        return await userModel.findById(req.params.AgentId ? req.params.AgentId : req.body.userId)
            .then(user => {
                user.firstname = req.body.firstname || user.firstname;
                user.lastname = req.body.lastname || user.lastname;
                user.email = req.body.email || user.email;
                user.password = req.body.password || user.password;
                user.save();
            }, err => {
                res.status(401).json({
                    message: "User can not be found!", 
                    data: err
                });
            })
            .then(userUpdated => {
                res.status(200).json({
                    message: "User updated successfully!", 
                    data:{ 
                        user: userUpdated
                    }
                }); 
            }, err => {
                res.status(401).json({
                    message: "User can not be updated!", 
                    data: err
                });
            })
            .catch(err => {
                return res.status(401).json({
                    message: "Invalid data!", 
                    data:{ 
                        err: err
                    }
                }); 
            });
    },

    switchActivity: async function(req, res, next){
        return await userModel.findById(req.body.userId)
            .then(user => {
                if(user.isActive) {
                    activityController.update(req, res, next);
                } else {
                    activityController.create(req, res, next);
                }
                user.isActive = !user.isActive; 
                user.save() 
            }, err => {
                res.status(401).json({
                    message: "User can not be found!", 
                    data: err
                });
            })
            .then(userUpdated => { 
                res.status(200).json({
                message: "User updated successfully!", 
                data:{ 
                    user: userUpdated
                }})
            }, err => {
                res.status(401).json({
                    message: "User can not be updated!", 
                    data: err
                });
            })
            .catch(err => next(err));
    },

    // NIE TESTOWANE
    delete: async function(req, res, next){
        if(!req.params.AgentId){
            const rest = await userModel.deleteMany({ representative: req.body.userId });
        }
        return await userModel.deleteOne({ _id: req.params.AgentId ? req.params.AgentId : req.body.userId })
            .then(userDeleted => { 
                res.status(200).json({
                    message: "User deleted successfully!", 
                    data: null
                });
            })
            .catch(err => next(err));
    },

    getAll: async function(req, res, next) {
        return await userModel.find({ representative: req.body.userId }).select('-password')
            .then(users => { 
                res.status(200).json({
                    message: "Users found successfully!", 
                    data:{ 
                        user: users
                    }
                }); 
            }, err => {
                res.status(401).json({
                    message: "Users can not be found!", 
                    data: err
                });
            })
            .catch(err => next(err));
    },
}
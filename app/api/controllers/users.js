const userModel = require('../models/users');
const activityModel = require('../models/activity');
const workHoursModel = require('../models/workHours');
const activityController = require('./activity');
var bcrypt = require('bcryptjs');
var moment = require('moment');
const jwt = require('jsonwebtoken');

module.exports = {
    create: async function(req, res, next) {
        const user = await userModel.findOne({ email: req.body.email })

        if(user){
            return res.status(401).json({
                message: "User exist!"
            });
        }

        const userInfo = await userModel.create({ 
            firstname: req.body.firstname, 
            lastname: req.body.lastname, 
            email: req.body.email,
            password: req.body.password,
            representative: req.params.addAgent ? req.body.userId : null })

        if(!userInfo){
            return res.status(401).json({
                message: "User can not be added!"
            });
        }
        
        return res.status(201).json({
            message: "User added successfully!", 
            data: userInfo
        });
    },

    authenticate: async function(req, res, next) {
        const user = await userModel.findOne({ email: req.body.email })

        if(!user || !bcrypt.compare(req.body.password, user.password)){
            return res.status(401).json({
                message: "Invalid mail or password!", 
                data: null
            });
        } 
        
        const token = jwt.sign({ id: user._id }, req.app.get('secretKey'));

        return res.status(200).json({
            message: "User found successfully!", 
            data:{  
                token: token 
            }
        });
    },

    getById: async function(req, res, next) {
        const userInfo = await userModel.findById(req.params.AgentId ? req.params.AgentId : req.body.userId).select('-password')

        if(!userInfo) {
            return res.status(401).json({
                message: "User can not be found!"
            });
        }

        return res.status(200).json({
            message: "User found successfully!", 
            data:{ 
                user: userInfo
            }
        }); 
    },

    updateById: async function(req, res, next) {

        const user = await userModel.findById(req.params.AgentId ? req.params.AgentId : req.body.userId)

        if(!userInfo) {
            return res.status(401).json({
                message: "User can not be found!"
            });
        }

        user.firstname = req.body.firstname || user.firstname;
        user.lastname = req.body.lastname || user.lastname;
        user.email = req.body.email || user.email;
        user.password = req.body.password || user.password;

        const userUpdated = await user.save();

        if(!userUpdated) {
            return res.status(401).json({
                message: "User can not be updated!"
            });
        }

        return res.status(200).json({
            message: "User updated successfully!", 
            data:{ 
                user: userUpdated
            }
        }); 
    },

    updateActivity: async function(req, res, next){
        const user = await userModel.findById(req.body.userId)

        if(!user) {
            return res.status(401).json({
                message: "User can not be found!"
            });
        }

        if(user.isActive) {
            await activityController.update(req, res, next);
        } else {
            await activityController.create(req, res, next);
        }

        user.isActive = !user.isActive; 
        const userUpdated = await user.save() 

        if(!userUpdated) {
            return res.status(401).json({
                message: "User can not be updated!"
            });
        }

        return res.status(200).json({
            message: "User updated successfully!", 
            data:{ 
                user: userUpdated
            }
        })
    },

    // NIE TESTOWANE
    delete: async function(req, res, next){
        if(!req.params.AgentId){
            const rest = await userModel.deleteMany({ representative: req.body.userId });
        }

        const userDeleted = await userModel.deleteOne({ _id: req.params.AgentId ? req.params.AgentId : req.body.userId })

        if(!userDeleted) {
            return res.status(401).json({
                message: "User can not be deleted!", 
                data: null
            });
        }

        return res.status(200).json({
                message: "User deleted successfully!", 
                data: null
            });
    },

    getAll: async function(req, res, next) {

        const users = await userModel.find({ representative: req.body.userId }).select('-password')

        if(!users) {
            return res.status(401).json({
                message: "Users can not be found!"
            });
        }

        return res.status(200).json({
            message: "Users found successfully!", 
            data:{ 
                user: users
            }
        }); 
    },
}
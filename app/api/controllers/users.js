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
            representative: req.body.isRepresentative ? req.body.userId : null 
        })

        if(!userInfo){
            return res.status(401).json({
                message: "User can not be added!"
            });
        }
        
        return res.status(201).json({
            message: "User added successfully!", 
            user: userInfo
        });
    },

    authenticate: async function(req, res, next) {
        const user = await userModel.findOne({ email: req.body.email })

        if(!user || !bcrypt.compare(req.body.password, user.password)){
            return res.status(401).json({
                message: "Invalid mail or password!"
            });
        } 
        
        const token = jwt.sign({ id: user._id, isRepresentative: user.representative == null ? true : false }, req.app.get('secretKey'));

        return res.status(200).json({
            message: "User found successfully!", 
            token: token
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
            user: userInfo
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
            user: userUpdated
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
            user: userUpdated
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
                message: "User can not be deleted!"
            });
        }

        return res.status(200).json({
                message: "User deleted successfully!"
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
            users: users
        }); 
    },

    getActiveUsers: async function(req, res, next) {
        const users = await userModel.find( 
            { $and : [
                { $or : [ { representative: req.params.licenceID }, { _id: req.params.licenceID } ] },
                { isActive : true }
            ]
            } ).select('-password');

        if(!users || users.length == 0) {
            return res.status(404).json({
                message: "Users can not be found!"
            });
        }

        return res.status(200).json({
            message: "Users found successfully!", 
            users: users
        });
    },

    getRandomWorkingAgent: async function(req, res, next) {
        const users = await userModel.find( 
            { $and : [
                { $or : [ { representative: req.params.licenceID }, { _id: req.params.licenceID } ] },
                { isActive : true }
            ]
            } ).select('-password');

        if(users.length == 0) {
            return res.status(404).json({
                message: "Users can not be found!"
            });
        }
        
        const now = new Date(Date.now());
        const workingUsers = [];
        for(var user of users){
            const workHours = await workHoursModel.findOne({ agent: user._id, dayOfWeek: now.getDay(), dayTo: null });
            if((workHours && now.getHours() >= workHours.hourFrom && now.getHours() < workHours.hourTo) || !workHours) {
                workingUsers.push(user);        
            }
        }

        if(workingUsers.length == 0) {
            return res.status(404).json({
                message: "Users can not be found!"
            });
        }

        var workingAgent = workingUsers[Math.floor(Math.random() * workingUsers.length)];
        return res.status(200).json({
            message: "User found successfully!", 
            user: workingAgent
        }); 
    },
}
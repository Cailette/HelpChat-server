const userModel = require('../../database/models/users');
const workHoursService = require('./workHours');
const activityService = require('./activity');
var Joi = require('joi');

module.exports = {
    create: async function(firstname, lastname, email, password, representative) {
        return await userModel.create({ 
            firstname: firstname, 
            lastname: lastname, 
            email: email,
            password: password,
            representative: representative 
        });
    },

    findByEmail: async function(email){
        return await userModel.findOne({ email: email });
    },

    findById: async function(id) {
        return await userModel.findById(id)
            .select('-password');
    },

    findActivityById: async function(id, match) {
        var matchPopulate = match ? { $or: [ {'from': match}, {'to': match} ] } : {};
        return await userModel.findById(id)
            .populate({
                path: 'activities',
                match: matchPopulate,
                options: { 
                    sort: { 'from': 'asc' }
                }
            })
            .select('_id firstname lastname email')
    },

    findWorkHoursById: async function(id, match) {
        var matchPopulate = match ? { $or: [ {'dayFrom': match}, {'dayTo': match} ] } : {};
        return await userModel.findById(id)
            .populate({
                path: 'workHours',
                match: matchPopulate,
                options: { 
                    sort: { 'dayFrom': 'asc' }
                }
            })
            .select('_id firstname lastname email')
    },

    findUser: async function(id) {
        return await userModel.findById(id);
    },

    updateUser: async function(user, firstname, lastname, email, password) {
        if(user.constructor.modelName !== 'User') {
            return;
        }
        user.firstname = firstname;
        user.lastname = lastname;
        user.email = email;
        user.password = password;
        return await user.save();
    },

    updateActivity: async function(user){
        if(user.constructor.modelName !== 'User') {
            return;
        }
        user.isActive = !user.isActive; 
        return await user.save();
    },

    checkActivity: async function(user, now) {
        if(user.constructor.modelName !== 'User') {
            return;
        }

        var activity = await activityService.findLastByUserId(user._id)
        if(activity && activity.to !== null && !user.isActive){
            const reverted = await activityService.revertActivity(activity, now)
            if(reverted.to === null){
                user.isActive = true;
            }
        }
        
        return await user.save();
    },

    delete: async function(id){
        return await userModel.deleteOne({ _id: id })
    },

    findAllByRepresentative: async function(representative) {
        return await userModel.find({ $or : [{ _id: representative }, { representative: representative }]})
            .select('-password');
    },

    findActiveUsersByRepresentative: async function(representative) {
        return await userModel.find({
            $and : [
                { $or : [{ _id: representative }, { representative: representative }] },
                { isActive : true } 
            ]
        })
        .select('-password');
    },

    findWorkingUsersByRepresentative: async function(representative) {
        const users = await this.findActiveUsersByRepresentative(representative)

        if(!users){
            return;
        }

        const now = new Date(Date.now());
        const workingUsers = [];

        for(var user of users){
            const workHours = await workHoursService.findByUserId(user._id)

            if(!workHours || workHours.length === 0) {
                workingUsers.push(user)
            } else {
                var wh = workHours.find(wh => wh.dayOfWeek === now.getDay())
                if(wh && now.getHours() >= wh.hourFrom && now.getHours() < wh.hourTo) {
                    workingUsers.push(user)
                }
            }
        }

        return workingUsers;
    },

    findRandomWorkingUserByRepresentative: async function(representative) {
        const users = await this.findWorkingUsersByRepresentative(representative);

        if(!users){
            return;
        }

        return users[Math.floor(Math.random() * users.length)];
    },

    findRandomUserByRepresentative: async function(representative) {
        const users = await this.findAllByRepresentative(representative)
        if(!users){
            return;
        }

        return users[Math.floor(Math.random() * users.length)];
    },

    userValidate: function(user) {
        var schema = {
            firstname: Joi.string().min(1).max(20).required(),
            lastname: Joi.string().min(1).max(20).required(),
            email: Joi.string().min(1).max(60).email().required(),
            password: Joi.string().min(6).max(30).regex(/[a-zA-Z0-9]{6,30}/).required(),
        }
        return Joi.validate(user, schema);
    },

    updateUserValidate: function(user) {
        var schema = {
            firstname: Joi.string().min(1).max(20),
            lastname: Joi.string().min(1).max(20),
            email: Joi.string().min(1).max(60).email(),
            password: Joi.string().min(6).max(30).regex(/[a-zA-Z0-9]{6,30}/),
        }
        return Joi.validate(user, schema);
    },

    loginValidate: function(user) {
        var schema = {
            email: Joi.string().min(1).max(60).email().required(),
            password: Joi.string().min(6).max(30).regex(/[a-zA-Z0-9]{6,30}/).required(),
        }
        return Joi.validate(user, schema);
    }
}
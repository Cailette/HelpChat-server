const activityModel = require('../../database/models/activities');
const workHoursService = require('./workHours');
var Joi = require('joi');

module.exports = {
    create: async function(userId) {
        const now = new Date(Date.now());
        const activity = await activityModel.create({ 
            agent: userId,
            from: now
        })

        const workHours = await workHoursService.findByUserId(userId)
        if(activity) {
            if(workHours && workHours.length !== 0) {
                var wh = workHours.find(wh => wh.dayOfWeek === now.getDay())
                if(!wh || (wh && now.getHours() >= wh.hourFrom)) {
                    activity.inTime = false;
                    activity.save();
                }
            }
        }

        return activity;
    },

    update: async function(userId) {
        const now = new Date(Date.now());
        const activity = await activityModel.findOne({agent: userId, to: null})

        const workHours = await workHoursService.findByUserId(userId)
        if(activity) {
            if(workHours && workHours.length !== 0) {
                var wh = workHours.find(wh => wh.dayOfWeek === now.getDay())
                if(!wh || (wh && now.getHours() < wh.hourTo)) {
                    activity.inTime = false;
                    activity.save();
                }
            }
            activity.to = now;
            activity.save();
        }
        
        return activity;
    },

    findByUserId: async function(userId, match) {
        return await activityModel.find({
            $and: [
                    match,
                    { agent: userId }
                ]
            })
            .populate({
                path: 'agent',
                select: '_id firstname lastname email'
            })
            .sort({from: 1})
    },
}
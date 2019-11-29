const activityModel = require('../../database/models/activities');
const workHoursService = require('./workHours');
var moment = require('moment');

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
                    await activity.save();
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
                }
            }
            activity.to = now;
            await activity.save();
        }
        
        return activity;
    },

    revertActivity: async function(activity, now) {
        if(activity.constructor.modelName !== 'Activity') {
            return;
        }
        const workHours = await workHoursService.findByUserId(activity.agent)
        var from = moment(now)
        var to = moment(activity.to)
        if(from.diff(to, 'seconds') < 5) {
            if(workHours && workHours.length !== 0) {
                var wh = workHours.find(wh => wh.dayOfWeek === now.getDay())
                if(!wh || (wh && now.getHours() < wh.hourTo && activity.inTime !== false)) {
                    activity.inTime = true;
                }
            }
            activity.to = null;
            await activity.save();
        }
        return activity;
    },

    findLastByUserId: async function(userId) {
        return await activityModel.findOne({agent: userId}).sort({to: -1}).limit(1)
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
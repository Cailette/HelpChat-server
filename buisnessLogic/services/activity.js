const activityModel = require('../../database/models/activities');
const workHours = require('./workHours');

module.exports = {
    create: async function(userId) {
        const now = new Date(Date.now());
        const workHour = await workHours.findByUserIdAndDay(userId, now.getDay())

        const activity = await activityModel.create({ 
            agent: userId,
            from: now})

        if(activity) {
            if(workHour && now.getHours() >= workHour.hourFrom) {
                activity.inTime = false;
            }
            activity.save();
        }

        return activity;
    },

    update: async function(userId) {
        const now = new Date(Date.now());
        const workHour = await workHours.findByUserIdAndDay(userId, now.getDay())
        const activity = await activityModel.findOne({agent: userId, to: null})

        if(activity)
        {
            if(workHour && now.getHours() < workHour.hourTo) {
                activity.inTime = false;
            }
            activity.to = now;
            activity.save();
        }

        return activity;
    },
}
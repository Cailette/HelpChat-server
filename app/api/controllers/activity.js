const activityModel = require('../models/activity');
const workHoursModel = require('../models/workHours');

module.exports = {
    create: async function(req, res, next) {
        const now = new Date(Date.now());
        const workHours = await workHoursModel.findOne({ agent: req.body.userId, dayOfWeek: now.getDay(), dayTo: null })

        const activity = await activityModel.create({ 
            agent: req.body.userId,
            from: now})

        if(activity) {
            if(workHours && now.getHours() >= workHours.hourFrom) {
                activity.inTime = false;
            }
            activity.save();
        }
    },

    update: async function(req, res, next) {
        const now = new Date(Date.now());
        const workHours = await workHoursModel.findOne({ agent: req.body.userId, dayOfWeek: now.getDay(), dayTo: null })
        const activity = await activityModel.findOne({agent: req.body.userId, to: null})

        if(activity)
        {
            if(workHours && now.getHours() < workHours.hourTo) {
                activity.inTime = false;
            }
            activity.to = now;
            activity.save();
        }
    },
}
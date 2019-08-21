const activityModel = require('../models/activity');
const workHoursModel = require('../models/workHours');

module.exports = {
    create: async function(req, res, next) {
        const now = new Date(Date.now());
        const workHours = await workHoursModel.findOne({ agent: req.body.userId, dayOfWeek: now.getDay(), dayTo: null })
        return await activityModel.create({ 
            agent: req.body.userId,
            from: now})
            .then(activity => {
                if(workHours && now.getHours() >= workHours.hourFrom) {
                    activity.inTime = false;
                }
                activity.save();
            })
            .catch(err => err);
    },

    update: async function(req, res, next) {
        const now = new Date(Date.now());
        const workHours = await workHoursModel.findOne({ agent: req.body.userId, dayOfWeek: now.getDay(), dayTo: null })
        return await activityModel.findOne({agent: req.body.userId, to: null})
        .then(activity => {
            if(activity)
            {
                if(workHours && now.getHours() <= workHours.hourTo) {
                    activity.inTime = false;
                }
                activity.to = now;
                activity.save();
            }
        })
        .catch(err => err);
    },
}
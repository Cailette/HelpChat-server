const workHoursModel = require('../models/workHours');

module.exports = {
    create: async function(req, res, next) {
    const workHour = await workHoursModel.findOne({ agent: req.params.AgentId ? req.params.AgentId : req.body.userId, dayOfWeek: req.body.dayOfWeek, dayTo: null })
    .then(workHours => {
        if(workHours)
        {
            workHours.dayTo = Date.now();
            workHours.save();
        }
    })

    return await workHoursModel.create({ 
        agent: req.params.AgentId ? req.params.AgentId : req.body.userId,
        hourFrom: req.body.hourFrom,
        hourTo: req.body.hourTo,
        dayOfWeek: req.body.dayOfWeek })
        .then(workHours => {
            res.json({
                status: 200, 
                message: "Work Hours added successfully!", 
                data: workHours
            });
        }, err => {
            res.json({
                status: 401, 
                message: "Work Hours can not be added!", 
                data: err
            });
        })
        .catch(err => next(err));
    },

    updateDayToWorkHours: async function(req, res, next) {
        return await workHoursModel.findById(req.params.WorkHoursId)
        .then(workHours => {
            if(workHours)
            {
                workHours.dayTo = Date.now();
                workHours.save();
            }
        })
        .then(workHours => {
            res.json({
                status: 200, 
                message: "Work Hours updated successfully!", 
                data: workHours
            });
        }, err => {
            res.json({
                status: 401, 
                message: "Work Hours can not be updated!", 
                data: err
            });
        })
        .catch(err => next(err));
    },

    getByAgentId: async function(req, res, next) {
        return await workHoursModel.find({ agent: req.params.AgentId ? req.params.AgentId : req.body.userId, dayTo: null })
            .select('-dayTo -agent -dayFrom')
            .sort('dayOfWeek')
            .then(workHours => {
                res.json({
                    status: 200, 
                    message: "Work Hours deleted successfully!", 
                    data: workHours
                });
            }, err => {
                res.json({
                    status: 401, 
                    message: "Work Hours can not be deleted!", 
                    data: err
                });
            })
            .catch(err => next(err));
    }
}
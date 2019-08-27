const workHoursModel = require('../models/workHours');

module.exports = {
    create: async function(req, res, next) {
        const workHour = await workHoursModel.findOne({ agent: req.params.AgentId ? req.params.AgentId : req.body.userId, dayOfWeek: req.body.dayOfWeek, dayTo: null })
        if(workHour)
        {
            workHour.dayTo = Date.now();
            await workHour.save();
        }

        const newWorkHours = await workHoursModel.create({ 
            agent: req.params.AgentId ? req.params.AgentId : req.body.userId,
            hourFrom: req.body.hourFrom,
            hourTo: req.body.hourTo,
            dayOfWeek: req.body.dayOfWeek })

        if(!newWorkHours) {
            return res.json({
                status: 401, 
                message: "Work Hours can not be added!"
            });
        }
            
        return res.json({
            status: 200, 
            message: "Work Hours added successfully!", 
            data: newWorkHours
        });
    },

    updateDayTo: async function(req, res, next) {
        const workHours = await workHoursModel.findById(req.params.WorkHoursId)
        if(!workHours)
        {
            return res.json({
                status: 404, 
                message: "Work Hours not found!"
            });
        }

        workHours.dayTo = Date.now();
        const updatedWorkHours = await workHours.save();

        if (!updatedWorkHours) {
            return res.json({
                status: 401, 
                message: "Work Hours can not be updated !"
            });
        }

        return res.json({
            status: 200, 
            message: "Work Hours updated successfully!", 
            data: workHours
        });
    },

    getByAgentId: async function(req, res, next) {
        const workHours = await workHoursModel.find({ agent: req.params.AgentId ? req.params.AgentId : req.body.userId, dayTo: null})
            .select('-dayTo -agent -dayFrom')
            .sort('dayOfWeek')
            
        if(!workHours)
        {
            return res.json({
                status: 404, 
                message: "Work Hours not found!"
            });
        }

        return res.json({
            status: 200, 
            message: "Work Hours found successfully!", 
            data: workHours
        });
    },

    getDayByAgentId: async function(req, res, next) {
        const workHours = await workHoursModel.find({ agent: req.params.AgentId ? req.params.AgentId : req.body.userId, dayOfWeek: req.body.dayOfWeek, dayTo: null })
            .select('-dayTo -agent -dayFrom')
            .sort('dayOfWeek')
            
        if(!workHours)
        {
            return res.json({
                status: 404, 
                message: "Work Hours not found!"
            });
        }

        return res.json({
            status: 200, 
            message: "Work Hours found successfully!", 
            data: workHours
        });
    }
}
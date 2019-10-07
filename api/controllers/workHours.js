const workHoursService = require('../../buisnessLogic/services/workHours');

module.exports = {
    create: async function(req, res) {
        const newWorkHours = await workHoursService.create(req.params.AgentId ? req.params.AgentId : req.body.id, req.body.hourFrom, req.body.hourTo, req.body.dayOfWeek)
        
        if(!newWorkHours) {
            return res.status(400).json({
                message: "Work Hours can not be added!"
            });
        }
            
        return res.status(200).json({
            message: "Work Hours added successfully!", 
            workHours: newWorkHours
        });
    },

    updateDayTo: async function(req, res) {
        const workHours = await workHoursService.findById(req.params.WorkHoursId)

        if(!workHours) {
            return res.status(404).json({
                message: "Work Hours not found!"
            });
        }

        const updatedWorkHours = await workHoursService.updateDayTo(workHours)

        if (!updatedWorkHours) {
            return res.status(401).json({
                message: "Work Hours can not be updated !"
            });
        }

        return res.status(200).json({
            status: 200, 
            message: "Work Hours updated successfully!", 
            workHours: updatedWorkHours
        });
    },

    getByAgentId: async function(req, res) {
        const workHours = await workHoursService.findByUserId(req.params.AgentId ? req.params.AgentId : req.body.id);
            
        if(!workHours) {
            return res.status(404).json({
                message: "Work Hours not found!"
            });
        }

        return res.status(200).json({
            status: 200, 
            message: "Work Hours found successfully!", 
            workHours: workHours
        });
    },

    getDayByAgentId: async function(req, res) {
        const workHours = await workHoursService.findByUserIdAndDay(req.params.AgentId ? req.params.AgentId : req.body.id, req.body.dayOfWeek)
            
        if(!workHours) {
            return res.status(404).json({
                message: "Work Hours not found!"
            });
        }

        return res.status(200).json({
            message: "Work Hours found successfully!", 
            workHours: workHours
        });
    }
}
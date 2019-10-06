const workHoursModel = require('../../database/models/workHours');

module.exports = {
    create: async function(agent, hourFrom, hourTo, dayOfWeek) {
        const workHour = await workHoursModel.findOne({ agent: agent, dayOfWeek:dayOfWeek, dayTo: null })
        if(workHour) {
            workHour.dayTo = Date.now();
            await workHour.save();
        }
        return await workHoursModel.create({ 
            agent: agent,
            hourFrom: hourFrom,
            hourTo: hourTo,
            dayOfWeek: dayOfWeek 
        })
    },

    updateDayTo: async function(workHours) {
        if(user.constructor.collection.name !== 'WorkHours') {
            return;
        }
        workHours.dayTo = Date.now();
        return await workHours.save();
    },

    findById: async function(id) {
        return await workHoursModel.findById(id);
    },

    findByUserId: async function(id) {
        return await workHoursModel.find({ agent: id, dayTo: null})
            .select('-dayTo -agent -dayFrom')
            .sort('dayOfWeek');
    },

    findByUserIdAndDay: async function(id, dayOfWeek) {
        return await workHoursModel.findOne({ agent: id, dayOfWeek: dayOfWeek, dayTo: null})
            .select('-dayTo -agent -dayFrom')
    },
}
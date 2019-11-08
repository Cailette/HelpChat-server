const userModel = require('../../database/models/users');
const workHoursModel = require('../../database/models/workHours');

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
        return await userModel.findById(id).select('-password');
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

    // POTRZEBA USUWANIA PRZEDSTAWICIELA RÓWNIEŻ!!!
    delete: async function(id){
        return await userModel.deleteOne({ _id: id })
    },

    findAllByRepresentative: async function(representative) {
        return await userModel.find({ $or : [{ _id: representative }, { representative: representative }]}).select('-password');
    },

    findActiveUsersByRepresentative: async function(representative) {
        return await userModel.find( 
            { $and : [
                { $or : [{ _id: representative }, 
                    { representative: representative }] },
                { isActive : true }
            ]
            } ).select('-password');
    },

    findWorkingUsersByRepresentative: async function(representative) {
        const users = await this.findActiveUsersByRepresentative(representative)

        if(!users){
            return;
        }

        const now = new Date(Date.now());
        const workingUsers = [];

        for(var user of users){
            const workHours = await workHoursModel.findOne({ agent: user._id, dayOfWeek: now.getDay(), dayTo: null });
            if((workHours && now.getHours() >= workHours.hourFrom && now.getHours() < workHours.hourTo) || !workHours) {
                workingUsers.push(user);
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
}
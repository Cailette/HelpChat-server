const userModel = require('../../database/models/users');
const workHoursModel = require('../../database/models/workHours');

module.exports = {
    create: async function(firstname, lastname, email, password, isRepresentative) {
        return await userModel.create({ 
            firstname: firstname, 
            lastname: lastname, 
            email: email,
            password: password,
            representative: isRepresentative ? userId : null 
        })
    },

    findByEmail: async function(email){
        return await userModel.findOne({ email: email })
    },

    findById: async function(id) {
        return await userModel.findById(id).select('-password')
    },

    updateUser: async function(user, firstname, lastname, email, password) {
        if(user.constructor.collection.name !== 'User') {
            return;
        }
        user.firstname = firstname || user.firstname;
        user.lastname = lastname || user.lastname;
        user.email = email || user.email;
        user.password = password || user.password;
        return await user.save();
    },

    updateActivity: async function(user){
        if(user.constructor.collection.name !== 'User') {
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
        return await userModel.find({ representative: representative }).select('-password');
    },

    findActiveUsersByRepresentative: async function(representative) {
        return await userModel.find( 
            { $and : [
                { $or : [ { representative: representative }, { _id: representative } ] },
                { isActive : true }
            ]
            } ).select('-password');
    },

    findWorkingUsersByRepresentative: async function(representative) {
        const users = await this.getActiveUsersByRepresentative(representative)
        const now = new Date(Date.now());
        const workingUsers = [];
        for(var user of users){
            const workHours = await workHoursModel.findOne({ agent: mongoose.Types.ObjectId(user._id), dayOfWeek: now.getDay(), dayTo: null });
            if((workHours && now.getHours() >= workHours.hourFrom && now.getHours() < workHours.hourTo) || !workHours) {
                workingUsers.push(user);
            }
        }
        return workingUsers;
    },

    findRandomWorkingUserByRepresentative: async function(representative) {
        const users = await this.findWorkingUsersByRepresentative(representative);
        return users[Math.floor(Math.random() * users.length)];
    },
}
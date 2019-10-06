const userService = require('../../buisnessLogic/services/users');
const activityService = require('../../buisnessLogic/services/activity');
const authenticate = require('../../BuisnessLogic/auth/authenticate');

module.exports = {
    create: async function(req, res) {
        const user = await userService.findByEmail(req.body.email);

        if(user){
            return res.status(400).json({
                message: "User exist!"
            });
        }

        const newUser = await userService.create(
            req.body.firstname, 
            req.body.lastname, 
            req.body.email, 
            req.body.password, 
            req.body.representative ? req.body.id : null 
        );

        if(!newUser){
            return res.status(400).json({
                message: "User can not be added!"
            });
        }
        
        return res.status(201).json({
            message: "User added successfully!", 
            user: userInfo
        });
    },

    login: async function(req, res) {
        const user = await authenticate.authenticate(await userService.findByEmail(req.body.email), req.body.password, req.app.get('secretKey'));
        
        if(!user){
            return res.status(404).json({
                message: "Invalid mail or password!"
            });
        } 
        
        const token = await authenticate.generateToken(user._id, user.representative? user.representative: user._id, req.app.get('secretKey'));

        if(!token){
            return res.status(400).json({
                message: "Token error."
            });
        } 

        return res.status(200).json({
            message: "User login successfully!", 
            token: token
        });
    },

    getById: async function(req, res) {
        const user = await userService.findById(req.params.AgentId ? req.params.AgentId : req.body.id);

        if(!user) {
            return res.status(404).json({
                message: "User can not be found!"
            });
        }

        return res.status(200).json({
            message: "User found successfully!", 
            user: userInfo
        });
    },

    updateById: async function(req, res) {
        const user = await userService.findById(req.params.AgentId ? req.params.AgentId : req.body.userId)

        if(!user) {
            return res.status(404).json({
                message: "User can not be found!"
            });
        }

        const userUpdated = await userService.updateUser(
            user,
            req.body.firstname || user.firstname,
            req.body.lastname || user.lastname,
            req.body.email || user.email,
            req.body.password || user.password
        );

        if(!userUpdated) {
            return res.status(401).json({
                message: "User can not be updated!"
            });
        }

        return res.status(200).json({
            message: "User updated successfully!", 
            user: userUpdated
        }); 
    },

    updateActivity: async function(req, res){
        const user = await userService.findById(req.body.userId)

        if(!user) {
            return res.status(404).json({
                message: "User can not be found!"
            });
        }

        if(user.isActive) {
            await activityService.update(user._id);
        } else {
            await activityService.create(user._id);
        }

        const userUpdated = await userService.updateActivity(user);

        if(!userUpdated) {
            return res.status(401).json({
                message: "User can not be updated!"
            });
        }

        return res.status(200).json({
            message: "User updated successfully!", 
            user: userUpdated
        })
    },

    // POTRZEBA USUWANIA PRZEDSTAWICIELA RÓWNIEŻ!!!
    delete: async function(req, res){
        // if(!req.params.AgentId){
        //     const rest = await userService.deleteMany({ representative: req.body.userId });
        // }

        const userDeleted = await userService.delete(req.params.AgentId ? req.params.AgentId : req.body.userId)

        if(!userDeleted) {
            return res.status(401).json({
                message: "User can not be deleted!"
            });
        }

        return res.status(200).json({
            message: "User deleted successfully!"
        });
    },

    getAll: async function(req, res) {
        const users = await userService.findAllByRepresentative(req.body.userId)

        if(!users) {
            return res.status(404).json({
                message: "Users can not be found!"
            });
        }

        return res.status(200).json({
            message: "Users found successfully!", 
            users: users
        }); 
    },

    getActiveUsers: async function(req, res) {
        const users = await userService.findActiveUsersByRepresentative(req.body.representative);
        
        if(!users || users.length === 0) {
            return res.status(404).json({
                message: "Users can not be found!"
            });
        }

        return res.status(200).json({
            message: "Users found successfully!", 
            users: users
        });
    },

    getRandomWorkingAgent: async function(req, res) {
        const user = await userService.findRandomWorkingUserByRepresentative(req.body.representative)
        
        if(users.length == 0) {
            return res.status(404).json({
                message: "Users can not be found!"
            });
        }

        return res.status(200).json({
            message: "User found successfully!", 
            user: user
        }); 
    },
}
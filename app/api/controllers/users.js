const userModel = require('../models/users');
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
    create: async function(req, res, next) {
        return await userModel.create({ 
            firstname: req.body.firstname, 
            lastname: req.body.lastname, 
            email: req.body.email,
            password: req.body.password,
            representative: req.params.addAgent ? req.body.userId : null })
            .then(userInfo => {
                res.json({
                    status: 200, 
                    message: "User added successfully!", 
                    data: userInfo
                });
            })
            .catch(err => next(err));
    },

    authenticate: async function(req, res, next) {
        return await userModel.findOne({ email: req.body.email })
            .then(user => {
                if(bcrypt.compareSync(req.body.password, user.password)) {
                    const token = jwt.sign({ id: user._id }, req.app.get('secretKey'), { expiresIn: '24h' });
                    res.json({
                        status: 200, 
                        message: "User found successfully!", 
                        data:{  
                            token: token 
                        }
                    });
                }else{
                    res.json({
                        status: 401, 
                        message: "Invalid email or password!", 
                        data: null
                    });
                }
            })
            .catch(err => next(err));
    },

    getById: async function(req, res, next) {
        return await userModel.findById(req.params.AgentId ? req.params.AgentId : req.body.userId).select('-password')
            .then(userInfo => { 
                res.json({
                    status: 200, 
                    message: "User found successfully!", 
                    data:{ 
                        user: userInfo
                    }
                }); 
            })
            .catch(err => next(err));
    },

    updateById: async function(req, res, next) {
        console.log("req.params.AgentId" + req.params.AgentId)
        return await userModel.findById(req.params.AgentId ? req.params.AgentId : req.body.userId)
            .then(user => {
                user.firstname = req.body.firstname || user.firstname;
                user.lastname = req.body.lastname || user.lastname;
                user.email = req.body.email || user.email;
                user.password = req.body.password || user.password;
                user.save();
            })
            .catch(err => {
                return res.json({
                    status: 401, 
                    message: "Invalid data!", 
                    data:{ 
                        err: err
                    }
                }); 
            })
            .then(userUpdated => {
                res.json({
                    status: 200, 
                    message: "User updated successfully!", 
                    data:{ 
                        user: userUpdated
                    }
                }); 
            })
            .catch(err => {
                return res.json({
                    status: 401, 
                    message: "Invalid data!", 
                    data:{ 
                        err: err
                    }
                }); 
            });
    },

    switchActivity: async function(req, res, next){
        return await userModel.findById(req.body.userId)
            .then(user => { 
                user.isActive = !user.isActive; user.save() 
            })
            .then(userUpdated => { 
                res.json({
                status: 200, 
                message: "User updated successfully!", 
                data:{ 
                    user: userUpdated
                }})
            })
            .catch(err => next(err));
    },

    // NIE TESTOWANE
    delete: async function(req, res, next){
        if(!req.params.AgentId){
            const rest = await userModel.deleteMany({ representative: req.body.userId });
        }
        return await userModel.deleteOne({ _id: req.params.AgentId ? req.params.AgentId : req.body.userId })
            .then(userDeleted => { 
                res.json({
                    status: 200, 
                    message: "User deleted successfully!", 
                    data: null
                });
            })
            .catch(err => next(err));
    },

    getAll: async function(req, res, next) {
        return await userModel.find({ representative: req.body.userId }).select('-password')
            .then(users => { 
                res.json({
                    status: 200, 
                    message: "Users found successfully!", 
                    data:{ 
                        user: users
                    }
                }); 
            })
            .catch(err => next(err));
    },
}
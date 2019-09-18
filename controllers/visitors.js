const visitorModel = require('../models/visitors');
var moment = require('moment');
const jwt = require('jsonwebtoken');

module.exports = {
    create: async function(req, res) {
            const visitorInfo = await visitorModel.create({ 
                geoLocation: {
                    lat: req.body.geoLocation.lat, 
                    lng: req.body.geoLocation.lng
                },
                ipAddress: req.body.ipAddress, 
                browserSoftware: req.body.browserSoftware,
                operatingSoftware: req.body.operatingSoftware,
                representative: req.body.representative
            })

        if(!visitorInfo){
            return res.status(400).json({
                message: "Visitor can not be added!"
            });
        }
        
        const token = jwt.sign({ id: visitorInfo._id, representative: visitorInfo.representative}, req.app.get('secretKey'));
        
        return res.status(201).json({
            message: "Visitor added successfully!", 
            visitor: visitorInfo, 
            token: token
        });
    },
    
    updateLastVisit: async function(req, res, next) {
        const visitor = await visitorModel.findById(req.body.visitorId)

        if(!visitor){
            return res.status(404).json({
                message: "Visitor not exist!", 
                data: null
            });
        } 
        

        const visitorUpdated = await visitor.save();

        if(!visitorUpdated) {
            return res.status(400).json({
                message: "Visitor can not be updated!"
            });
        }

        return res.status(200).json({
            message: "Visitor updated successfully!", 
            visitor: visitorUpdated
        }); 
    },

    update: async function(req, res, next) {
        const visitor = await visitorModel.findById(req.body.visitorId)

        if(!visitor){
            return res.status(404).json({
                message: "Visitor not exist!", 
                data: null
            });
        } 

        if(visitor.isActive){
            const now = new Date(Date.now());
            visitor.lastVisit = now;
            visitor.isActive = false;
        } else {
            visitor.isActive = true;
        }

        const visitorUpdated = await visitor.save();

        if(!visitorUpdated) {
            return res.status(400).json({
                message: "Visitor can not be updated!"
            });
        }

        return res.status(200).json({
            message: "Visitor updated successfully!", 
            visitor: visitorUpdated
        }); 
    },

    getById: async function(req, res, next) {
        const visitorInfo = await visitorModel.findById(req.params.VisitorId ? req.params.VisitorId : req.body.visitorId)

        if(!visitorInfo) {
            return res.status(404).json({
                message: "Visitor can not be found!"
            });
        }

        return res.status(200).json({
            message: "Visitor found successfully!", 
            visitor: visitorInfo
        }); 
    },

    getAll: async function(req, res, next) {
        const visitorsInfo = await visitorModel.find({representative: req.body.isRepresentative? req.body.userId: req.body.representative, isActive: true})

        if(!visitorsInfo) {
            return res.status(404).json({
                message: "Visitors can not be found!"
            });
        }

        return res.status(200).json({
            message: "Visitors found successfully!", 
            visitors: visitorsInfo
        }); 
    },
}
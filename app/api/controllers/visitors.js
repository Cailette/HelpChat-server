const visitorModel = require('../models/visitor');
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
            return res.status(401).json({
                message: "Visitor can not be added!"
            });
        }
        
        const token = jwt.sign({ id: visitorInfo._id, representative: visitorInfo.representative}, req.app.get('secretKey'));
        
        return res.status(201).json({
            message: "Visitor added successfully!", 
            data: visitorInfo, 
            token: token
        });
    },

    // on disconnect update data for last visit
    updateLastVisit: async function(req, res, next) {
        const visitor = await visitorModel.findById(req.body.visitorId)

        if(!visitor){
            return res.status(401).json({
                message: "Visitor not exist!", 
                data: null
            });
        } 
        
        const now = new Date(Date.now());
        visitor.lastVisit = now;

        const visitorUpdated = await visitor.save();

        if(!visitorUpdated) {
            return res.status(401).json({
                message: "Visitor can not be updated!"
            });
        }

        return res.status(200).json({
            message: "Visitor updated successfully!", 
            data: visitorUpdated
        }); 
    },

    getById: async function(req, res, next) {
        const visitorInfo = await visitorModel.findById(req.body.visitorId)

        if(!visitorInfo) {
            return res.status(401).json({
                message: "Visitor can not be found!"
            });
        }

        return res.status(200).json({
            message: "Visitor found successfully!", 
            data: visitorInfo
        }); 
    },
}
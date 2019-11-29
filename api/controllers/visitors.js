const visitorService = require('../../buisnessLogic/services/visitors');
const authenticate = require('../../buisnessLogic/auth/authenticate');
var mongoose = require('mongoose');

module.exports = {
    create: async function(req, res) {
        const { browserSoftware, operatingSoftware, representative} = req.body;
        const { lat, lng } = req.body.geoLocation;
        const validation = visitorService.visitorValidate({
            lat, lng,
            browserSoftware, 
            operatingSoftware
        })

        if(validation.error !== null){
            return res.status(400).json({
                message: "Invalid data!"
            });
        }

        if(!mongoose.Types.ObjectId.isValid(representative)){
            return res.status(400).json({
                message: "Licence ID is required!"
            });
        }

        const visitor = await visitorService.create(
            { lat: lat || "Brak danych", 
              lng: lng || "Brak danych" },
            browserSoftware || "Brak danych", 
            operatingSoftware || "Brak danych", 
            representative
        )

        if(!visitor){
            return res.status(400).json({
                message: "Visitor can not be added!"
            });
        }
        
        const token = await authenticate.generateToken(visitor._id, visitor.representative);

        if(!token){
            return res.status(400).json({
                message: "User created but token error."
            });
        } 

        return res.status(200).json({
            message: "Visitor added successfully!", 
            visitor: visitor,
            token: token
        });
    },

    getById: async function(req, res) {
        const visitorInfo = await visitorService.findById(
            req.params.visitorId ? req.params.visitorId : req.body.id)

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
    
    updateStatus: async function(req, res) {
        const visitor = await visitorService.findById(req.body.id)

        if(!visitor){
            return res.status(404).json({
                message: "Visitor not exist!", 
                data: null
            });
        } 

        let status = req.params.status === 'true' ? true : false;
        const visitorUpdated = await visitorService.updateVisitor(visitor, status);

        if(!visitorUpdated) {
            return res.status(404).json({
                message: "Visitor can not be updated!"
            });
        }
        
        return res.status(200).json({
            message: "Visitor updated successfully!", 
            visitor: visitorUpdated
        }); 
    },

    getAll: async function(req, res) {
        const visitorsInfo = await visitorService.findAllByRepresentative(
            req.body.representative == null? req.body.id: req.body.representative)

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

    countChats: async function(req, res) {
        const countedChats = await visitorService.countChats(
            req.params.visitorId ? req.params.visitorId : req.body.id)

        if(!countedChats) {
            return res.status(200).json({
                message: "Counted successfully!", 
                countedChats: 0
            });
        }

        return res.status(200).json({
            message: "Counted successfully!", 
            countedChats: countedChats
        }); 
    },
}
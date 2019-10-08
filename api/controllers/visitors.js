const visitorService = require('../../buisnessLogic/services/visitors');
const authenticate = require('../../BuisnessLogic/auth/authenticate');


module.exports = {
    create: async function(req, res) {
        const visitor = await visitorService.create({
                lat: req.body.geoLocation.lat || "Brak danych", 
                lng: req.body.geoLocation.lng || "Brak danych"
            }, 
            req.body.ipAddress || "Brak danych", 
            req.body.browserSoftware || "Brak danych", 
            req.body.operatingSoftware || "Brak danych", 
            req.body.representative
        )

        if(!visitor){
            return res.status(400).json({
                message: "Visitor can not be added!"
            });
        }

        const token = await authenticate.generateToken(visitor._id, visitor.representative, req.app.get('secretKey'));

        if(!token){
            return res.status(400).json({
                message: "Token error."
            });
        } 

        return res.status(200).json({
            message: "Visitor added successfully!", 
            visitor: visitor,
            token: token
        });
    },
    
    update: async function(req, res) {
        const visitor = await visitorService.findById(req.body.id)

        if(!visitor){
            return res.status(404).json({
                message: "Visitor not exist!", 
                data: null
            });
        } 
        
        const visitorUpdated = await visitorService.updateVisitor(visitor);

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

    getById: async function(req, res) {
        const visitorInfo = await visitorService.findById(req.params.id ? req.params.id : req.body.id)

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

    getAll: async function(req, res) {
        const visitorsInfo = await visitorService.findAllByRepresentative(req.body.isRepresentative? req.body.id: req.body.representative)

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
const visitorModel = require('../../database/models/visitors');
const chatModel = require('../../database/models/chats');
var Joi = require('joi');

module.exports = {
    create: async function(geoLocation, 
        browserSoftware, operatingSoftware, representative) {
        return await visitorModel.create({ 
            geoLocation: {
                lat: geoLocation.lat, 
                lng: geoLocation.lng
            },
            browserSoftware: browserSoftware,
            operatingSoftware: operatingSoftware,
            representative: representative
        })
    },

    updateVisitor: async function(visitor, status) {
        if(visitor.constructor.modelName !== 'Visitor') {
            return;
        }

        if(!status) {
            const now = new Date(Date.now());
            visitor.lastVisit = now;
        }
        
        visitor.isActive = status;
        return await visitor.save();
    },

    findById: async function(id) {
        return await visitorModel.findById(id);
    },

    findAllByRepresentative: async function(representative) {
        return await visitorModel.find({
            representative: representative, isActive: true
        })
    },

    countChats: async function(visitorId) {
        return await chatModel.count({visitor: visitorId, isActive: false})
    },

    visitorValidate: function(visitor) {
        var schema = {
            lat: Joi.number(), 
            lng: Joi.number(),
            browserSoftware: Joi.string(),
            operatingSoftware: Joi.string(),
        }
        return Joi.validate(visitor, schema);
    }
}
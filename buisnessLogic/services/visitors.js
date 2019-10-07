const visitorModel = require('../../database/models/visitors');
var moment = require('moment');
const jwt = require('jsonwebtoken');

module.exports = {
    create: async function(geoLocation, ipAddress, browserSoftware, representative) {
        return await visitorModel.create({ 
            geoLocation: {
                lat: geoLocation.lat, 
                lng: geoLocation.lng
            },
            ipAddress: ipAddress, 
            browserSoftware: browserSoftware,
            operatingSoftware: operatingSoftware,
            representative: representative
        })
    },

    updateVisitor: async function(visitor) {
        if(visitor.constructor.modelName !== 'Visitor') {
            return;
        }

        if(visitor.isActive){
            const now = new Date(Date.now());
            visitor.lastVisit = now;
            visitor.isActive = false;
        } else {
            visitor.isActive = true;
        }

        return await visitor.save();
    },

    findById: async function(id) {
        return await visitorModel.findById(id);
    },

    findAllByRepresentative: async function(representative) {
        return await visitorModel.find({representative: representative, isActive: true})
    },
}
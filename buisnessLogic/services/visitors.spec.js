var expect = require('chai').expect;
const sinon = require('sinon');
const sinonTest = require('sinon-test')(sinon);
const sinonMongoose = require('sinon-mongoose')
var visitorService = require('./visitors');
var visitorModel = require('../../database/models/visitors');
var chatModel = require('../../database/models/chats');
var mongoose = require('mongoose');
const faker = require("faker");
 
describe('visitorService', function() {
    sinon.stub(visitorModel.prototype, 'save')

    var m = new visitorModel({ 
        geoLocation: {
            lat: faker.random.number(),
            lng: faker.random.number()
        },
        browserSoftware: faker.random.word(),
        operatingSoftware: faker.random.word(),
        representative: mongoose.Types.ObjectId()
    });

    it('should create visitor with same data', sinonTest(async function() {
        let createSpy = sinon.spy(visitorService, 'create');
        sinon
            .mock(visitorModel)
            .expects('create')
            .withArgs({ 
                geoLocation: {
                    lat: m.geoLocation.lat,
                    lng: m.geoLocation.lng
                },
                browserSoftware: m.browserSoftware, 
                operatingSoftware: m.operatingSoftware, 
                representative: m.representative
            })
            .resolves(m)
        const visitor = await visitorService.create(m.geoLocation, m.browserSoftware, m.operatingSoftware, m.representative);
        sinon.assert.calledOnce(createSpy);
        createSpy.restore();
        visitorModel.create.restore();
    }));

    it('should update visitor with same data', sinonTest(async function() {
        let updateSpy = sinon.spy(visitorService, 'updateVisitor');
        var status = faker.random.boolean();
        sinon
            .mock(visitorModel)
            .expects('update')
            .resolves(m)
        const visitor = await visitorService.updateVisitor(m, status);
        sinon.assert.calledOnce(updateSpy);
        updateSpy.restore();
        visitorModel.update.restore();
    }));

    it('should find visitor with same id', sinonTest(async function() {
        let findByIdSpy = sinon.spy(visitorService, 'findById');
        sinon
            .mock(visitorModel)
            .expects('findById')
            .withArgs(m._id)
            .resolves(m)
        const user = await visitorService.findById(m._id);
        sinon.assert.calledOnce(findByIdSpy);
        findByIdSpy.restore();
        visitorModel.findById.restore();
    }));

    it('should find all visitors with same representative id', sinonTest(async function() {
        let findAllByRepresentativeSpy = sinon.spy(visitorService, 'findAllByRepresentative');
        sinon
            .mock(visitorModel)
            .expects('find')
            .withArgs({
                representative: m.representative, 
                isActive: true
            })
            .resolves(m)
        const user = await visitorService.findAllByRepresentative(m.representative);
        sinon.assert.calledOnce(findAllByRepresentativeSpy);
        findAllByRepresentativeSpy.restore();
        visitorModel.find.restore();
    }));

    it('should count visitor\'s chats by some visitor id', sinonTest(async function() {
        let countChatsSpy = sinon.spy(visitorService, 'countChats');
        sinon
            .mock(chatModel)
            .expects('count')
            .withArgs({
                visitor: m._id, 
                isActive: false
            })
            .resolves(faker.random.number())
        const user = await visitorService.countChats(m._id);
        sinon.assert.calledOnce(countChatsSpy);
        countChatsSpy.restore();
        chatModel.count.restore();
    }));

    it('should be valid if validate new visitor', function(done) {
        const v = {
            lat: m.geoLocation.lat, 
            lng: m.geoLocation.lng, 
            browserSoftware: m.browserSoftware,
            operatingSoftware: m.operatingSoftware,
        }
        const val = visitorService.visitorValidate(v);
        expect(val.error).to.be.null;
        done();
    });
});
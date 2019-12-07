var expect = require('chai').expect;
const sinon = require('sinon');
const sinonTest = require('sinon-test')(sinon);
const sinonMongoose = require('sinon-mongoose')
var activityService = require('./activity');
var workHours = require('./workHours');
var activitiesModel = require('../../database/models/activities');
var mongoose = require('mongoose');
 
describe('activityService', function() {
    sinon.stub(activitiesModel.prototype, 'save')

    var m = new activitiesModel({ 
        agent: mongoose.Types.ObjectId(),
        from: new Date()
    });

    it('should create activity with some data by user id', sinonTest(async function() {
        sinon
            .mock(activitiesModel)
            .expects('create')
            .resolves(m)
        sinon
            .mock(workHours)
            .expects('findByUserId')
            .resolves(null)
            
        const activity = await activityService.create(m.agent);
        workHours.findByUserId.restore();
        activitiesModel.create.restore();
    }));

    it('should update activity with some data by user id', sinonTest(async function() {
        sinon
            .mock(activitiesModel)
            .expects('findOne')
            .withArgs({ 
                agent: m.agent,
                to: null
            })
            .resolves(m)
        sinon
            .mock(workHours)
            .expects('findByUserId')
            .resolves(null)

        const activity = await activityService.update(m.agent);
        workHours.findByUserId.restore();
        activitiesModel.findOne.restore();
    }));

    it('should chcek for activity with some user id', sinonTest(async function() {
        sinon
            .mock(activitiesModel)
            .expects('find')
            .chain('populate')
            .withArgs({
                path: 'agent',
                select: '_id firstname lastname email'
            })
            .chain('sort')
            .withArgs({from: 1})
            .resolves(m)

        const activity = await activityService.findByUserId(m.agent);
        activitiesModel.find.restore();
    }));
});


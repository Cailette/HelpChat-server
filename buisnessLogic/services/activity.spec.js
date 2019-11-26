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

    it('should create activity with same data by user id', sinonTest(async function() {
        let createSpy = sinon.spy(activityService, 'create');
        sinon
            .mock(workHours)
            .expects('findByUserIdAndDay')
            .resolves(null)
        sinon
            .mock(activitiesModel)
            .expects('create')
            .resolves(m)
            
        const activity = await activityService.create(m.agent);
        sinon.assert.calledOnce(createSpy);

        createSpy.restore();
        workHours.findByUserIdAndDay.restore();
        activitiesModel.create.restore();
    }));

    it('should update activity with same data by user id', sinonTest(async function() {
        let updateSpy = sinon.spy(activityService, 'update');
        sinon
            .mock(workHours)
            .expects('findByUserIdAndDay')
            .resolves(null)
        sinon
            .mock(activitiesModel)
            .expects('findOne')
            .withArgs({ 
                agent: m.agent,
                to: null
            })
            .resolves(m)

        const activity = await activityService.update(m.agent);
        sinon.assert.calledOnce(updateSpy);

        updateSpy.restore();
        workHours.findByUserIdAndDay.restore();
        activitiesModel.findOne.restore();
    }));

    it('should chcek for activity with some user id', sinonTest(async function() {
        let findByUserIdSpy = sinon.spy(activityService, 'findByUserId');
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
        sinon.assert.calledOnce(findByUserIdSpy);

        findByUserIdSpy.restore();
        activitiesModel.find.restore();
    }));
});


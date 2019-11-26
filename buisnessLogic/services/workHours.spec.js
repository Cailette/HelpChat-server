var expect = require('chai').expect;
const sinon = require('sinon');
const sinonTest = require('sinon-test')(sinon);
const sinonMongoose = require('sinon-mongoose')
var workHoursService = require('./workHours');
var workHoursModel = require('../../database/models/workHours');
var mongoose = require('mongoose');
const faker = require("faker");
 
describe('workHoursService', function() {
    sinon.stub(workHoursModel.prototype, 'save')

    var m = new workHoursModel({ 
        agent: mongoose.Types.ObjectId(),
        hourFrom: Math.floor(Math.random() * 10),
        hourTo: Math.floor(Math.random() * 10) + 10,
        dayOfWeek: Math.floor(Math.random() * 7) 
    });

    it('should create work hours with same data for some user', sinonTest(async function() {
        let createSpy = sinon.spy(workHoursService, 'create');
        sinon
            .mock(workHoursModel)
            .expects('findOne')
            .resolves(null)
        sinon
            .mock(workHoursModel)
            .expects('create')
            .withArgs({ 
                agent: m.agent,
                hourFrom: m.hourFrom,
                hourTo: m.hourTo,
                dayOfWeek: m.dayOfWeek 
            })
            .resolves(m)
            
        const workHours = await workHoursService.create(m.agent, m.hourFrom, m.hourTo, m.dayOfWeek);
        sinon.assert.calledOnce(createSpy);

        createSpy.restore();
        workHoursModel.findOne.restore();
        workHoursModel.create.restore();
    }));

    it('should update work hour\'s day to with some day and user', sinonTest(async function() {
        let updateDayToSpy = sinon.spy(workHoursService, 'updateDayTo');
        const workHours = await workHoursService.updateDayTo(m);
        sinon.assert.calledOnce(updateDayToSpy);
        updateDayToSpy.restore();
    }));

    it('should check for work hours with same id', sinonTest(async function() {
        let findByIdSpy = sinon.spy(workHoursService, 'findById');
        sinon
            .mock(workHoursModel)
            .expects('findById')
            .resolves(m)
        const workHours = await workHoursService.findById(m._id);
        sinon.assert.calledOnce(findByIdSpy);

        findByIdSpy.restore();
        workHoursModel.findById.restore();
    }));

    it('should check for work hours with same user id', sinonTest(async function() {
        let findByUserIdSpy = sinon.spy(workHoursService, 'findByUserId');
        sinon
            .mock(workHoursModel)
            .expects('find')
            .withArgs({ 
                agent: m.agent, 
                dayTo: null
            })
            .chain('select')
            .withArgs('-dayTo -agent -dayFrom')
            .chain('sort')
            .withArgs('dayOfWeek')
            .resolves(m)
        const workHours = await workHoursService.findByUserId(m.agent);
        sinon.assert.calledOnce(findByUserIdSpy);
        
        findByUserIdSpy.restore();
        workHoursModel.find.restore();
    }));

    it('should check for work hours with same user id and day', sinonTest(async function() {
        let findByUserIdAndDaySpy = sinon.spy(workHoursService, 'findByUserIdAndDay');
        sinon
            .mock(workHoursModel)
            .expects('findOne')
            .withArgs({ 
                agent: m.agent, 
                dayOfWeek: m.dayOfWeek, 
                dayTo: null
            })
            .chain('select')
            .withArgs('-dayTo -agent -dayFrom')
            .resolves(m)
        const workHours = await workHoursService.findByUserIdAndDay(m.agent,m.dayOfWeek);
        sinon.assert.calledOnce(findByUserIdAndDaySpy);
        
        findByUserIdAndDaySpy.restore();
        workHoursModel.findOne.restore();
    }));

    it('should be valid if validate new work hours', function(done) {
        const wh = {
            dayOfWeek: m.dayOfWeek,
            hourTo: m.hourTo,
            hourFrom: m.hourFrom,
        }
        const val = workHoursService.workHoursValidate(wh);
        expect(val.error).to.be.null;
        done();
    });

});


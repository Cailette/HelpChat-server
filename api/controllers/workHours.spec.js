var expect = require('chai').expect;
const sinon = require('sinon');
const sinonTest = require('sinon-test')(sinon);
var workHoursController = require('./workHours');
var workHoursService = require('../../buisnessLogic/services/workHours');
const workHoursModel = require('../../database/models/workHours');
const authenticate = require('../../BuisnessLogic/auth/authenticate');
const faker = require("faker");
var mongoose = require('mongoose');

describe("VisitorController", function() {
    var work = new workHoursModel({ 
        agent: mongoose.Types.ObjectId(),
        hourFrom: Math.floor(Math.random() * 10),
        hourTo: Math.floor(Math.random() * 10) + 10,
        dayOfWeek: Math.floor(Math.random() * 7) 
    });

    describe("create", function() {

      let status, json, res;
      beforeEach(() => {
        status = sinon.stub();
        json = sinon.spy();
        res = { json, status };
        status.returns(res);
      });

      it("should not create a work hours when validation return error", async function() {
        const req = { body: { hourFrom: work.hourFrom, hourTo: work.hourTo} };

        const workHoursValidateSub = sinon.stub(workHoursService, "workHoursValidate").returns({error: true});
        await workHoursController.create(req, res);

        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(400);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0].message).to.equal("Invalid data!")

        workHoursValidateSub.restore();
      });

      it("should create a work hours successfully", async function() {
        const req = { body: { hourFrom: work.hourFrom, hourTo: work.hourTo}, params: { AgentId: mongoose.Types.ObjectId() }};
            
        const workHoursValidateSub = sinon.stub(workHoursService, "workHoursValidate").returns({error: null});
        const createSub = sinon.stub(workHoursService, "create").returns(new workHoursModel());
    
        await workHoursController.create(req, res);

        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(200);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0].message).to.equal("Work Hours added successfully!")

        workHoursValidateSub.restore();
        createSub.restore();
      });
    });

    describe("updateDayTo", function() {

      let status, json, res;
      beforeEach(() => {
        status = sinon.stub();
        json = sinon.spy();
        res = { json, status };
        status.returns(res);
      });

      it("should not update day to when work hours id is not provided", async function() {
        const req = { body: { id:  mongoose.Types.ObjectId() }, params: {} };

        const findByIdSub = sinon.stub(workHoursService, "findById").returns(null);
    
        await workHoursController.updateDayTo(req, res);

        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(404);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0].message).to.equal("Work Hours not found!")

        findByIdSub.restore();
      });

      it("should update day to when work hours id is provided", async function() {
        const req = { body: { id:  mongoose.Types.ObjectId() }, params: {} };

        const findByIdSub = sinon.stub(workHoursService, "findById").returns(work);
        const updateDayToSub = sinon.stub(workHoursService, "updateDayTo").returns(work);
    
        await workHoursController.updateDayTo(req, res);

        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(200);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0].message).to.equal("Work Hours updated successfully!")

        findByIdSub.restore();
        updateDayToSub.restore();
      });
    });

    describe("getByAgentId", function() {

      let status, json, res;
      beforeEach(() => {
        status = sinon.stub();
        json = sinon.spy();
        res = { json, status };
        status.returns(res);
      });

      it("should not find agent when agent with some id not exist", async function() {
        const req = { body: { id:  mongoose.Types.ObjectId() }, params: { AgentId: mongoose.Types.ObjectId() }};

        const findByUserIdSub = sinon.stub(workHoursService, "findByUserId").returns(null);
    
        await workHoursController.getByAgentId(req, res);

        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(404);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0].message).to.equal("Work Hours not found!")

        findByUserIdSub.restore();
      });

      it("should find day to when gent with some id exist", async function() {
        const req = { body: { id:  mongoose.Types.ObjectId() }, params: { AgentId: mongoose.Types.ObjectId() }};

        const findByIdSub = sinon.stub(workHoursService, "findById").returns(work);
        const findByUserIdSub = sinon.stub(workHoursService, "findByUserId").returns(work);
    
        await workHoursController.getByAgentId(req, res);

        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(200);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0].message).to.equal("Work Hours found successfully!")

        findByUserIdSub.restore();
      });
    });

    describe("getDayByAgentId", function() {

      let status, json, res;
      beforeEach(() => {
        status = sinon.stub();
        json = sinon.spy();
        res = { json, status };
        status.returns(res);
      });

      it("should not find working day when agent with some id not exist", async function() {
        const req = { body: { dayOfWeek: work.dayOfWeek }, params: { AgentId: mongoose.Types.ObjectId() }};

        const findByUserIdSub = sinon.stub(workHoursService, "findByUserIdAndDay").returns(null);
    
        await workHoursController.getDayByAgentId(req, res);

        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(404);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0].message).to.equal("Work Hours not found!")

        findByUserIdSub.restore();
      });

      it("should find working day when agent with some id exist", async function() {
        const req = { body: { dayOfWeek: work.dayOfWeek }, params: { AgentId: mongoose.Types.ObjectId() }};

        const findByUserIdSub = sinon.stub(workHoursService, "findByUserIdAndDay").returns(work);
    
        await workHoursController.getDayByAgentId(req, res);

        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(200);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0].message).to.equal("Work Hours found successfully!")

        findByUserIdSub.restore();
      });
    });
  });
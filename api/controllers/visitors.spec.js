var expect = require('chai').expect;
const sinon = require('sinon');
const sinonTest = require('sinon-test')(sinon);
var visitorController = require('./visitors');
var visitorsService = require('../../buisnessLogic/services/visitors');
const visitorModel = require('../../database/models/visitors');
const authenticate = require('../../buisnessLogic/auth/authenticate');
const faker = require("faker");
var mongoose = require('mongoose');

describe("VisitorController", function() {
    describe("create", function() {

      let status, json, res;
      beforeEach(() => {
        status = sinon.stub();
        json = sinon.spy();
        res = { json, status };
        status.returns(res);
      });

      it("should not create a visitor when validation return error", async function() {
        const req = { body: { geoLocation: { lat: faker.address.latitude(), lng: faker.address.longitude() }, 
          browserSoftware: faker.random.word(), operatingSoftware: faker.internet.userAgent(), representative: mongoose.Types.ObjectId()} 
        };

        const visitorValidateSub = sinon.stub(visitorsService, "visitorValidate").returns({error: true});
        await visitorController.create(req, res);

        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(400);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0].message).to.equal("Invalid data!")

        visitorValidateSub.restore();
      });

      it("should not create a visitor when representative param is not provided", async function() {
        const req = { body: {geoLocation: { lat: faker.address.latitude(), lng: faker.address.longitude() }, 
            browserSoftware: faker.internet.userAgent, operatingSoftware: faker.internet.userAgent} };

        const visitorValidateSub = sinon.stub(visitorsService, "visitorValidate").returns({error: null});
        await visitorController.create(req, res);

        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(400);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0].message).to.equal("Licence ID is required!")

        visitorValidateSub.restore();
      });

      it("should not return token when token generator return null", async function() {
        const req = { body: {geoLocation: { lat: faker.address.latitude(), lng: faker.address.longitude() }, 
            browserSoftware: faker.internet.userAgent, operatingSoftware: faker.internet.userAgent, 
            representative: mongoose.Types.ObjectId()} };
            
        const visitorValidateSub = sinon.stub(visitorsService, "visitorValidate").returns({error: null});
        const createSub = sinon.stub(visitorsService, "create").returns(new visitorModel());
        const generateTokenSub = sinon.stub(authenticate, "generateToken").returns(null);
    
        await visitorController.create(req, res);

        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(400);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0].message).to.equal("User created but token error.")

        visitorValidateSub.restore();
        createSub.restore();
        generateTokenSub.restore();
      });

      it("should create visitor successfully", async function() {
        const req = { body: {geoLocation: { lat: faker.address.latitude(), lng: faker.address.longitude() }, 
            browserSoftware: faker.internet.userAgent, operatingSoftware: faker.internet.userAgent, 
            representative: mongoose.Types.ObjectId()} };
            
        const visitorValidateSub = sinon.stub(visitorsService, "visitorValidate").returns({error: null});
        const createSub = sinon.stub(visitorsService, "create").returns(new visitorModel());
        const generateTokenSub = sinon.stub(authenticate, "generateToken").returns(faker.random.uuid());
    
        await visitorController.create(req, res);

        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(200);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0].message).to.equal("Visitor added successfully!")

        visitorValidateSub.restore();
        createSub.restore();
        generateTokenSub.restore();
      });
    });

    describe("getById", function() {

      let status, json, res;
      beforeEach(() => {
        status = sinon.stub();
        json = sinon.spy();
        res = { json, status };
        status.returns(res);
      });

      it("should not get by id a visitor when user not exist", async function() {
        const req = { body: { id:  mongoose.Types.ObjectId() }, params: {} };

        const getByIdSub = sinon.stub(visitorsService, "findById").returns(null);
    
        await visitorController.getById(req, res);

        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(404);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0].message).to.equal("Visitor can not be found!")

        getByIdSub.restore();
      });

      it("should get by id a visitor when user exist", async function() {
        const req = { body: { id:  mongoose.Types.ObjectId() }, params: {} };

        const getByIdSub = sinon.stub(visitorsService, "findById").returns(new visitorModel());
    
        await visitorController.getById(req, res);

        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(200);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0].message).to.equal("Visitor found successfully!")

        getByIdSub.restore();
      });
    });

  describe("updateStatus", function() {

      let status, json, res;
      beforeEach(() => {
        status = sinon.stub();
        json = sinon.spy();
        res = { json, status };
        status.returns(res);
      });

      it("should not update status by visitor id when visitor can not be found", async function() {
        const req = { body: {}, params: {}  };

        const findByIdSub = sinon.stub(visitorsService, "findById").returns(null);
        await visitorController.updateStatus(req, res);

        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(404);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0].message).to.equal("Visitor not exist!")

        findByIdSub.restore();
      });

      it("should update status by visitor id when visitor can be found", async function() {
        const req = { body: { id: mongoose.Types.ObjectId() }, params: { status: true }  };
        var visitor = new visitorModel();

        const findByIdSub = sinon.stub(visitorsService, "findById").returns(visitor);
        const updateVisitorSub = sinon.stub(visitorsService, "updateVisitor").returns(visitor);
    
        await visitorController.updateStatus(req, res);

        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(200);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0].message).to.equal("Visitor updated successfully!")

        findByIdSub.restore();
        updateVisitorSub.restore();
      });
    });

    describe("getAll", function() {

      let status, json, res;
      beforeEach(() => {
        status = sinon.stub();
        json = sinon.spy();
        res = { json, status };
        status.returns(res);
      });

      it("should find all visitors by representative when visitor is representative", async function() {
        const req = { body: { representative: mongoose.Types.ObjectId() }, params: {}  };

        const findAllByRepresentativeSub = sinon.stub(visitorsService, "findAllByRepresentative").returns([new visitorModel()]);
        await visitorController.getAll(req, res);

        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(200);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0].message).to.equal("Visitors found successfully!")

        findAllByRepresentativeSub.restore();
      });
    });

    describe("countChats", function() {

      let status, json, res;
      beforeEach(() => {
        status = sinon.stub();
        json = sinon.spy();
        res = { json, status };
        status.returns(res);
      });

      it("should count chats when visitor id param is provided", async function() {
        const req = { body: {}, params: { visitorId: mongoose.Types.ObjectId() }  };

        const countChatsSub = sinon.stub(visitorsService, "countChats").returns(faker.random.number());
        await visitorController.countChats(req, res);

        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(200);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0].message).to.equal("Counted successfully!")

        countChatsSub.restore();
      });

      it("should count chats as 0 when visitor has no chats", async function() {
        const req = { body: {}, params: { visitorId: mongoose.Types.ObjectId() }  };

        const countChatsSub = sinon.stub(visitorsService, "countChats").returns(null);
        await visitorController.countChats(req, res);

        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(200);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0].message).to.equal("Counted successfully!")
        expect(json.args[0][0].countedChats).to.equal(0)

        countChatsSub.restore();
      });
    });
  });
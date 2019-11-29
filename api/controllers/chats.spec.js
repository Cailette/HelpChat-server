var expect = require('chai').expect;
const sinon = require('sinon');
const sinonTest = require('sinon-test')(sinon);
var chatController = require('./chats');
var chatsService = require('../../buisnessLogic/services/chats');
const chatModel = require('../../database/models/chats');
var mongoose = require('mongoose');

describe("ChatController", function() {
    describe("getById", function() {

      let status, json, res;
      beforeEach(() => {
        status = sinon.stub();
        json = sinon.spy();
        res = { json, status };
        status.returns(res);
      });

      it("should not get by id a chat when chat id param is not provided", async function() {
        const req = { body: { id:  mongoose.Types.ObjectId() }, params: {} };
        const getByIdSub = sinon.stub(chatsService, "findById").returns(null);
    
        await chatController.getById(req, res);

        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(404);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0].message).to.equal("Chat not found!")

        getByIdSub.restore();
      });

      it("should get by id a chat when chat id param is provided", async function() {
        const req = { body: { id:  mongoose.Types.ObjectId() }, params: { ChatId: mongoose.Types.ObjectId()} };
        const getByIdSub = sinon.stub(chatsService, "findById").returns(new chatModel());
    
        await chatController.getById(req, res);

        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(200);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0].message).to.equal("Chat found successfully!")

        getByIdSub.restore();
      });
    });

    describe("getActiveByAgentId", function() {

      let status, json, res;
      beforeEach(() => {
        status = sinon.stub();
        json = sinon.spy();
        res = { json, status };
        status.returns(res);
      });

      it("should not get chats when there is no active chats", async function() {
        const req = { body: { id:  mongoose.Types.ObjectId() }, params: {} };
        const findActiveByUserIdSub = sinon.stub(chatsService, "findActiveByUserId").returns(null);
    
        await chatController.getActiveByAgentId(req, res);

        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(404);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0].message).to.equal("Chats not found!")

        findActiveByUserIdSub.restore();
      });

      it("should get active chats when represntative param is null and active chats exist", async function() {
        const req = { body: { id:  mongoose.Types.ObjectId() }, params: { ChatId: mongoose.Types.ObjectId()} };
        const findActiveByUserIdSub = sinon.stub(chatsService, "findActiveByUserId").returns(new chatModel());
    
        await chatController.getActiveByAgentId(req, res);

        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(200);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0].message).to.equal("Chats found successfully!")

        findActiveByUserIdSub.restore();
      });
    });

    describe("getInactive", function() {

      let status, json, res;
      beforeEach(() => {
        status = sinon.stub();
        json = sinon.spy();
        res = { json, status };
        status.returns(res);
      });

      it("should not get chats when there is no inactive chats", async function() {
        const req = { body: { id: mongoose.Types.ObjectId() }, params: {} };
        const findInactiveByRepresentativeSub = sinon.stub(chatsService, "findInactiveByRepresentative").returns(null);
    
        await chatController.getInactive(req, res);

        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(404);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0].message).to.equal("Chats not found!")

        findInactiveByRepresentativeSub.restore();
      });

      it("should get chats when represntative param is null and inactive chats exist", async function() {
        const req = { body: { id:  mongoose.Types.ObjectId() }, params: { ChatId: mongoose.Types.ObjectId()} };
        const findInactiveByRepresentativeSub = sinon.stub(chatsService, "findInactiveByRepresentative").returns(new chatModel());
    
        await chatController.getInactive(req, res);

        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(200);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0].message).to.equal("Chats found successfully!")

        findInactiveByRepresentativeSub.restore();
      });
    });

    describe("getVisitorAgent", function() {

      let status, json, res;
      beforeEach(() => {
        status = sinon.stub();
        json = sinon.spy();
        res = { json, status };
        status.returns(res);
      });

      it("should not get active chat when there is no active chat with user id", async function() {
        const req = { body: { id: mongoose.Types.ObjectId() }, params: { VisitorId: mongoose.Types.ObjectId()} };
        const findActiveByVisitorIdSub = sinon.stub(chatsService, "findActiveByVisitorId").returns(null);
    
        await chatController.getVisitorAgent(req, res);

        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(200);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0].message).to.equal("Active chat not exist!")

        findActiveByVisitorIdSub.restore();
      });

      it("should get active chat when active chat with user id exist", async function() {
        const req = { body: { id:  mongoose.Types.ObjectId() }, params: { VisitorId: mongoose.Types.ObjectId()} };
        const findActiveByVisitorIdSub = sinon.stub(chatsService, "findActiveByVisitorId").returns(new chatModel());
    
        await chatController.getVisitorAgent(req, res);

        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(200);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0].message).to.equal("Chat found successfully!")

        findActiveByVisitorIdSub.restore();
      });
    });

    describe("delete", function() {

      let status, json, res;
      beforeEach(() => {
        status = sinon.stub();
        json = sinon.spy();
        res = { json, status };
        status.returns(res);
      });

      it("should delete chat when chat with provided chat id exist", async function() {
        const req = { body: { id:  mongoose.Types.ObjectId() }, params: { ChatId: mongoose.Types.ObjectId()} };
        const deleteSub = sinon.stub(chatsService, "delete").returns(new chatModel());
    
        await chatController.delete(req, res);

        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(200);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0].message).to.equal("Chat deleted successfully!")
        
        deleteSub.restore();
      });
    });

    describe("rating", function() {

      let status, json, res;
      beforeEach(() => {
        status = sinon.stub();
        json = sinon.spy();
        res = { json, status };
        status.returns(res);
      });

      it("should not update rating when there is no chat with provided chat id", async function() {
        const req = { body: { id: mongoose.Types.ObjectId() }, params: { ChatId: mongoose.Types.ObjectId()} };
        const findByIdSub = sinon.stub(chatsService, "findById").returns(null);
    
        await chatController.rating(req, res);

        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(404);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0].message).to.equal("Chat not found!")

        findByIdSub.restore();
      });

      it("should update rating when there is chat with provided chat id and rating param", async function() {
        const req = { body: { id:  mongoose.Types.ObjectId() }, params: { VisitorId: mongoose.Types.ObjectId(), rating: 5} };

        const findByIdSub = sinon.stub(chatsService, "findById").returns(new chatModel());
        const updateRatingSub = sinon.stub(chatsService, "updateRating").returns(new chatModel());
    
        await chatController.rating(req, res);

        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(200);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0].message).to.equal("Chat updated successfully!")

        findByIdSub.restore();
        updateRatingSub.restore();
      });
    });
  });
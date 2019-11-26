var expect = require('chai').expect;
const sinon = require('sinon');
const sinonTest = require('sinon-test')(sinon);
var userController = require('./users');
var usersService = require('../../buisnessLogic/services/users');
const userModel = require('../../database/models/users');
var activityService = require('../../buisnessLogic/services/activity');
const activityModel = require('../../database/models/activities');
const faker = require("faker");
var mongoose = require('mongoose');

describe("UserController", function() {
    describe("register", function() {

      let status, json, res;
      beforeEach(() => {
        status = sinon.stub();
        json = sinon.spy();
        res = { json, status };
        status.returns(res);
      });

      it("should not register a user when email param is not provided", async function() {
        const req = { body: { firstname: faker.name.findName(), 
                lastname: faker.name.lastName(), password: faker.internet.password() } };
        const userValidateSub = sinon.stub(usersService, "userValidate").returns({error: true});
    
        await userController.create(req, res);

        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(400);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0].message).to.equal("Invalid data!")

        userValidateSub.restore();
      });

      it("should not register a user when email param is not unique", async function() {
        const req = { body: { firstname: faker.name.findName(), lastname: faker.name.lastName(), 
                email: faker.internet.email(), password: faker.internet.password() } };
        const userValidateSub = sinon.stub(usersService, "userValidate").returns({error: null});
        const findByEmailSub = sinon.stub(usersService, "findByEmail").returns(true);
    
        await userController.create(req, res);

        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(400);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0].message).to.equal("User exist!")

        userValidateSub.restore();
        findByEmailSub.restore();
      });
    });

    describe("login", function() {

      let status, json, res;
      beforeEach(() => {
        status = sinon.stub();
        json = sinon.spy();
        res = { json, status };
        status.returns(res);
      });

      it("should not login a user when password param is not provided", async function() {
        const req = { body: { email: faker.internet.email() } };
        const loginValidateSub = sinon.stub(usersService, "loginValidate").returns({error: true});
    
        await userController.login(req, res);

        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(400);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0].message).to.equal("Invalid data!")

        loginValidateSub.restore();
      });

      it("should not login a user when email not exist", async function() {
        const req = { body: { email: faker.internet.email(), password: faker.internet.password() } };
        const loginValidateSub = sinon.stub(usersService, "loginValidate").returns({error: null});
        const findByEmailSub = sinon.stub(usersService, "findByEmail").returns(false);
    
        await userController.login(req, res);

        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(404);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0].message).to.equal("Invalid mail!")

        loginValidateSub.restore();
        findByEmailSub.restore();
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

      it("should get by id a user when agent id param is not provided", async function() {
        const req = { body: { id:  mongoose.Types.ObjectId() }, params: {} };
        const getByIdSub = sinon.stub(usersService, "findById").returns(true);
    
        await userController.getById(req, res);

        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(200);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0].message).to.equal("User found successfully!")

        getByIdSub.restore();
      });
    });

    describe("updateById", function() {

      let status, json, res;
      beforeEach(() => {
        status = sinon.stub();
        json = sinon.spy();
        res = { json, status };
        status.returns(res);
      });

      it("should not update by id a user when email param is not email pattern", async function() {
        const req = { body: { firstname: faker.name.findName(), email: "",
                lastname: faker.name.lastName(), password: faker.internet.password() } };
        const userValidateSub = sinon.stub(usersService, "updateUserValidate").returns({error: true});
    
        await userController.updateById(req, res);

        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(400);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0].message).to.equal("Invalid data!")

        userValidateSub.restore();
      });

      it("should not update by id a user when user can not be found", async function() {
        const req = { body: { firstname: faker.name.findName(), lastname: faker.name.lastName(), 
                email: faker.internet.email(), password: faker.internet.password(),
                id:  mongoose.Types.ObjectId() }, params: {}  };
        const userValidateSub = sinon.stub(usersService, "updateUserValidate").returns({error: null});
        const findUserSub = sinon.stub(usersService, "findUser").returns(false);
    
        await userController.updateById(req, res);

        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(404);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0].message).to.equal("User can not be found!")

        userValidateSub.restore();
        findUserSub.restore();
      });
    });

    describe("updateActivity", function() {

      let status, json, res;
      beforeEach(() => {
        status = sinon.stub();
        json = sinon.spy();
        res = { json, status };
        status.returns(res);
      });

      it("should not update activity by user id when user can not be found", async function() {
        const req = { body: {}, params: {}  };

        const findByIdSub = sinon.stub(usersService, "findById").returns(null);
        await userController.updateActivity(req, res);

        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(404);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0].message).to.equal("User can not be found!")

        findByIdSub.restore();
      });

      it("should update activity by user id when user can be found", async function() {
        const req = { body: { id: mongoose.Types.ObjectId() }, params: {}  };
        var user = new userModel();

        const findByIdSub = sinon.stub(usersService, "findById").returns(user);
        const createSub = sinon.stub(activityService, "create").returns(new activityModel());
        const updateSub = sinon.stub(activityService, "update").returns(new activityModel());
        const updateActivitySub = sinon.stub(usersService, "updateActivity").returns(user);
    
        await userController.updateActivity(req, res);

        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(200);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0].message).to.equal("User updated successfully!")

        findByIdSub.restore();
        createSub.restore();
        updateSub.restore();
        updateActivitySub.restore();
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

      it("should not delete user when user can not be found", async function() {
        const req = { body: {}, params: {}  };

        const deleteSub = sinon.stub(usersService, "delete").returns(null);
        await userController.delete(req, res);

        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(401);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0].message).to.equal("User can not be deleted!")

        deleteSub.restore();
      });

      it("should delete user when user can be found", async function() {
        const req = { body: {}, params: {}  };
        var user = new userModel();

        const deleteSub = sinon.stub(usersService, "delete").returns(user);
        await userController.delete(req, res);

        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(200);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0].message).to.equal("User deleted successfully!")

        deleteSub.restore();
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

      it("should find all users by representative when user is representative", async function() {
        const req = { body: { id: mongoose.Types.ObjectId() }, params: {}  };

        const findAllByRepresentativeSub = sinon.stub(usersService, "findAllByRepresentative").returns([new userModel()]);
        await userController.getAll(req, res);

        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(200);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0].message).to.equal("Users found successfully!")

        findAllByRepresentativeSub.restore();
      });
    });

    describe("getWorkingUsers", function() {

      let status, json, res;
      beforeEach(() => {
        status = sinon.stub();
        json = sinon.spy();
        res = { json, status };
        status.returns(res);
      });

      it("should find all active and working users by representative", async function() {
        const req = { body: { representative: mongoose.Types.ObjectId() }, params: {}  };

        const findActiveUsersByRepresentativeSub = sinon.stub(usersService, "findActiveUsersByRepresentative").returns([new userModel()]);
        await userController.getWorkingUsers(req, res);

        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(200);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0].message).to.equal("Users found successfully!")

        findActiveUsersByRepresentativeSub.restore();
      });
    });

    describe("getRandomWorkingUser", function() {

      let status, json, res;
      beforeEach(() => {
        status = sinon.stub();
        json = sinon.spy();
        res = { json, status };
        status.returns(res);
      });

      it("should find random active and working users by representative", async function() {
        const req = { body: { representative: mongoose.Types.ObjectId() }, params: {}  };

        const findRandomWorkingUserByRepresentativeSub = sinon.stub(usersService, "findRandomWorkingUserByRepresentative").returns(new userModel());
        await userController.getRandomWorkingUser(req, res);

        expect(status.calledOnce).to.be.true;
        expect(status.args[0][0]).to.equal(200);
        expect(json.calledOnce).to.be.true;
        expect(json.args[0][0].message).to.equal("User found successfully!")

        findRandomWorkingUserByRepresentativeSub.restore();
      });
    });
  });
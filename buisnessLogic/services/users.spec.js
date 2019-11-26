var expect = require('chai').expect;
const sinon = require('sinon');
const sinonTest = require('sinon-test')(sinon);
const sinonMongoose = require('sinon-mongoose')
var usersService = require('./users');
var usersModel = require('../../database/models/users');
var mongoose = require('mongoose');
const faker = require("faker");
 
describe('usersService', function() {
    sinon.stub(usersModel.prototype, 'save')
    var m = new usersModel({ 
        firstname: faker.name.findName(), 
        lastname: faker.name.lastName(), 
        email: faker.internet.email(),
        password: faker.internet.password(),
        representative: mongoose.Types.ObjectId()
    });

    it('should create user with same data', sinonTest(async function() {
        let createSpy = sinon.spy(usersService, 'create');
        sinon
            .mock(usersModel)
            .expects('create')
            .withArgs({ 
                firstname: m.firstname, 
                lastname: m.lastname, 
                email: m.email,
                password: m.password,
                representative: m.representative 
            })
            .resolves(m)
        const user = await usersService.create(m.firstname, m.lastname, m.email, m.password, m.representative );
        sinon.assert.calledOnce(createSpy);
        createSpy.restore();
        usersModel.create.restore();
    }));

    it('should check for user with same email', sinonTest(async function() {
        let findByEmailSpy = sinon.spy(usersService, 'findByEmail');
        sinon
            .mock(usersModel)
            .expects('findOne')
            .withArgs({ email: m.email })
            .resolves(m)
        const user = await usersService.findByEmail(m.email);
        sinon.assert.calledOnce(findByEmailSpy);
        findByEmailSpy.restore();
        usersModel.findOne.restore();
    }));

    it('should check for user with same id', sinonTest(async function() {
        let findByIdSpy = sinon.spy(usersService, 'findById');
        sinon
            .mock(usersModel)
            .expects('findById')
            .withArgs(m._id)
            .chain('select')
            .withArgs('-password')
            .resolves(m)
        const user = await usersService.findById(m._id);
        sinon.assert.calledOnce(findByIdSpy);
        findByIdSpy.restore();
        usersModel.findById.restore();
    }));

    it('should check for user activity with same user id', sinonTest(async function() {
        let findActivityByIdSpy = sinon.spy(usersService, 'findActivityById');
        sinon
            .mock(usersModel)
            .expects('findById')
            .chain('select')
            .withArgs('_id firstname lastname email')
            .resolves(m)
        const user = await usersService.findActivityById(m._id);
        sinon.assert.calledOnce(findActivityByIdSpy);
        findActivityByIdSpy.restore();
        usersModel.findById.restore();
    }));

    it('should check for user work hours with same user id', sinonTest(async function() {
        let findWorkHoursByIdSpy = sinon.spy(usersService, 'findWorkHoursById');
        sinon
            .mock(usersModel)
            .expects('findById')
            .chain('select')
            .withArgs('_id firstname lastname email')
            .resolves(m)
        const user = await usersService.findWorkHoursById(m._id);
        sinon.assert.calledOnce(findWorkHoursByIdSpy);
        findWorkHoursByIdSpy.restore();
        usersModel.findById.restore();
    }));

    it('should find user with same id', sinonTest(async function() {
        let findUserSpy = sinon.spy(usersService, 'findUser');
        sinon
            .mock(usersModel)
            .expects('findById')
            .withArgs(m._id)
            .resolves(m)
        const user = await usersService.findUser(m._id);
        sinon.assert.calledOnce(findUserSpy);
        findUserSpy.restore();
        usersModel.findById.restore();
    }));

    it('should update user with same data', sinonTest(async function() {
        let updateUserSpy = sinon.spy(usersService, 'updateUser');
        const user = await usersService.updateUser(m, m.firstname, m.lastname, m.email, m.password);
        sinon.assert.calledOnce(updateUserSpy);
        updateUserSpy.restore();
    }));

    it('should update user activity with same data', sinonTest(async function() {
        let updateActivitySpy = sinon.spy(usersService, 'updateActivity');
        const user = await usersService.updateActivity(m);
        sinon.assert.calledOnce(updateActivitySpy);
        updateActivitySpy.restore();
    }));

    it('should delete user with same id', sinonTest(async function() {
        let deleteSpy = sinon.spy(usersService, 'delete');
        sinon
            .mock(usersModel)
            .expects('deleteOne')
            .resolves(m)
        const user = await usersService.delete(m._id);
        sinon.assert.calledOnce(deleteSpy);
        deleteSpy.restore();
        usersModel.deleteOne.restore();
    }));

    it('should check for all users with same id or representative', sinonTest(async function() {
        let findAllByRepresentativeSpy = sinon.spy(usersService, 'findAllByRepresentative');
        sinon
            .mock(usersModel)
            .expects('find')
            .chain('select')
            .withArgs('-password')
            .resolves([m])
        const user = await usersService.findAllByRepresentative(m._id);
        sinon.assert.calledOnce(findAllByRepresentativeSpy);
        findAllByRepresentativeSpy.restore();
        usersModel.find.restore();
    }));

    it('should be valid if validate user', function(done) {
        const newUser = {
            firstname: 'Przypadek',
            lastname: 'Testowy',
            email: 'test@mail.com',
            password: '1Testtest'
        }
        const val = usersService.userValidate(newUser);
        expect(val.error).to.be.null;
        done();
    });

    it('should be valid if validate update user', function(done) {
        const updateUser = {
            firstname: 'Przypadek'
        }
        const val = usersService.updateUserValidate(updateUser);
        expect(val.error).to.be.null;
        done();
    });

    it('should be valid if validate login user', function(done) {
        const loginUser = {
            email: 'test@mail.com',
            password: '1Testtest'
        }
        const val = usersService.loginValidate(loginUser);
        expect(val.error).to.be.null;
        done();
    });
});
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

    it('should create user with some data', sinonTest(async function() {
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
        usersModel.create.restore();
    }));

    it('should check for user with some email', sinonTest(async function() {
        sinon
            .mock(usersModel)
            .expects('findOne')
            .withArgs({ email: m.email })
            .resolves(m)
        const user = await usersService.findByEmail(m.email);
        usersModel.findOne.restore();
    }));

    it('should check for user with some id', sinonTest(async function() {
        sinon
            .mock(usersModel)
            .expects('findById')
            .withArgs(m._id)
            .chain('select')
            .withArgs('-password')
            .resolves(m)
        const user = await usersService.findById(m._id);
        usersModel.findById.restore();
    }));

    it('should check for user activity with some user id', sinonTest(async function() {
        sinon
            .mock(usersModel)
            .expects('findById')
            .chain('select')
            .withArgs('_id firstname lastname email')
            .resolves(m)
        const user = await usersService.findActivityById(m._id);
        usersModel.findById.restore();
    }));

    it('should check for user work hours with some user id', sinonTest(async function() {
        sinon
            .mock(usersModel)
            .expects('findById')
            .chain('select')
            .withArgs('_id firstname lastname email')
            .resolves(m)
        const user = await usersService.findWorkHoursById(m._id);
        usersModel.findById.restore();
    }));

    it('should find user with some id', sinonTest(async function() {
        sinon
            .mock(usersModel)
            .expects('findById')
            .withArgs(m._id)
            .resolves(m)
        const user = await usersService.findUser(m._id);
        usersModel.findById.restore();
    }));

    it('should update user with some data', sinonTest(async function() {
        let updateUserSpy = sinon.spy(usersService, 'updateUser');
        const user = await usersService.updateUser(m, m.firstname, m.lastname, m.email, m.password);
        sinon.assert.calledOnce(updateUserSpy);
        updateUserSpy.restore();
    }));

    it('should update user activity with some data', sinonTest(async function() {
        let updateActivitySpy = sinon.spy(usersService, 'updateActivity');
        const user = await usersService.updateActivity(m);
        sinon.assert.calledOnce(updateActivitySpy);
        updateActivitySpy.restore();
    }));

    it('should delete user with some id', sinonTest(async function() {
        sinon
            .mock(usersModel)
            .expects('deleteOne')
            .resolves(m)
        const user = await usersService.delete(m._id);
        usersModel.deleteOne.restore();
    }));

    it('should check for all users with some id or representative', sinonTest(async function() {
        sinon
            .mock(usersModel)
            .expects('find')
            .chain('select')
            .withArgs('-password')
            .resolves([m])
        const user = await usersService.findAllByRepresentative(m._id);
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
var expect = require('chai').expect;
const sinon = require('sinon');
const sinonTest = require('sinon-test')(sinon);
const sinonMongoose = require('sinon-mongoose')
var messagesService = require('./messages');
var messagesModel = require('../../database/models/messages');
var mongoose = require('mongoose');
const faker = require("faker");
 
describe('messagesService', function() {
    sinon.stub(messagesModel.prototype, 'save')
    var sender = ['visitor', 'agent']

    var m = new messagesModel({ 
        chat: mongoose.Types.ObjectId(),
        content: faker.lorem.text(),
        sender: sender[Math.floor(Math.random() * sender.length)],
    });

    it('should create message with some data', sinonTest(async function() {
        sinon
            .mock(messagesModel)
            .expects('create')
            .withArgs({ 
                chat: m.chat,
                content: m.content,
                sender: m.sender
            })
            .resolves(m)
            
        const message = await messagesService.create(m.chat, m.content, m.sender);
        messagesModel.create.restore();
    }));

    it('should be valid if validate message', function(done) {
        var message = {
            content: m.content,
            sender: m.sender,
        }
        const val = messagesService.messageValidate(message);
        expect(val.error).to.be.null;
        done();
    });
});


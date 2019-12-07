var expect = require('chai').expect;
const sinon = require('sinon');
const sinonTest = require('sinon-test')(sinon);
const sinonMongoose = require('sinon-mongoose')
var chatsService = require('./chats');
var chatsModel = require('../../database/models/chats');
var mongoose = require('mongoose');
 
describe('chatsService', function() {
    sinon.stub(chatsModel.prototype, 'save')

    var m = new chatsModel({ 
        visitor: mongoose.Types.ObjectId(),
        agent: mongoose.Types.ObjectId()
    });

    it('should create chat with some data', sinonTest(async function() {
        sinon
            .mock(chatsModel)
            .expects('create')
            .withArgs({ 
                visitor: m.visitor,
                agent: m.agent
            })
            .resolves(m)
        const chat = await chatsService.create(m.visitor, m.agent);
        chatsModel.create.restore();
    }));

    it('should check for active chat with some user id', sinonTest(async function() {
        sinon
            .mock(chatsModel)
            .expects('find')
            .withArgs({ agent: m.agent, isActive: true })
            .chain('populate')
            .withArgs('agent')
            .chain('populate')
            .withArgs('visitor')
            .chain('populate')
            .withArgs({ 
                path: 'messages', 
                options: { 
                    sort: { date: -1 } 
                } 
            })
            .resolves(m)
        const chat = await chatsService.findActiveByUserId(m.agent);
        chatsModel.find.restore();
    }));

    it('should check for inactive chat with some representative id', sinonTest(async function() {
        sinon
            .mock(chatsModel)
            .expects('find')
            .withArgs({ isActive: false })
            .chain('populate')
            .chain('populate')
            .withArgs('visitor')
            .chain('populate')
            .withArgs({ 
                path: 'messages', 
                options: { 
                    sort: { date: -1 } 
                } 
            })
            .chain('sort')
            .withArgs({date: 1})
            .resolves(m)
        const chat = await chatsService.findInactiveByRepresentative(m.agent);
        chatsModel.find.restore();
    }));

    it('should check for active chat with some visitor id', sinonTest(async function() {
        sinon
            .mock(chatsModel)
            .expects('find')
            .resolves(false)
        sinon
            .mock(chatsModel)
            .expects('findOne')
            .withArgs({ visitor: m.visitor, isActive: true })
            .chain('populate')
            .withArgs({
                path: 'agent',
                select: '_id firstname lastname email'
            })
            .chain('populate')
            .withArgs('visitor')
            .chain('populate')
            .withArgs({ 
                path: 'messages', 
                options: { 
                    sort: { date: -1 } 
                } 
            })
            .resolves(m)
        const chat = await chatsService.findActiveByVisitorId(m.visitor);
        chatsModel.findOne.restore();
    }));

    it('should check for chat with some id', sinonTest(async function() {
        sinon
            .mock(chatsModel)
            .expects('findById')
            .withArgs(m._id)
            .chain('populate')
            .chain('populate')
            .chain('populate')
            .resolves(m)
        const chat = await chatsService.findById(m._id);
        chatsModel.findById.restore();
    }));

    it('should update rating by some chat id', sinonTest(async function() {
        let updateRatingSpy = sinon.spy(chatsService, 'updateRating');
        const chat = await chatsService.updateRating(m, 5);
        sinon.assert.calledOnce(updateRatingSpy);
        updateRatingSpy.restore();
    }));

    it('should delete chat with some id', sinonTest(async function() {
        sinon
            .mock(chatsModel)
            .expects('deleteOne')
            .resolves(m)
        const user = await chatsService.delete(m._id);
        chatsModel.deleteOne.restore();
    }));

    it('should be valid if validate chat', function(done) {
        var chat = {
            visitor: m.visitor,
            agent: m.agent,
        }
        const val = chatsService.chatValidate(chat);
        expect(val.error).to.be.null;
        done();
    });

    it('should be valid if validate chat rating', function(done) {
        var rating = {
            rating: 5
        }
        const val = chatsService.ratingValidate(rating);
        expect(val.error).to.be.null;
        done();
    });
});


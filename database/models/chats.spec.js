var expect = require('chai').expect;
var chatsModel = require('./chats');
 
describe('chatsModel', function() {
    var m = new chatsModel();

    it('should be invalid if visitor is empty', function(done) {
        m.validate(function(err) {
            expect(err.errors.visitor).to.exist;
            done();
        });
    });

    it('should be invalid if agent is empty', function(done) {
        m.validate(function(err) {
            expect(err.errors.agent).to.exist;
            done();
        });
    });

    it('should be default value of null for rating', function(done) {
        expect(m.rating).to.equal(null);
        done();
    });

    it('should not be value of null for inTime', function(done) {
        expect(m.inTime).to.not.be.null;
        done();
    });

    it('should be default value of true for isActive', function(done) {
        expect(m.isActive).to.be.true;
        done();
    });

    it('should be empty array od messanges', function(done) {
        expect(m.messages).to.be.an('array').that.is.empty;
        done();
    });
});
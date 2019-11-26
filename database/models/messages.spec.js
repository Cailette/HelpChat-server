var expect = require('chai').expect;
var messagesModel = require('./messages');
 
describe('messagesModel', function() {
    var m = new messagesModel();

    it('should be invalid if chat is empty', function(done) {
        m.validate(function(err) {
            expect(err.errors.chat).to.exist;
            done();
        });
    });

    it('should be invalid if sender is empty', function(done) {
        m.validate(function(err) {
            expect(err.errors.sender).to.exist;
            done();
        });
    });

    it('should be invalid if content is empty', function(done) {
        m.validate(function(err) {
            expect(err.errors.content).to.exist;
            done();
        });
    });
});
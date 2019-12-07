var expect = require('chai').expect;
var visitorsModel = require('./visitors');
 
describe('visitorsModel', function() {
    var m = new visitorsModel();

    it('should be invalid if representative is empty', function(done) {
        m.validate(function(err) {
            expect(err.errors.representative).to.exist;
            done();
        });
    });

    it('should be default value of true for isActive', function(done) {
        expect(m.isActive).to.be.true;
        done();
    });

    it('should be default value of \'Brak danych\' for operatingSoftware', function(done) {
        expect(m.operatingSoftware).to.be.equal('Brak danych');
        done();
    });

    it('should be default value of \'Brak danych\' for browserSoftware', function(done) {
        expect(m.browserSoftware).to.be.equal('Brak danych');
        done();
    });

    it('should be empty array of chats', function(done) {
        expect(m.chats).to.be.an('array').that.is.empty;
        done();
    });
});
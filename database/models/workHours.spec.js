var expect = require('chai').expect;
var workHoursModel = require('./workHours');
 
describe('workHoursModel', function() {
    var m = new workHoursModel();

    it('should be invalid if agent is empty', function(done) {
        m.validate(function(err) {
            expect(err.errors.agent).to.exist;
            done();
        });
    });

    it('should be invalid if hourFrom is empty', function(done) {
        m.validate(function(err) {
            expect(err.errors.hourFrom).to.exist;
            done();
        });
    });

    it('should be invalid if hourTo is empty', function(done) {
        m.validate(function(err) {
            expect(err.errors.hourTo).to.exist;
            done();
        });
    });

    it('should be invalid if dayOfWeek is empty', function(done) {
        m.validate(function(err) {
            expect(err.errors.dayOfWeek).to.exist;
            done();
        });
    });

    it('should be default value of null for dayFrom', function(done) {
        expect(m.dayFrom).to.be.a('date').that.is.not.null;
        done();
    });

    it('should be default value of null for dayTo', function(done) {
        expect(m.dayTo).to.equal(null);
        done();
    });
});
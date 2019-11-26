var expect = require('chai').expect;
var activitiesModel = require('./activities');
 
describe('activitiesModel', function() {
    var m = new activitiesModel();

    it('should be invalid if from is empty', function(done) {
        m.validate(function(err) {
            expect(err.errors.from).to.exist;
            done();
        });
    });

    it('should be invalid if agent is empty', function(done) {
        m.validate(function(err) {
            expect(err.errors.agent).to.exist;
            done();
        });
    });

    it('should be default value of null for to', function(done) {
        expect(m.to).to.equal(null);
        done();
    });

    it('should be default value of true for inTime', function(done) {
        expect(m.inTime).to.equal(true);
        done();
    });
});
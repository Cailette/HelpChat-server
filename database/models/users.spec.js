var expect = require('chai').expect;
var usersModel = require('./users');
 
describe('usersModel', function() {
    var m = new usersModel();
    
    it('should be invalid if firstname is empty', function(done) {
        m.validate(function(err) {
            expect(err.errors.firstname).to.exist;
            done();
        });
    });

    it('should be invalid if lastname is empty', function(done) {
        m.validate(function(err) {
            expect(err.errors.lastname).to.exist;
            done();
        });
    });

    it('should be invalid if email is empty', function(done) {
        m.validate(function(err) {
            expect(err.errors.email).to.exist;
            done();
        });
    });

    it('should be invalid if password is empty', function(done) {
        m.validate(function(err) {
            expect(err.errors.password).to.exist;
            done();
        });
    });

    it('should be default value of false for isActive', function(done) {
        expect(m.isActive).to.be.false;
        done();
    });

    it('should be default value of null for representative', function(done) {
        expect(m.representative).to.be.null;
        done();
    });

    it('should be empty array od chats', function(done) {
        expect(m.chats).to.be.an('array').that.is.empty;
        done();
    });

    it('should be empty array od activities', function(done) {
        expect(m.activities).to.be.an('array').that.is.empty;
        done();
    });

    it('should be empty array od workHours', function(done) {
        expect(m.workHours).to.be.an('array').that.is.empty;
        done();
    });
});
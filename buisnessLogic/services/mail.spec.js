var expect = require('chai').expect;
const sinon = require('sinon');
const sinonTest = require('sinon-test')(sinon);
var mailService = require('./mail');
const faker = require("faker");
 
describe('mailService', function() {
    var m = {
        sender: faker.internet.email(),
        subject: faker.lorem.sentence(),
        text: faker.lorem.text(),
    };

    it('should be valid if validate mail', function(done) {
        const val = mailService.mailValidate(m);
        expect(val.error).to.be.null;
        done();
    });
});


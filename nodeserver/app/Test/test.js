// test/test.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // Replace with the path to your main app file

chai.use(chaiHttp);
const expect = chai.expect;

describe('/GET book/getall', () => {
    it('it should get all books', (done) => {
      chai
        .request(app)
        .get('/book/getall')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          done();
        });
    }).timeout(5000);
  });

  // Add more tests for other endpoints and functionalities


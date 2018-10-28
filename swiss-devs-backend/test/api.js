let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();


chai.use(chaiHttp);

const { expect } = chai;


// Tests the interaction with a local API for basics functions
// Make sur to run your local server and adapt the API_ROOT_ENDPOINT
describe('ApiUsers', function() {
    this.timeout(50000);

    let API_ROOT_ENDPOINT = "http://localhost:3000"

    describe('/GET Users count per canton', () => {
        it('it should GET number of users per canton - /users/canton/count', (done) => {
          chai.request(server)
              .get('/users/canton/count')
              .end((err, res) => {
                    let vaudNbUsers = res.body['ch-vd']
                    expect(vaudNbUsers).to.be.above(10);
                    done();
              });
        });
    });

    describe('/GET Users for the canton Vaud', () => {
        it('it should GET users of Canton Vaud - /users/canton/Vaud', (done) => {
          chai.request(server)
              .get('/users/canton/Vaud')
              .end((err, res) => {
                    let users = res.body;
                    console.log(users);
                    expect(users.length).to.be.above(10);
                    expect(users[0].canton).to.be.equal("Vaud");
                    done();
              });
        });
    });


    describe('/GET Users for the canton Vaud with languages JavaScript', () => {
        it('it should GET users from Vaud with Javascript as languages - /users/canton/Vaud/language/JavaScript', (done) => {
          chai.request(server)
              .get('/users/canton/Vaud/language/JavaScript')
              .end((err, res) => {
                    let users = res.body;
                    console.log(users);
                    expect(users.length).to.be.above(1);
                    expect(users[0].languages).to.include("JavaScript");
                    done();
              });
        });
    });

    
});
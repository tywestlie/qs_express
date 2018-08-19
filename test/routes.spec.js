const chai = require('chai');
const should = chai.should();
const expect = chai.expect
const chaiHttp = require('chai-http');
const server = require('../server');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);


chai.use(chaiHttp);

describe('Client Routes', () => {

});

describe('API Routes', () => {
  before((done) => {
    database.migrate.latest()
      .then(() => done())
      .catch(error => {
        throw error;
      });
  });

  beforeEach((done) => {
    database.seed.run()
      .then(() => done())
      .catch(error => {
        throw error;
      });
  });

  describe('GET /api/v1/foods', () => {
   it('returns all of the foods', done => {
      chai.request(server)
        .get('/api/v1/foods')
        .end((err, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(4);
          response.body[0].should.have.property('name');
          response.body[0].name.should.equal('Slim Jim');
          response.body[0].should.have.property('calories');
          response.body[0].calories.should.equal(500);
          done();
        });
      });
    });

    describe('GET /api/v1/foods/1', () => {
      it('responds with one food', (done) => {
        chai.request(server)
        .get('/api/v1/foods/1')
        .end((err, response) => {
          expect(response).to.have.status(200);
          expect(response).to.be.json;
          expect(response.body[0]).to.have.property('name')
          expect(response.body[0]).to.have.property('calories')
          expect(response.body[0].name).to.equal('Slim Jim')
          expect(response.body[0].calories).to.equal(500)
          });
        done();
      });
    });

    describe('POST /api/v1/foods', () => {
      it('creates a new food', done => {
        chai.request(server)
            .post('/api/v1/foods')
            .send({ "food": {
              "name": "Spaghett",
              "calories": 500
            }
            })
            .end((err, response) => {
            response.should.have.status(201);
            done();
          });
        });
      });

    describe('PATCH /api/v1/foods/:id', () => {
      it('updates a food', done => {
        chai.request(server)
          .patch('/api/v1/foods/1')
          .send({
            "food": {
                      "name": "Magic Pizza",
                      "calories": 50
                    }
          })
          .end((err, response) =>{
          response.should.have.status(201);
          expect(response.res.text).to.equal('{"name":"Magic Pizza","calories":50}')
          done();
        });
      });
    });

    describe('DELETE /api/v1/foods', () => {
      it('deletes a food', done => {
        chai.request(server)
          .delete('/api/v1/foods/1')
          .end((err, response) => {
            response.should.have.status(204);
            done();
          });
      });
    });
});

const chai = require('chai');
const should = chai.should();
const expect = chai.expect
const chaiHttp = require('chai-http');
const server = require('../server');
const util = require('util')

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
          response.body.length.should.equal(5);
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
            expect(response.body.name).to.eq('Spaghett')
            expect(response.body.calories).to.eq(500)
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
          .delete('/api/v1/foods/5')
          .end((err, response) => {
            response.should.have.status(204);
            done();
          });
      });
    });

    describe('GET /api/v1/meals', () => {
      it('queries all meals', done => {
        chai.request(server)
          .get('/api/v1/meals')
          .end((err, response) => {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a('array');
            response.body.length.should.equal(4);
            response.body[0].should.have.property('name');
            response.body[0].name.should.equal('Breakfast');
            done();
          });
      })
    })

    describe('GET /api/v1/meals/:id/foods', () => {
      it('queries a single meal and its food', done => {
        chai.request(server)
          .get('/api/v1/meals/1/foods')
          .end((err, response) => {
            response.should.have.status(200);
            response.should.be.json;
            response.body.should.be.a('array');
            response.body[0].should.have.property('name');
            response.body[0].name.should.equal('Breakfast');
            response.body[0].foods[0].name.should.equal('Slim Jim');
            response.body[0].foods[0].calories.should.equal(500);
            done();
          });
      })
    })

    describe('POST /api/v1/meals/:meal_id/foods/:id', () => {
      it('adds a food to a meal', done => {
        chai.request(server)
          .post('/api/v1/meals/1/foods/5')
          .end((err, response) => {
          response.should.have.status(201);
          done();
        })
      })
    })

    describe('DELETE /api/v1/meals/:meal_id/foods/:id', () => {
      it('deletes a food from a meal', done => {
        chai.request(server)
          .delete('/api/v1/meals/1/foods/1')
          .end((err, response) => {
            response.should.have.status(204);
            done();
          });
      })
    })

    describe('GET /api/v1/favorite_foods', ()=> {
      it('responds with favorite foods and meal when eaten', done => {
        chai.request(server)
          .get('/api/v1/favorite_foods')
          .end((err, response) => {
            response.should.have.status(201);
            response.should.be.json;
            response.body[0].should.have.property('timeseaten');
            response.body[0].should.have.property('foods');
            response.body[0].foods[0].should.have.property('mealsWhenEaten');
            response.body[0].foods[0].mealsWhenEaten.should.be.a('array');
          });
          done();
      })
    })

    describe('GET /api/v1/foods/:id/recipes', ()=> {
      it('responds with recipes based on the food name', done => {
        chai.request(server)
          .get('/api/v1/foods/1/recipes')
          .end((err, response) => {
            response.should.have.status(201);
            response.should.be.json;
            response.body[0].foods.should.have.property('recipes');
            response.body[0].foods.recipes.should.be.a('array');
            response.body[0].foods.recipes.should.have.property('name')
            response.body[0].foods.recipes.should.have.property('url')
          });
          done();
        })
      })
});

const request = require('supertest');
const  app  = require("../app");
const userToken = require("./helpers/helpers");

describe('Categories tests', () => {

  it('Should return all the categories', (done) => {
    request(app)
      .get('/api/v1/categories')
      .set('Origin', 'http://localhost:8000')
      .set('Authorization', 'bearer ' + userToken)
      .then((response) => {
        expect(response.body.message).toMatch('Categories retrieved successfully');
        expect(response.body.data.categories.length).toBeGreaterThan(0);
        done();
      });
  });
});

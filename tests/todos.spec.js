const request = require('supertest');
const  app  = require("../app");
const userToken = require("./helpers/helpers");

describe('Todos tests', () => {

  it('Should return all the todos in a particular category', (done) => {
    request(app)
      .get('/api/v1/categories/1/todos')
      .set('Origin', 'http://localhost:8000')
      .set('Authorization', 'bearer ' + userToken)
      .then((response) => {
        expect(response.body.message).toMatch('Todos retrieved successfully');
        expect(response.body.data.todos.length).toBeGreaterThan(0);
        done();
      });
  });
});

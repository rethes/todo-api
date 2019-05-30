const request = require('supertest');
const  app  = require("../app");
const userToken = require("./helpers/helpers");

describe('Users tests ', () => {

  it('Should return all the users ', (done) => {
    request(app)
      .get('/api/v1/users')
      .set('Origin', 'http://localhost:8000')
      .set('Authorization', 'bearer ' + userToken)
      .then((response) => {
        expect(response.body.message).toMatch('Users fetched successfully');
        expect(response.body.users.length).toBeGreaterThan(0);
        done();
      });
  });
});

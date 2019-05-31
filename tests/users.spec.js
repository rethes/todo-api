const request = require('supertest');
const app = require("../app");
const userToken = require("./helpers/helpers");

const create = (url, body) => {
  return request(app).post(url).send(body)
    .set('Accept', 'application/json')
    .set('Origin', 'http://localhost:8000');
};

const user = {
  "email": "bricer.twentyone@gmail.com",
  "password": "123456",
};

const duplicateUser = {
  "email": "mercy.more@gmail.com",
  "password": "123456",
};

describe('Users tests ', () => {

  it('Should register a new user', (done) => {
    create('/api/v1/users', user).then((response) => {
      expect(response.body).toHaveProperty('userToken');
      expect(response.body.message).toMatch('User successfully created');
      done();
    });
  });

  it('Should not create duplicate users.', (done) => {
    create('/api/v1/users', duplicateUser).then((response) => {
      expect(response.body.message).toMatch('A user with that email exist already');
      done();
    });
  });

  it('Should login an existing user', (done) => {
    request(app)
      .post('/api/v1/users/login')
      .send({
        "email": "bricer.twentyone@gmail.com",
        "password": "123456",
      })
      .set('Accept', 'application/json')
      .set('Origin', 'http://localhost:8000')
      .then((response) => {
        expect(response.body).toHaveProperty('userToken');
        expect(response.body.message).toMatch('You were successfully logged in');
        done();
      });
  });

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

  it('Should return a single user ', (done) => {
    request(app)
      .get('/api/v1/users/cjw9cen7d00004uvf70x7hhbv')
      .set('Origin', 'http://localhost:8000')
      .set('Authorization', 'bearer ' + userToken)
      .then((response) => {
        expect(response.body.message).toMatch('User retrieved successfully');
        expect(response.body.status).toMatch('success');
        done();
      });
  });

  it('Should get users in a paginated form', (done) => {
    request(app)
      .get('/api/v1/users/page/1')
      .set('Origin', 'http://localhost:8000')
      .set('Authorization', 'bearer ' + userToken)
      .then((response) => {
        expect(response.body.meta).toHaveProperty('firstPage');
        done();
      });
  });
});

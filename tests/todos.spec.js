const request = require('supertest');
const app = require("../app");
const userToken = require("./helpers/helpers");

const create = (url, body) => {
  return request(app).post(url).send(body)
    .set('Accept', 'application/json')
    .set('Authorization', 'bearer ' + userToken)
    .set('Origin', 'http://localhost:8000');
};

const todo = {
  "description": "Hello concert at 8:30 AM"
};

const duplicateTodo = {
  "id": "cjfkubrlv0001tgxs3mrf",
  "description": "Meeting at Brunch",
};

describe('Todos tests', () => {

  it('Should create a todo in a particular category.', (done) => {
    create('/api/v1/categories/1/todos', todo).then((response) => {
      expect(response.body.data.todo).toHaveProperty('id');
      expect(response.body.message).toMatch('The todo created successfully');
      done();
    });
  });

  it('Should not create duplicate todos.', (done) => {
    create('/api/v1/categories/2/todos', duplicateTodo).then((response) => {
      expect(response.body.message).toMatch('A todo with that description exist already');
      done();
    });
  });

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

  it('Should return a single todo ', (done) => {
    request(app)
      .get('/api/v1/todos/cjfkubrlv0001tgxs3mre')
      .set('Origin', 'http://localhost:8000')
      .set('Authorization', 'bearer ' + userToken)
      .then((response) => {
        expect(response.body.message).toMatch('Todo retrieved successfully');
        expect(response.body.status).toMatch('success');
        done();
      });
  });

  it('Should update a todo', (done) => {
    request(app)
      .put('/api/v1/todos/cjfkubrlv0001tgxs3mrj')
      .send({
        "description": "Having Dinner at 9 PM"
      })
      .set('Accept', 'application/json')
      .set('Authorization', 'bearer ' + userToken)
      .set('Origin', 'http://localhost:8000')
      .then((response) => {
        expect(response.body.message).toMatch('todo updated successfully');
        done();
      });
  });

  it('Should delete a todo', (done) => {
    request(app)
      .delete('/api/v1/todos/cjfkubrlv0001tgxs3mrg')
      .set('Accept', 'application/json')
      .set('Authorization', 'bearer ' + userToken)
      .set('Origin', 'http://localhost:8000')
      .then((response) => {
        expect(response.body.message).toMatch('Todo deleted successfully');
        done();
      });
  });

  it('Should get todos in a paginated form', (done) => {
      request(app)
        .get('/api/v1/categories/1/todos/1')
        .set('Origin', 'http://localhost:8000')
        .set('Authorization', 'bearer ' + userToken)
        .then((response) => {
          expect(response.body.meta).toHaveProperty('firstPage');
          done();
        });
    });
  });

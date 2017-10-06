const expect = require('expect');
const request = require('supertest');

const { app } = require('./../server2');
const { TodoModel } = require('./../models/todo');

describe('POST /todos', () => {
  it('should create a new todo', done => {
    var text = 'Test todo text';
    request(app)
      .post('/todos')
      .send({ text })
      .expect(200)
      .expect(() => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        TodoModel.find()
          .then(todos => {
            expect(todos.length).toBe(1);
            expect(todos[0].text).toBe(text);
            done();
          })
          .catch(e => {
            done(e);
          });
      });
  });
});

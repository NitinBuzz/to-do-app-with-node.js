var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');

var { mongoose } = require('./db/mongoose');
var { Schema } = require('./db/mongoose');
var { TodoModel } = require('./models/todo');
var { UserModel } = require('./models/user');
var { authenticate } = require('./middleware/authenticate');
//beforeEach(done => {
//  TodoModel.remove({}).then(() => done());
//});

var app = express();

app.use(bodyParser.json());

app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new UserModel(body);
  user
    .save()
    .then(() => {
      return user.generateAuthToken();
    })
    .then(token => {
      res.header('x-auth', token).send(user);
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(
    () => {
      var user = req.user;
      user
        .generateAuthToken()
        .then(token => {})
        .catch(e => {});

      res.status(200).send();
    },
    () => {
      res.status(400).send();
    }
  );
});

app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  UserModel.findByCredentials(body.email, body.password)
    .then(user => {
      res.send(user);
    })
    .catch(e => {
      res.status(401).send();
    });
});

app.post('/todos', authenticate, (req, res) => {
  var todo = new TodoModel({
    text: req.body.text,
    _creator: req.user._id
  });
  todo.save().then(
    doc => {
      res.status(400).send(doc);
    },
    error => {
      res.send(error);
    }
  );
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.get('/todos', authenticate, (req, res) => {
  TodoModel.find({
    _creator: req.user._id
  }).then(
    todos => {
      res.send({ todos });
    },
    error => {
      res.status(400).send(e);
    }
  );
});

app.listen(3000, () => {
  console.log(`Started on PORT 3000`);
});

module.exports = { app };

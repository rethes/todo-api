const express = require("express");
const passport = require('passport');
const router = express.Router();

const TodoController = require("../controllers/todos");
const UserController = require("../controllers/users");

require('../services/passport');

router.get('/api/v1/todos', TodoController.getAllTodos);

router.get('/api/v1/todos/:page', TodoController.getPaginatedTodos);

router.post('/api/v1/todos', passport.authenticate('jwt', {session: false}), TodoController.createTodo);

router.get('/api/v1/todos/:id', passport.authenticate('jwt', {session: false}), TodoController.getTodo);

router.delete('/api/v1/todos/:id', passport.authenticate('jwt', {session: false}), TodoController.deleteTodo);

router.put('/api/v1/todos/:id', passport.authenticate('jwt', {session: false}), TodoController.updateTodo);

router.post('/api/v1/users', UserController.createUser);

router.get('/api/v1/users', UserController.getUsers);

router.get('/api/v1/users/:page', UserController.getPaginatedUsers);

router.post('/api/v1/users/login', passport.authenticate('local', {session: false}), UserController.loginUser);

module.exports = router;

const express = require("express");
const passport = require('passport');
const router = express.Router();

const CategoriesController = require("../controllers/categories");
const TodoController = require("../controllers/todos");
const UserController = require("../controllers/users");

require('../services/passport');

// Categories
router.get('/api/v1/categories', CategoriesController.getAllCategories);

// Todos
router.post('/api/v1/categories/:id/todos', passport.authenticate('jwt', {session: false}), TodoController.createTodo);

router.get('/api/v1/categories/:id/todos', TodoController.getAllTodos);

router.get('/api/v1/todos/:id', passport.authenticate('jwt', {session: false}), TodoController.getTodo);

router.put('/api/v1/todos/:id', passport.authenticate('jwt', {session: false}), TodoController.updateTodo);

router.delete('/api/v1/todos/:id', passport.authenticate('jwt', {session: false}), TodoController.deleteTodo);

router.get('/api/v1/categories/:id/todos/:page', TodoController.getPaginatedTodos);

// Users
router.post('/api/v1/users', UserController.createUser);

router.get('/api/v1/users', UserController.getAllUsers);

router.get('/api/v1/users/:id', UserController.getUser);

router.get('/api/v1/users/:page', UserController.getPaginatedUsers);

router.put('/api/v1/users/:id', passport.authenticate('jwt', {session: false}), UserController.updateImage);

router.post('/api/v1/users/login', passport.authenticate('local', {session: false}), UserController.loginUser);

module.exports = router;

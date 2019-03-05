const express = require("express");
const router = express.Router();
const TodoController = require("../todosControllers/todos");

//get all todos
// makes a get request to the server
// route/endpoint provided as the first parameter
router.get('/api/v1/todos', TodoController.getAllTodos);

router.post('/api/v1/todos', TodoController.createTodo);

router.get('/api/v1/todos/:id', TodoController.getTodo);

router.delete('/api/v1/todos/:id', TodoController.deleteTodo);

router.put('/api/v1/todos/:id', TodoController.updateTodo);

module.exports = router ;

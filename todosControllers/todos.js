const models = require('../server/models');

module.exports = {

  /**
   * @function getAllTodos
   * @param {Object} req
   * @param {Object} res
   * @return Status Code & Object with array
   */
  getAllTodos(req, res) {
    // req object contains information about our request
    // response object contains information about the response and methods we can use to send information back to the client.
    models.Todo.findAll()
      .then(todos => res.status(200).send({
        // res.send() is used to send back a response to the client,
        success: 'true',
        message: 'todos retrieved successfully',
        todos,
      }));
  },

  /**
   * @function getTodo
   * @param {Object} req
   * @param {Object} res
   * @return Status Code & Object
   */
  getTodo(req, res) {
    // parseInt() function parses a string and returns an integer.
    // radix parameter is used to specify which numeral system to be used,
    const id = parseInt(req.params.id, 10);

    models.Todo.findById(id)
      .then((todo) => {
        if (todo) {
          return res.status(200).send({
            success: 'true',
            message: 'Todo retrieved successfully',
            todo,
          });
        }
        return res.status(404).send({
          success: 'false',
          message: 'todo does not exist',
        });
      });
  },

  /**
   * @function createTodo
   * @param {Object} req
   * @param {Object} res
   * @return Status Code & Object
   */
  createTodo(req, res) {
    let title = req.body;

    if (!title) {
      return res.status(400).send({
        success: "false",
        message: "title is required"
      })
    }

    models.Todo.findOne({
      where: {title: req.body.title}
    }).then((todoFound) => {
      if (todoFound) {
        return res.status(403).send({
          success: 'true',
          message: 'A todo with that title exist already',
        });
      }
      const todo = {
        "title": req.body.title
      };
      models.Todo.create(todo)
      // the function in the .then is the response from the database after the create operation is completed,
        .then((todo) => {
          // .then function runs when the object has been successfully added to the database
          return res.status(201).send(
            {
              "success": "true",
              "message": {danger: req.flash('danger')},
              todo
            });
        });
    })
  },

  /**
   * @function deleteTodo
   * @param {Object} req
   * @param {Object} res
   * @return Status Code
   */
  deleteTodo(req, res) {
    const id = parseInt(req.params.id, 10);

    models.Todo.findById(id)
      .then((todo) => {
        if (todo) {
          todo.destroy();
          return res.status(204).send({
            success: 'true',
          });
        }
        return res.status(404).send({
          success: 'false',
          message: 'todo does not exist',
        });
      });
  },

  /**
   * @function updateTodo
   * @param {Object} req
   * @param {Object} res
   * @return Status Code & Object
   */

  updateTodo(req, res) {
    const id = parseInt(req.params.id, 10);

    models.Todo.findById(id)
      .then((todo) => {
        if (todo) {
          todo.update({
            title: req.body.title || todo.title,
          });
          return res.status(200).send({
            success: 'true',
            message: 'todo updated successfully',
          });
        }
        return res.status(404).send({
          success: 'false',
          message: 'todo does not exist',
        });
      });
  },

};

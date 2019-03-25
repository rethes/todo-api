const models = require('../server/models/index');

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
        message: 'Todos retrieved successfully',
        todos,
      }));
  },

  /**
   * @function getPaginatedTodos
   * @param {Object} req
   * @param {Object} res
   * @return Status Code & Object
   */
  getPaginatedTodos(req, res) {
    // number of records per page
    let limit = 10;
    let offset = 0;

    models.Todo.findAndCountAll()
      .then((data) => {
        // page
        let page = req.params.page;
        // page number
        const pagesCount = data.count;
        let pages = Math.ceil(pagesCount / limit);
        offset = limit * (page - 1);

        const newPage = parseInt(page, 10);

        const currentPage = req.path;
        const nextPage = (newPage + 1);

        models.Todo.findAll({
          limit: limit,
          offset: offset,
          $sort: {id: 1}
        })
          .then((todos) => {
            if (todos.length === 0) {
              return res.status(200).send({
                success: 'true',
                message: 'No todos',
              });
            }
            res.status(200).json({
              "data": todos,
              "meta": {
                "firstPage": "http://localhost:8000/api/v1/todos/1",
                "currentPage": "http://localhost:8000" + currentPage,
                "nextPage": "http://localhost:8000/api/v1/todos/" + nextPage,
                "page": newPage,
                "pagesCount": pagesCount,
                "totalCount": pages
              },
            });
          });
      })
      .catch(() => {
        res.status(400).send({
          success: "false",
          message: "Bad Request"
        });
      });

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

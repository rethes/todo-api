const Todo = require('../server/models/index').Todos;

module.exports = {

  /**
   * @function getAllTodos
   * @param {Object} req
   * @param {Object} res
   * @return Status Code & Object with array
   */
  getAllTodos: async(req, res) => {
    // req object contains information about our request
    // response object contains information about the response and methods we can use to send information back to the client.
    const todos = await Todo.findAll({
      where: {
        categoryId: req.params.id,
      },
    });

    if(todos.length === 0){
      return res.status(404).send({
        status: "error",
        message: "Todo not found",
      });
    }

    return res.status(200).send({
      // res.send() is used to send back a response to the client,
      status: 'success',
      message: 'Todos retrieved successfully',
      data: { todos } ,
    });
  },

  /**
   * @function createTodo
   * @param {Object} req
   * @param {Object} res
   * @return Status Code & Object
   */
  createTodo(req, res) {

    let description = req.body;

    if (!description) {
      return res.status(400).send({
        success: "false",
        message: "A description is required"
      })
    }

    Todo.findOne({
      where: { description: req.body.description }
    })
      .then((todoFound) => {
      if (todoFound) {
        return res.status(409).send({
          status: 'error',
          message: 'A todo with that description exist already',
        });
      }

      const todo = {
        "description": req.body.description,
        "categoryId": req.params.id,
      };

      Todo.create(todo)
      // the function in the .then is the response from the database after the create operation is completed,
        .then((todo) => {
          // .then function runs when the object has been successfully added to the database
          return res.status(201).send(
            {
              status: "success",
              message: 'The todo created successfully',
              data: { todo }
            });
        });
    })
  },

  /**
   * @function getTodo
   * @param {Object} req
   * @param {Object} res
   * @return Status Code & Object
   */
  getTodo(req, res) {

    Todo.findOne({
      where: { id: req.params.id }
    }).then((todo) => {
        if (todo) {
          return res.status(200).send({
            status: 'success',
            message: 'Todo retrieved successfully',
            data: { todo },
          });
        }
        return res.status(404).send({
          status: 'error',
          message: 'The todo does not exist',
        });
      });
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

    Todo.findAndCountAll({
      where: {
        categoryId: req.params.id,
      },
    })
      .then((data) => {
        // page
        let page = req.params.page;
        // page number
        const totalCount = data.count;
        let pages = Math.ceil(totalCount / limit);
        offset = limit * (page - 1);

        const newPage = parseInt(page, 10);

        const currentPage = req.path;
        const nextPage = (newPage + 1);

        Todo.findAll({
          limit: limit,
          offset: offset,
          $sort: {id: 1},
          where: {
            categoryId: req.params.id,
          },
        })
          .then((todos) => {
            if (todos.length === 0) {
              return res.status(404).send({
                status: 'error',
                message: 'No todos',
              });
            }
            res.status(200).json({
              "data": todos,
              "meta": {
                "firstPage": "http://localhost:8000/api/v1/categories/" + req.params.id + "/todos/1",
                "currentPage": "http://localhost:8000" + currentPage,
                "nextPage": (pages < 2) ? " " :"http://localhost:8000/api/v1/categories/" + req.params.id + "/todos/"
                  + nextPage,
                "page": newPage,
                "pagesCount": pages,
                "totalCount": totalCount
              },
            });
          });
      })
      .catch(() => {
        res.status(400).send({
          status: "success",
          message: "Bad Request"
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

    Todo.findOne({
      where: { id: req.params.id }
    })
      .then( async (todo) => {
        if (todo) {

          await todo.update({
            description: req.body.description || todo.description,
          });

          return res.status(200).send({
           status: 'success',
            message: 'todo updated successfully',
            data: { todo }
          });
        }
        return res.status(404).send({
         status: 'error',
          message: 'todo does not exist',
        });
      });
  },

  /**
   * @function deleteTodo
   * @param {Object} req
   * @param {Object} res
   * @return Status Code
   */
  deleteTodo: async(req, res) => {

    const todo = await Todo.findOne({
        where: { id: req.params.id }
    });

    if (todo) {
      todo.destroy();
      return res.status(200).send({
        status: 'success', message: 'Todo deleted successfully',
      });
    }
    return res.status(404).send({
      status: 'error', message: 'The todo does not exist',
    });
  },

};

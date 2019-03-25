//models
const User = require('../server/models/index').User;

// helper functions
const generateToken = require('../helpers/generateToken');
const generateHash = require('../helpers/hashPassword');

module.exports = {
  createUser(req, res) {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
      return res.status(400).send({
        success: "false",
        message: "email and password is required"
      })
    }

    User.findOne({
      where: {
        email: req.body.email,
      }
    }).then((userFound) => {
      if (userFound) {
        return res.status(403).send({
          success: 'false',
          message: 'A user with that email exist already',
        });
      }

      const hashedPassword = generateHash.hash(password);
      //create a new user
      const user = {
        email: req.body.email,
        imageUrl: req.body.imageUrl,
        password: hashedPassword,
      };
      const userToken = generateToken.token(user);

      User.create(user)
        .then(() => {
          return res.status(201).send(
            {
              "success": "true",
              "message": "User created successfully",
              user: {
                "email": user.email,
                "imageUrl": user.imageUrl,
              },
              userToken
            });
        });
    })
  },

  loginUser(req, res) {
    const user = User.findOne({
      where: {
        email: req.body.email
      }
    }).then((user) => {
      if (!user) {
        return res.status(404).send({message: 'User does not exist'});
      }
      const userToken = generateToken.token(user);

      return res.status(200).send({
        message: 'You were successfully logged in',
        user: {
          "id": user.id,
          "email": user.email,
          "imageUrl": user.imageUrl,
        },
        userToken,
      });
    });

  },

  getUsers(req, res) {
    User.findAll({
      attributes: ['id', 'email', 'imageUrl', 'createdAt', 'updatedAt'],
    })
      .then(users => res.status(200).send({
        success: 'true',
        message: 'success, the users',
        users
      }));
  },

  getPaginatedUsers(req, res) {
    // number of records per page
    let limit = 10;
    let offset = 0;

    User.findAndCountAll()
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

        User.findAll({
          attributes: ['id', 'email', 'imageUrl', 'createdAt', 'updatedAt'],
          limit: limit,
          offset: offset,
          $sort: {id: 1}
        })
          .then((users) => {
            if (users.length === 0) {
              return res.status(200).send({
                success: 'true',
                message: 'No users',
              });
            }
            res.status(200).json({
              "status": "success",
              "data": users,
              "meta": {
                "firstPage": "http://localhost:8000/api/v1/users/1",
                "currentPage": "http://localhost:8000" + currentPage,
                "nextPage": "http://localhost:8000/api/v1/users/" + nextPage,
                "page": newPage,
                "pagesCount": pages,
                "totalCount": pagesCount,
              },
            });
          });
      })
      .catch(() => {
        res.status(400).send({
          status: "error",
          message: "Bad Request"
        });
      });
  },

};

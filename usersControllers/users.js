const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const User = require('../server/models').User;

const bcrypt = require('bcrypt');

//generate token
const token = id => {
  return jwt.sign({sub: id}, JWT_SECRET, {expiresIn: '24h'});
};

//hash password
const generateHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

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

      const hashedPassword = generateHash(password);
      //create a new user
      const user = {
        email: req.body.email,
        imageUrl: req.body.imageUrl,
        password: hashedPassword,
      };
      const userToken = token(user);

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
      const userToken = token(user);

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
    User.findAll()
      .then(users => res.status(200).send({
        success: 'true',
        message: 'success, the users',
        users,
      }));
  },

};

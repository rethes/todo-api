//third-party libraries
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

//models
const User = require('../server/models/index').Users;

//helper functions
const generateToken = require('../helpers/generateToken');
const generateHash = require('../helpers/hashPassword');
const localStorage = require('../helpers/uploads');


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
         status: 'error',
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
              status: "success",
              message: "User successfully created",
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
    User.findOne({
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

  getAllUsers(req, res) {
    User.findAll({
      attributes: ['id', 'email', 'imageUrl'],
    })
      .then(users => res.status(200).send({
        message: "Users fetched successfully",
        status: "success",
        users
      }));
  },

  getUser(req, res) {
    User.findById(req.params.id)
      .then((user) => {
        if (user) {
          return res.status(200).send({
           status: 'success',
            message: 'User retrieved successfully',
            data: { user },
          });
        }
        return res.status(404).send({
         status: 'error',
          message: 'user does not exist',
        });
      });
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
        const totalCount = data.count;
        let pages = Math.ceil(totalCount / limit);
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
               status: 'success',
                message: 'No users',
              });
            }
            res.status(200).json({
              "status": "success",
              "data": users,
              "meta": {
                "firstPage": "http://localhost:8000/api/v1/users/1",
                "currentPage": "http://localhost:8000" + currentPage,
                "nextPage": (pages < 2) ? " " : "http://localhost:8000/api/v1/users/" + nextPage,
                "page": newPage,
                "pagesCount": pages,
                "totalCount": totalCount,
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

  updateImage(req, res) {

    User.findById(req.params.id)
      .then(async (user) => {
        if (!user) {
          return res.status(404).send({
            status: 'error',
            message: 'The user does not exist',
          });
        }
          //store file locally
          const storage = localStorage.storage;
          const upload = multer({storage}).single('name');

          upload(req, res, (err) => {
            if (err) {
              return res.send(err)
            }
            //send file to cloudinary
            cloudinary.config({
              cloud_name: process.env.CLOUDINARY_NAME,
              api_key: process.env.CLOUDINARY_API_KEY,
              api_secret: process.env.CLOUDINARY_API_SECRET
            });

            const path = req.file.path;
            const uniqueFilename = new Date().toISOString();

            cloudinary.uploader.upload(path, {public_id: `todo-app/${uniqueFilename}`, tags: `todo-app`},
              async (err, image) => {

                if (err) {
                  return res.send(err.message);
                }
                // remove file from server
                const fs = require('fs');
                fs.unlinkSync(path);

                // return image details and update user
                const imageUrl = await image.secure_url;

                user.update({
                  imageUrl: imageUrl || user.imageUrl,
                });
                return  res.status(200).send({
                  "status": "success",
                  "message": "User image successfully updated",
                  user
                });
              }
            );
          });

      });
  },
};

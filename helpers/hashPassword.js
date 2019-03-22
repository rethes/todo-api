// third-party libraries
const bcrypt = require('bcrypt');

module.exports = {
  //hash password
  hash: (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
  },
};

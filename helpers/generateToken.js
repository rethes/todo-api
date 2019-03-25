const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

module.exports = {
  //generate token
  token: (id) => {
    return jwt.sign({sub: id}, JWT_SECRET, {expiresIn: '24h'});
  },
};

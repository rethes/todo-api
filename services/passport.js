const passport = require('passport');
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const User = require('../server/models').Users;
const JWT_SECRET = process.env.JWT_SECRET;


//JWT WEB TOKENS STRATEGY
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
  },
  (jwtPayload, cb) => {
    //find user specified in the token
    return User.findOne({
      where: {
        email: jwtPayload.sub.email,
      }
    }).then(user => {
      // return user if they exist
      return cb(null, user);
    })
      .catch(err => {
        //handle it if they do not
        return cb(err);
      });
  }
));

//LOCAL STRATEGY
passport.use(new LocalStrategy({
    usernameField: 'email',
  },
  (email, password, cb) => {
    //Find the user given the email
    return User.findOne({
      where: {
        email: email,
      }})
      .then(user => {
        //handle if user does not exist
        if (!user) {
          return cb(null, false, {message: 'Incorrect email or password.'});
        }

        //check hash password against given password
        const validPassword = (newPassword) => {
          return bcrypt.compareSync(newPassword, user.password);
        };

        // check if the passwords match
        const match = validPassword(password);

        if (!match) {
          return cb(null, false );
        }
        return cb(null, user, {message: 'Logged In Successfully'});

      })
      .catch(err => cb(err));
  }
));
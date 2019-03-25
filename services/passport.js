const passport = require('passport');
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const bcrypt = require('bcrypt');

const User = require('../server/models').User;
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
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
    usernameField: 'email',
    // passwordField: 'password'
  },
  (email, password, cb) => {
    //Find the user given the email
    //user found check if the password is okay
    return User.findOne({email})
      .then(user => {
        //handle if user does not exist
        if (!user) {
          return cb(null, false, {message: 'Incorrect email or password.'});
        }
        //hash password
        const generateHash = (password) => {
          return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
        };
        const hashPassword = generateHash(user.password);

        //check hash password
        const validPassword = (newPassword) => {
          return bcrypt.compareSync(newPassword, hashPassword);
        };
        const match = validPassword(password);

        if (!match) {
          return cb(null, false );
        }
        return cb(null, user, {message: 'Logged In Successfully'});

      })
      .catch(err => cb(err));
  }
));
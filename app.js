const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes");
// const passport = require('passport');

// ExtractJwt = require('passport-jwt').ExtractJwt;
// const opts = {};
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.secretOrKey = 'secret';
// opts.issuer = 'accounts.examplesoft.com';
// opts.audience = 'yoursite.net';


//set up the express app
const app = express();

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//passport
// app.use(passport.initialize());
// app.use(passport.session());

app.use(routes);

app.get('/', (req, res) => res.send('Hello World!'));

const port = 8000;

app.listen(port, () => {
    // app.listen creates a web server for us
    console.log(`server running on the ${port}`)
});

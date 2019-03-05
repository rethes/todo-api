const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes");

//set up the express app
const app = express();

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(routes);

const port = 5000;

app.listen(port, () => {
    // app.listen creates a web server for us
    console.log(`server running on the ${port}`)
});

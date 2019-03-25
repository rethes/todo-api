const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes");

const PORT = process.env.PORT;

//set up the express app
const app = express();

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(routes);

app.listen(PORT, () => {
    console.log(`server running on the ${PORT}`)
});

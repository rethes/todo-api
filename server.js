// server.js
const  app  = require("./app");
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log( process.env.PORT);
    console.log(`server running on the 8000`)
});

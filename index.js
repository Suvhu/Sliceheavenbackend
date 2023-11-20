const connectToMongo = require("./db");
const express = require("express");
var cors = require("cors");

connectToMongo();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use('/api/authuser',require('./routes/authuser'));
app.use('/api/authadmin',require('./routes/authadmin'));
app.use('/api/admindash',require('./routes/admindash'));
app.use('/api/userdash',require('./routes/userdash'));

app.listen(port, () => {
  console.log(`pizzaz backend listening on port ${port}`);
});

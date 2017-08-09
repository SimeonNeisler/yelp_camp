var express = require("express");
var app = express();


app.get("/", (req, res) => {
  res.send("Landing Page");
});

app.listen(3000, process.env.IP, (req, res) => {
  console.log("Server online");
});

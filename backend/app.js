const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const postsRoutes = require("./routes/posts");
const userRoutes = require("./routes/user");

//sequelize
const db = require("./config/sequelize");

//verification of connection
db.authenticate()
  .then(() => {
    console.log(
      "Connection to the database has been established successfully."
    );
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


//pass access to images folder
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "Get, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/posts", postsRoutes);
app.use("/user", userRoutes);


module.exports = app;

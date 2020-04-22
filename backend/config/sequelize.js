const Sequelize = require("sequelize");
const sequelize = new Sequelize("mean", "root", "toor", {
  host: "localhost",
  dialect: "mysql",
  logging: false
});

module.exports = sequelize;

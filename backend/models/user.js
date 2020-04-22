const Sequelize = require("sequelize");
const sequelize = new Sequelize("mean", "root", "toor", {
  host: "localhost",
  dialect: "mysql",
  logging: false
});

const User = sequelize.define("user", {
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

var Post = require("./post");
User.hasMany(Post);

sequelize
  .sync({
    //logging: console.log
  })
  .then(function() {})
  .catch(function(error) {
    console.log(error);
  });

module.exports = User;

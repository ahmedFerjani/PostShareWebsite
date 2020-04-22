const Sequelize = require("sequelize");
const sequelize = new Sequelize("mean", "root", "toor", {
  host: "localhost",
  dialect: "mysql",
  logging: false
});

const Post = sequelize.define("post", {
  title: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  content: {
    type: Sequelize.TEXT,
    defaultValue: "Coming soon..."
  },
  imagesrc: {
    type: Sequelize.TEXT
    //unique: true,
    //allowNull: false
  }
});

sequelize
  .sync({
    force: true,
    //logging: console.log
  })
  .then(function() {
    /*Post.create({
    title: 'title1',
    body: 'body1',

  })*/
  })
  .catch(function(error) {
    console.log(error);
  });

module.exports = Post;

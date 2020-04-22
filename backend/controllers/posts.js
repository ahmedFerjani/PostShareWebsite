const Post = require("../models/post");

exports.createPost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");

  const post = Post.create({
    title: req.body.title,
    content: req.body.content,
    imagesrc: url + "/images/" + req.file.filename,
    userId: req.userData.id
  })
    .then(createdPost => {
      res.status(201).json({
        message: "Post added succ! ",
        post: {
          id: createdPost.id,
          title: createdPost.title,
          content: createdPost.content,
          imagesrc: createdPost.imagesrc,
          userId: createdPost.userId
          //...createdPost
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "Creating a post failed!"
      });
    });
};

exports.updatePost = (req, res, next) => {
  let imagesrc = req.body.imagesrc;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagesrc = url + "/images/" + req.file.filename;
  }

  Post.update(
    { title: req.body.title, content: req.body.content, imagesrc: imagesrc },
    {
      where: {
        id: req.body.id,
        userId: req.userData.id
      }
    }
  )
    .then(result => {
      if (result) {
        res
          .status(200)
          .json({ message: "update successful!", image: imagesrc });
      } else {
        res.status(401).json({ message: "you are not authorized!" });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: "Couldn't update post!"
      });
    });
};

exports.getPost = (req, res, next) => {
  Post.findByPk(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found!" });
      }
    })
    .catch(err => {
      return res.status(500).json("Couldn't get post");
    });
};

exports.getPosts = (req, res, next) => {
  console.log(
    "****************************************" + JSON.stringify(req.query)
  );
  const length = +req.query.length;
  const pageSize = +req.query.pageSize;
  if (length && pageSize) {
    Post.findAndCountAll({
      offset: pageSize * (length - 1),
      limit: pageSize
    })
      .then(({ count, rows }) => {
        //console.log(fetchedPosts) ;
        res.status(200).json({
          message: "post(s) fetched succf",
          posts: rows,
          count: count
        });
      })
      .catch("Couldn't fetch posts");
  } else {
    Post.findAll()
      .then(rows => {
        //console.log(fetchedPosts) ;
        res.status(200).json({
          message: "posts fetched succf",
          posts: rows,
          count: rows.length
        });
      })
      .catch("couldn't fetch posts");
  }
};

exports.deletePost = (req, res, next) => {
  Post.destroy({
    where: { id: req.params.id, userId: req.userData.id }
  })
    .then(result => {
      if (result) {
        //console.log("result : " + result);
        res.status(200).json({ message: "Post deleted" });
      } else {
        res.status(401).json({ message: "you are not authorized!" });
      }
    })
    .catch(err => {
      return res.status(500).json({
        message: "Couldn't delete post"
      });
    });
};

const express = require("express");
const bodyParser = require("body-parser");
const checkAuth = require("../middlewares/auth-check");
const router = express.Router();
const postsController = require("../controllers/posts");
const extractImages = require("../middlewares/images");

//create post
router.post("", checkAuth, extractImages, postsController.createPost);

//update post
router.put("/:id", checkAuth, extractImages, postsController.updatePost);

//get post
router.get("/:id", postsController.getPost);

//get posts
router.get("", postsController.getPosts);

router.delete("/:id", checkAuth, postsController.deletePost);

module.exports = router;

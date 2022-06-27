const express = require("express");
const router = express.Router();
const middleWare = require("../middleWare/routeMiddlewares.js");

const authorController = require("../controllers/authorController.js");
const blogController = require("../controllers/blogController.js");

// PHASE 1

router.post(
  "/authors",
  authorController.createAuthor
);
router.post("/blogs", middleWare.authenticate, blogController.createBlog);
router.put(
  "/blogs/:blogId",
  middleWare.authenticate,
  middleWare.authoriseUpdate,
  blogController.updateBlog
);
router.get("/blogs", middleWare.authenticate, blogController.getBlog);
router.delete(
  "/blogs/:blogId",
  middleWare.authenticate,
  middleWare.authoriseUpdate,
  blogController.deleteBlog
);
router.delete(
  "/blogs",
  middleWare.authenticate,
  blogController.deleteBlogByQuery
);

//PHASE 2

router.post("/login", authorController.loginAuthor);

module.exports = router;

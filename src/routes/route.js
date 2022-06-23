const express = require("express");
const router = express.Router();
const middleWare = require("../middleWare/routeMiddlewares.js");

const authorController = require("../controllers/authorController.js");
const blogController = require("../controllers/blogController.js");

router.post("/authors", middleWare.validateEmail,authorController.createAuthor);
router.post("/blogs", blogController.createBlog);
router.put("/blogs/:blogId", blogController.updateBlog);
router.get("/blogs", blogController.getBlog);
router.delete("/blogs/:blogId", blogController.deleteBlog);
router.delete("/blogs",blogController.deleteBlogByQuery)

module.exports = router;

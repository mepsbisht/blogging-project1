const authorModel = require("../models/authorModel.js");
const blogsModel = require("../models/blogsModel.js");
const validation = require("../validation.js");
const mongoose = require("mongoose");

const createBlog = async function (req, res) {
  try {
    let blog = req.body;

    if (!validation.validaterequest(blog)) {
      return res
        .status(400)
        .send({ status: false, msg: "Input valid request" });
    }

    if (!blog.title) {
      return res.status(400).send({ status: false, msg: "Title is required" });
    }
    if (!validation.validateString(blog.title)) {
      return res.status(400).send({ status: false, msg: "Invalid title." });
    }
    if (!blog.body) {
      return res.status(400).send({ status: false, msg: "Body is required" });
    }

    if (!validation.validateString(blog.body)) {
      return res.status(400).send({ status: false, msg: "Invalid Body." });
    }

    if (!blog.authorId) {
      return res
        .status(400)
        .send({ status: false, msg: "AuthorId is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(blog.authorId)) {
      return res
        .status(400)
        .send({ status: false, msg: "Enter valid format of AuthorId" });
    }

    if (!validation.validateString(blog.authorId)) {
      return res.status(400).send({ status: false, msg: "Invalid AuthorId." });
    }

    if (!blog.category) {
      return res
        .status(400)
        .send({ status: false, msg: "Category is required" });
    }

    if (!validation.validateString(blog.category)) {
      return res.status(400).send({ status: false, msg: "Invalid category." });
    }

    if (blog.subcategory != undefined) {
      blog.subcategory = validation.convertToArray(blog.subcategory);
      if (!blog.subcategory)
        return res
          .status(400)
          .send({ status: false, msg: "Invalid Subcategory." });
    }

    if (blog.tags != undefined) {
      blog.tags = validation.convertToArray(blog.tags);
      if (!blog.tags)
        return res.status(400).send({ status: false, msg: "Invalid tags." });
    }

    if (blog.authorId) {
      let authorCount = await authorModel.find({ _id: blog.authorId }).count();
      if (authorCount <= 0) {
        return res
          .status(400)
          .send({ status: false, msg: "Invalid authorId." });
      }
    } else {
      return res
        .status(400)
        .send({ status: false, msg: "Author is required." });
    }

    let createdBlog = await blogsModel.create(blog);
    let blogPop = await createdBlog.populate("authorId");
    res.status(201).send(blogPop);
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

const updateBlog = async function (req, res) {
  try {
    let id = req.blog._id;
    let data = req.body;

    if (!validation.validaterequest(data)) {
      return res
        .status(400)
        .send({ status: false, msg: "Input valid request" });
    }

    if (data.title != undefined) {
      if (!validation.validateString(data.title)) {
        return res.status(400).send({ status: false, msg: "Invalid title." });
      }
    }

    if (data.body != undefined) {
      if (!validation.validateString(data.body)) {
        return res.status(400).send({ status: false, msg: "Invalid Body." });
      }
    }

    let subAndTag = {};

    if (data.subcategory != undefined) {
      data.subcategory = validation.convertToArray(data.subcategory);
      if (!data.subcategory) {
        return res
          .status(400)
          .send({ status: false, msg: "Invalid Subcategory." });
      } else {
        subAndTag.subcategory = data.subcategory;
      }
    }

    if (data.tags != undefined) {
      data.tags = validation.convertToArray(data.tags);
      if (!data.tags) {
        return res.status(400).send({ status: false, msg: "Invalid tags." });
      } else {
        subAndTag.tags = { $each: data.tags };
      }
    }

    var update = {
      $set: {
        title: data.title,
        body: data.body,
        isPublished: true,
        publishedAt: Date.now(),
      },

      $push: subAndTag,
    };

    let updatedData = await blogsModel.findOneAndUpdate(
      { _id: id, isPublished: false },
      update,
      { new: true }
    );

    if (!updatedData) {
      return res.status(404).send({ status: false, msg: "No such data found" });
    }

    res.status(200).send({ status: true, data: updatedData });
  } catch (err) {
    res.status(500).send({
      status: false,
      msg: err.message,
    });
  }
};

const getBlog = async function (req, res) {
  try {
    // let data = req.body;
    let searchCondition = { isDeleted: false, isPublished: true };

    if (req.query.authorId) {
      searchCondition.authorId = req.query.authorId;
    }
    if (req.query.category) {
      searchCondition.category = req.query.category;
    }
    if (req.query.tags) {
      searchCondition.tags = { $in: req.query.tags };
    }
    if (req.query.subcategory) {
      searchCondition.subcategory = { $in: req.query.subcategory };
    }

    let findBlog = await blogsModel.find(searchCondition);
    if (!findBlog) {
      res.status(404).send({ status: false, msg: "Not Found" });
    }
    res.status(200).send({ status: true, data: findBlog });
  } catch (err) {
    res.status(500).send({
      status: false,
      msg: err.message,
    });
  }
};

const deleteBlog = async function (req, res) {
  try {
    let id = req.blog._id;

    const blog = await blogsModel.findOneAndUpdate(
      { _id: id },
      {
        $set: { isDeleted: true, deletedAt: Date.now() },
      }
    );

    if (!blog) {
      return res.status(404).send({ status: false, msg: "Blog not found" });
    }

    res.status(200).send();
  } catch (err) {
    res.status(500).send({
      status: false,
      msg: err.message,
    });
  }
};

const deleteBlogByQuery = async function (req, res) {
  try {
    searchCondition = {};
    if (req.query.category) {
      searchCondition.category = req.query.category;
    }

    if (req.query.tags) {
      searchCondition.tags = { $in: req.query.tags };
    }
    if (req.query.subcategory) {
      searchCondition.subcategory = { $in: req.query.subcategory };
    }
    if (req.query.unpublished) {
      searchCondition.isPublished = req.query.unpublished;
    }
    if (req.query.authorId) {
      searchCondition.authorId = req.query.authorId;

      if (req.query.authorId != req.token.authorId)
        res.status(400).send({ status: false, msg: "Invalid author." });
    } else {
      searchCondition.authorId = req.token.authorId;
    }

    let data = await blogsModel.find(searchCondition);
    if (!data) {
      res.status(404).send({
        status: false,
        Msg: "Not Found",
      });
    }

    await blogsModel.updateMany(
      { searchCondition },
      { $set: { isDeleted: true, deletedAt: Date.now() } }
    );

    res.status(200).send();
  } catch (err) {
    res.status(500).send({
      status: false,
      msg: err.message,
    });
  }
};

module.exports.createBlog = createBlog;
module.exports.updateBlog = updateBlog;
module.exports.getBlog = getBlog;
module.exports.deleteBlog = deleteBlog;
module.exports.deleteBlogByQuery = deleteBlogByQuery;

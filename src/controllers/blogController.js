const authorModel = require("../models/authorModel.js");
const blogsModel = require("../models/blogsModel.js");
const validation = require("../validation.js");

const createBlog = async function (req, res) {
  try {
    let blog = req.body;
    if (!validation.validateString(blog.title)) {
      return res.status(400).send({ status: "false", msg: "Invalid title." });
    }
    if (!validation.validateString(blog.body)) {
      return res.status(400).send({ status: "false", msg: "Invalid Body." });
    }
    if (!validation.validateString(blog.authorId)) {
      return res
        .status(400)
        .send({ status: "false", msg: "Invalid AuthorId." });
    }
    if (!validation.validateString(blog.category)) {
      return res
        .status(400)
        .send({ status: "false", msg: "Invalid category." });
    }

    if (blog.subcategory != undefined) {
      blog.subcategory = validation.convertToArray(blog.subcategory);
      if (!blog.subcategory)
        return res
          .status(400)
          .send({ status: "false", msg: "Invalid Subcategory." });
    }

    if (blog.tags != undefined) {
      blog.tags = validation.convertToArray(blog.tags);
      if (!blog.tags)
        return res.status(400).send({ status: "false", msg: "Invalid tags." });
    }

    if (blog.authorId) {
      let authorCount = await authorModel.find({ _id: blog.authorId }).count();
      if (authorCount <= 0) {
        return res
          .status(400)
          .send({ Status: "false", msg: "Invalid authorId." });
      }
    } else {
      res.send("author is required");
    }

    let createdBlog = await blogsModel.create(blog);
    let blogPop = await createdBlog.populate("authorId");
    res.status(201).send(blogPop);
  } catch (err) {
    return res.status(500).send({ msg: err.message });
  }
};

const updateBlog = async function (req, res) {
  try {
    let id = req.params.blogId;
    let data = req.body;

    let checkData = await blogsModel.findOne({ _id: id, isDeleted: false });
    if (!checkData) {
      return res.status(404).send({ status: "false", msg: "Not Found" });
    }

    var update = {
      $set: {
        title: data.title,
        body: data.body,
        isPublished: true,
        publishedAt: Date.now(),
      },

      $push: { subcategory: data.subcategory, tags: { $each: data.tags } },
    };

    let updatedData = await blogsModel.findOneAndUpdate(
      { _id: id, isPublished: false },
      update,
      { new: true }
    );

    res.status(200).send({ data: updatedData });
  } catch (err) {
    res.status(500).send({
      status: "false",
      msg: err.message,
    });
  }
};

const getBlog = async function (req, res) {
  try {
    let data = req.body;
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
      res.status(404).send({ status: "False", msg: "Not Found" });
    }
    res.status(200).send({ msg: findBlog });
  } catch (err) {
    res.status(500).send({
      status: "false",
      msg: err.message,
    });
  }
};

const deleteBlog = async function (req, res) {
  try {
    let id = req.params.blogId;

    let query = { _id: id, isDeleted: false };
    let data = await blogsModel.findOne(query);

    if (!data) {
      res.status(404).send({ Status: false, msg: "Not Found" });
    }

    await blogsModel.findOneAndUpdate(query, {
      $set: { isDeleted: true, deletedAt: Date.now() },
    });

    res.status(200).send();
  } catch (err) {
    res.status(500).send({
      status: "false",
      msg: err.message,
    });
  }
};

const deleteBlogByQuery = async function (req, res) {
  searchCondition = { isdeleted: false, isPublished: false };
  if (req.query.category) {
    searchCondition.category = req.query.category;
  }
  if (req.query.authorId) {
    searchCondition.authorId = req.query.authorId;
  }
  if (req.query.tags) {
    searchCondition.tags = { $in: req.query.tags };
  }
  if (req.query.subcategory) {
    searchCondition.subcategory = { $in: req.query.subcategory };
  }
  if (req.query.authorId != req.token.authorId) {
  res.status(400).send({Status:"False",msg:"No such author exist"})

  }
  let deletedBlog = await blogsModel.updateMany(
    { searchCondition },
    { $set: { isDeleted: true } }
  );
  res.send();

  let data = await blogsModel.find(searchCondition);
  if (!data) {
    res.status(404).send({
      Status: "False",
      Msg: "Not Found",
    });
  }
};

module.exports.createBlog = createBlog;
module.exports.updateBlog = updateBlog;
module.exports.getBlog = getBlog;
module.exports.deleteBlog = deleteBlog;
module.exports.deleteBlogByQuery = deleteBlogByQuery;

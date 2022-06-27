const jwt = require("jsonwebtoken");
const blogsModel = require("../models/blogsModel.js");

const authenticate = function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    if (!token) {
      return res
        .status(400)
        .send({ status: false, msg: "Please provide token in header" });
    }

    let decodedToken = jwt.verify(token, "projectOne");
    if (!decodedToken) {
      return res
        .status(400)
        .send({ status: false, Msg: "Token is not correct" });
    }
    req.token = decodedToken;
    next();
  } catch (err) {
    res
      .status(400)
      .send({ status: false, msg: "Token is not in right format " });
  }
};

const authoriseUpdate = async function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    let decodedToken = jwt.verify(token, "projectOne");

    let blogId = "";
    if (typeof req.params.blogId != "undefined") {
      blogId = req.params.blogId;
    } else if (typeof req.query.blogId != "undefined") {
      blogId = req.query.blogId;
    }

    let checkData = await blogsModel.findOne({ _id: blogId, isDeleted: false });
    if (!checkData) {
      return res.status(404).send({ status: false, msg: "Invalid blogId." });
    }

    if (checkData.authorId != decodedToken.authorId) {
      return res
        .status(404)
        .send({ status: false, msg: "Authorization failed." });
    }
    next();
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, msg: "Internal server error" });
  }
};

module.exports.authenticate = authenticate;
module.exports.authoriseUpdate = authoriseUpdate;

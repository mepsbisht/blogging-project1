const jwt = require("jsonwebtoken");
const blogsModel = require("../models/blogsModel.js");

const validateEmail = function (req, res, next) {
  let email = req.body.email;
  let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  let validEmail = re.test(email);
  if (!validEmail) {
    return res.status(400).send({ Status: "false", msg: "Not Valid Email" });
  } else next();
};

const authenticate = function (req, res, next) {
  try {
    let token = req.headers["x-api-key"];
    if (!token) {
      return res
        .status(400)
        .send({ Status: "false", msg: "Please provide token in header" });
    }

    let decodedToken = jwt.verify(token, "projectOne");
    if (!decodedToken) {
      return res
        .status(400)
        .send({ Status: "false", Msg: "Token is not correct" });
    }
    req.token = decodedToken;
    next();
  } catch (err) {
    res
      .status(400)
      .send({ Status: "false", msg: "Token is not in right format " });
  }
};

const authoriseUpdate = async function (req, res, next) {
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
    return res.status(404).send({ status: "false", msg: "Invalid blogId." });
  }

  if (checkData.authorId != decodedToken.authorId) {
    return res
      .status(404)
      .send({ status: "false", msg: "Authorization failed." });
  }
  next();
};



module.exports.validateEmail = validateEmail;
module.exports.authenticate = authenticate;
module.exports.authoriseUpdate = authoriseUpdate;


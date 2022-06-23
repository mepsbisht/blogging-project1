const authorModel = require("../models/authorModel.js");
const validation = require("../validation.js");
const jwt = require("jsonwebtoken");

const createAuthor = async function (req, res) {
  let author = req.body;

  if (!validation.validateEnum(author.title)) {
    return res
      .status(400)
      .send({ status: "false", msg: "Please pass a valid title." });
  }

  if (!validation.validateString(author.fname, 30)) {
    return res.status(400).send({
      status: "false",
      msg: "Please enter a valid first name upto 30 chars.",
    });
  }
  if (!validation.validateString(author.lname, 30)) {
    return res.status(400).send({
      status: "false",
      msg: "Please enter a valid last name name upto 30 chars.",
    });
  }

  let createdAuthor = await authorModel.create(author);
  res.send({
    data: createdAuthor,
  });
};

const loginAuthor = async function (req, res) {
  let userName = req.body.email;
  let password = req.body.password;

  let author = await authorModel.findOne({ email: userName, password: password });
  
  if (!author) {
    return res.status(401).send({ Status: "False", msg: "Wrong Credentials" });
  }

  let token = jwt.sign(
    {
      authorId: author._id
    },
    "projectOne"
  );
  res.setHeader("x-auth-token", token);
  res.send({ status: true, token: token });
};



module.exports.createAuthor = createAuthor;
module.exports.loginAuthor = loginAuthor;

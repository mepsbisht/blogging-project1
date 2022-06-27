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

  if (!validation.validateString(author.fname)) {
    return res.status(400).send({
      status: "false",
      msg: "Please enter a valid first name.",
    });
  }
  if (!validation.validateString(author.lname)) {
    return res.status(400).send({
      status: "false",
      msg: "Please enter a valid last name name upto 30 chars.",
    });
  }

  let createdAuthor = await authorModel.create(author);
  res.send({status:true,
    data: createdAuthor,
  });
};

const loginAuthor = async function (req, res) {
  let reqData = req.body;

  if (!validation.validateEmail(reqData.email)) {
    return res.status(400).send({ status: false, msg: "Invalid email." });
  }

  if (!validation.validateString(reqData.password)) {
    return res.status(400).send({ status: false, msg: "Invalid password." });
  }

  let userName = reqData.email;
  let password = reqData.password;

  let author = await authorModel.findOne({ email: userName, password: password });
  
  if (!author) {
    return res.status(401).send({ status: false, msg: "Wrong Credentials." });
  }

  let token = jwt.sign(
    {
      authorId: author._id
    },
    "projectOne"
  );

  // res.setHeader("x-auth-token", token);
  res.status(200).send({ status: true, token: token });
};



module.exports.createAuthor = createAuthor;
module.exports.loginAuthor = loginAuthor;

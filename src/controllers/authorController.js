const authorModel = require("../models/authorModel.js");
const validation = require("../validation.js");
const jwt = require("jsonwebtoken");

const createAuthor = async function (req, res) {
  try {
    let author = req.body;

    if (!validation.validaterequest(author)) {
      return res
        .status(400)
        .send({ status: false, msg: "Input valid request" });
    }

    if (!author.title) {
      return res.status(400).send({ status: false, msg: "Title is required" });
    }

    if (!validation.validateEnum(author.title)) {
      return res
        .status(400)
        .send({ status: "false", msg: "Please pass a valid title." });
    }

    if (!author.fname) {
      return res.status(400).send({ status: false, msg: "Fname is required" });
    }
    if (!validation.validateString(author.fname)) {
      return res.status(400).send({
        status: "false",
        msg: "Please enter a valid first name.",
      });
    }

    if (!author.lname) {
      return res.status(400).send({ status: false, msg: "Lname is required" });
    }
    if (!validation.validateString(author.lname)) {
      return res.status(400).send({
        status: "false",
        msg: "Please enter a valid last name name upto 30 chars.",
      });
    }

    if (!author.email) {
      return res.status(400).send({ status: false, msg: "Email is required" });
    } else author.email = author.email.trim();
    if (!validation.validateEmail(author.email)) {
      return res.status(400).send({
        status: false,
        msg: "Enter valid email",
      });
    }
    const isDuplicateEmail = await authorModel.findOne({ email: author.email });
    if (isDuplicateEmail) {
      return res
        .status(409)
        .send({ status: false, msg: "Email already exist" });
    }

    if (!author.password) {
      return res
        .status(400)
        .send({ status: false, msg: "password is required" });
    } else {
      author.password = author.password.trim();
    }
    if (!validation.validatePassword(author.password)) {
      return res.status(400).send({
        status: false,
        msg: "Password should contain Minimum eight characters, at least one letter and one number",
      });
    }

    let createdAuthor = await authorModel.create(author);
    res.send({ status: true, data: createdAuthor });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

const loginAuthor = async function (req, res) {
  try {
    let reqData = req.body;

    if (!validation.validaterequest(reqData)) {
      return res
        .status(400)
        .send({ status: false, msg: "Input valid request" });
    }

    if(!reqData.email){
      return res.status(400).send({status:false,msg:"Email is required"})
    }

    if (!validation.validateEmail(reqData.email)) {
      return res.status(400).send({ status: false, msg: "Enter valid email" });
    }

    
    if(!reqData.password){
      return res.status(400).send({status:false,msg:"Password is required"})
    }
    if (!validation.validatePassword(reqData.password)) {
      return res.status(400).send({ status: false, msg: "Password should contain Minimum eight characters, at least one letter and one number" });
    }

    let userName = reqData.email;
    let password = reqData.password;

    let author = await authorModel.findOne({
      email: userName,
      password: password,
    });

    if (!author) {
      return res.status(401).send({ status: false, msg: "Wrong Credentials." });
    }

    let token = jwt.sign(
      {
        authorId: author._id,
        expiresIn: "24h"
      },
      "projectOne"
    );  
    res.status(200).send({ status: true, token: token });
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports.createAuthor = createAuthor;
module.exports.loginAuthor = loginAuthor;

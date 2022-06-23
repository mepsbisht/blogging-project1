const authorModel = require("../models/authorModel.js");
const validation = require("../validation.js");

const createAuthor = async function (req, res) {
  let author = req.body;

  if (!validation.validateEnum(author.title)) {
    return res
      .status(400)
      .send({ status: "false", msg: "Please pass a valid title." });
  }

  if (!validation.validateString(author.fname, 30)) {
    return res
      .status(400)
      .send({
        status: "false",
        msg: "Please enter a valid first name upto 30 chars.",
      });
  }
  if (!validation.validateString(author.lname, 30)) {
    return res
      .status(400)
      .send({
        status: "false",
        msg: "Please enter a valid last name name upto 30 chars.",
      });
  }

  let createdAuthor = await authorModel.create(author);
  res.send({
    data: createdAuthor,
  });
};

module.exports.createAuthor = createAuthor;

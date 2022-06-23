const validateEmail = function (req, res, next) {
  let email = req.body.email;
  let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  let validEmail = re.test(email);
  if (!validEmail) {
    return res.status(400).send({ Status: "false", msg: "Not Valid Email" });
  }
  else next()
};


module.exports.validateEmail=validateEmail

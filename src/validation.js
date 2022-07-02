const validateEnum = function validateEnum(value) {
  if (!value) {
    return false;
  }

  var titleEnum = ["Mr", "Mrs", "Miss"];
  if (titleEnum.includes(value)) {
    return true;
  }

  return false;
};

const validateString = function validateString(value) {
  if (!value) {
    return false;
  }

  if (typeof value == "string" && value.trim().length != 0) {
    return true;
  }
  return false;
};

const checkValue = function (value) {
  let arrValue = [];
  value.map((x) => {
    x = x.trim();
    if (x.length) arrValue.push(x);
  });
  return arrValue.length ? arrValue : false;
};

const convertToArray = function (value) {
  if (typeof value == "string") {
    value = value.trim();
    if (value) {
      return [value];
    }
  } else if (value?.length > 0) {
    return checkValue(value);
  }
  return false;
};

const validateEmail = function (value) {
  let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  let validEmail = re.test(value);

  if (!validEmail) {
    return false;
  }

  return true;
};

const validatePassword = function (value) {
  let re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  let validPassword = re.test(value);

  if (!validPassword) {
    return false;
  }

  return true;
};

const validaterequest = function (value) {
  if (Object.keys(value).length == 0) {
    return false;
  } else return true;
};

module.exports.validateEnum = validateEnum;
module.exports.validateString = validateString;
module.exports.convertToArray = convertToArray;
module.exports.checkValue = checkValue;
module.exports.validateEmail = validateEmail;
module.exports.validatePassword = validatePassword;
module.exports.validaterequest = validaterequest;

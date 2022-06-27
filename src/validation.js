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

//maxLength = 100
const validateString = function validateString(value) {
  if (!value) {
    return false;
  }

  if (typeof value == "string") {
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
  let email = value;
  let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  let validEmail = re.test(email);

  if (!validEmail) {
    return false;
  }

  return true;
};

module.exports.validateEnum = validateEnum;
module.exports.validateString = validateString;
module.exports.convertToArray = convertToArray;
module.exports.checkValue = checkValue;
module.exports.validateEmail = validateEmail;

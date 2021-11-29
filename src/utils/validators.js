const validateIPv4 = (inputText) => {
  const format =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return inputText && inputText.match(format);
};

const validateSwap = (inputText) => {
  const allowed = [
    "0",
    "2147483648",
    "4294967296",
    "8589934592",
    "17179869184",
  ];
  return allowed.includes(inputText.toString());
};

const isValidHostname = (value) => {
  if (typeof value !== "string") return false;

  const validHostnameChars = /^[a-zA-Z0-9-.]{1,253}\.?$/g;
  if (!validHostnameChars.test(value)) {
    return false;
  }

  if (value.endsWith(".")) {
    value = value.slice(0, value.length - 1);
  }

  if (value.length > 253) {
    return false;
  }

  const labels = value.split(".");

  const isValid = labels.every(function (label) {
    const validLabelChars = /^([a-zA-Z0-9-]+)$/g;

    const validLabel =
      validLabelChars.test(label) &&
      label.length < 64 &&
      !label.startsWith("-") &&
      !label.endsWith("-");

    return validLabel;
  });

  return isValid;
};

const validateSSHPort = (inputValue) => {
  const notAllowed = ["6000", "6001", "3000", "3001", "123", "80", "443"];
  const isNumber =
    inputValue && parseInt(inputValue) && parseInt(inputValue) > 0;
  return !notAllowed.includes(inputValue) && isNumber;
};

const hasIllegalCharacters = (inputValue) => {
  const regex = new RegExp(/"|'|\$|!|#|%|\^|&|\*|!|#|%|\^|&|\*/g);
  return inputValue.match(regex) && inputValue.match(regex).length;
};

module.exports = {
    validateIPv4,
    validateSwap,
    isValidHostname,
    validateSSHPort,
    hasIllegalCharacters
}
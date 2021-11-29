const shell = require("shelljs");

const getFileContents = (path, file) => {
  const data = shell.test("-f", `${path}/${file}`)
    ? shell.cat(`${path}/${file}`)
    : "";
  return data;
};

module.exports = {
  getFileContents,
};

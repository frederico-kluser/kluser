let config = {};
const configGetAttribute = (property) => JSON.parse(config)[property];
const configSetter = (value) => {
  config = value;
};

module.exports = {
  configGetAttribute,
  configSetter,
};

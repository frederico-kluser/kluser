let config: string = '';
export const configGetAttribute = (property) => JSON.parse(config)[property];
export const configSetter = (value) => {
  config = value;
};

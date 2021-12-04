const ENUMS = {
  kluser_props: 'kluser_props',
  kluser_parent: 'kluser_parent',
  class: 'class',
  id: 'id',
};

const isReservedWords = (word) => {
  let result = false;

  Object.keys(ENUMS).forEach((key) => {
    if (word === key) {
      result = true;
    }
  });

  return result;
};

const isParentComponent = (attribute = {}) => attribute.kluser_parent !== undefined;

const attributesInjector = (obj) => {
  let attributes = ''; // space from the tag name

  Object.keys(obj).forEach((property) => {
    if (!isReservedWords(property)) {
      attributes += `${property}="${obj[property]}" `;
    }
  });

  return attributes ? ` ${attributes}` : '';
};

module.exports = {
  attributesInjector, ENUMS, isParentComponent, isReservedWords,
};

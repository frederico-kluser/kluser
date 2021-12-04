/* eslint-disable no-param-reassign */
import file from './file';

const { html2json } = require('html2json');
const css2json = require('css2json');

const checkEqualObjects = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2);

const checkHtmlNode = (obj, propertyRules) => {
  let findProperty = true;

  Object.keys(propertyRules).forEach((rule) => {
    if (obj[rule] !== propertyRules[rule]) {
      findProperty = false;
    }
  });

  return findProperty;
};

const getSpecificHtmlNode = (obj, propertyRules) => {
  const object = obj;
  const stack = [object];
  let result = null;
  let index = 0;

  while (index < stack.length) {
    const element = stack[index];
    if (result === null) {
      const { child } = element;
      result = checkHtmlNode(element, propertyRules) ? element : null;
      if (child !== undefined) {
        child.forEach((childElement) => {
          stack.push(childElement);
        });
      }
    }
    index += 1;
  }

  return result;
};

const sortObjProperties = (obj = {}) => Object.keys(obj).sort().reduce((result, key) => {
  // eslint-disable-next-line no-param-reassign
  result[key] = obj[key];
  return result;
}, {});

const getStyleAttributes = (style = {}, globalStyles, attribute, type = 'class') => {
  const symbols = {
    class: '.',
    id: '#',
  };

  if (typeof attribute === 'string') {
    style = { ...style, ...globalStyles[`${symbols[type]}${attribute}`] };
  } else {
    attribute.forEach((attr) => {
      style = { ...style, ...globalStyles[`${symbols[type]}${attr}`] };
    });
  }

  return style;
};

// eslint-disable-next-line complexity
const styleInjector = (obj, styles) => {
  if (styles[obj.tag]) {
    obj.style = styles[obj.tag];
  }

  if (obj.attr) {
    if (obj.attr.class) {
      obj.style = getStyleAttributes(obj.style, styles, obj.attr.class, 'class');
    }
    if (obj.attr.id) {
      obj.style = getStyleAttributes(obj.style, styles, obj.attr.id, 'id');
    }
  }

  obj.style = sortObjProperties(obj.style);

  if (obj.child && obj.child.length) {
    obj.child.forEach((childObj) => {
      styleInjector(childObj, styles);
    });
  }
};

const getData = () => {
  const files = {
    html: file.read('./kluser/index.html'),
    css: file.read('./kluser/style.css'),
  };
  const bodyContent = getSpecificHtmlNode(html2json(files.html), { tag: 'body' });
  const cssContent = css2json(files.css);

  styleInjector(bodyContent, cssContent);

  return bodyContent;
};

module.exports = {
  checkEqualObjects, checkHtmlNode, getData, getSpecificHtmlNode,
};

import { isParentComponent } from "../helpers/attributes";
import { configGetAttribute } from "../helpers/global";
import { cleanString, isValidText, replaceAll, upperCaseFirstLetter } from "../helpers/string";

export const fileObjectBuilder = (fileName, fileContent) => {
  // eslint-disable-next-line no-param-reassign
  fileContent = fileContent.join('\n');

  return ({
    fileName,
    fileContent,
  });
};

export const styleBuilder = (styleObj) => {
  let styles = '\n';

  Object.keys(styleObj).forEach((property) => {
    styles += `\t${property}: ${styleObj[property]};\n`;
  });

  return styles;
};

export const componentNameBuilder = (attribute) => (
  (attribute && attribute.id) ? upperCaseFirstLetter(attribute.id) : null
);

const importPathBuilder = (componentName) => `import ${componentName} from '../../${configGetAttribute('folders').components}/${componentName}';`;

// need improve to convert html tags to reactNative tag
export const styledTagBuilder = (name) => {
  const { framework } = configGetAttribute('features');
  const converter = {
    reactNative: {
      div: 'View',
      span: 'Text',
      p: 'Text',
      h1: 'Text',
      h2: 'Text',
      h3: 'Text',
      h4: 'Text',
      h5: 'Text',
      h6: 'Text',
      a: 'Text',
      img: 'Image',
      button: 'TouchableOpacity',
      input: 'TextInput',
      select: 'Picker',
      option: 'Picker',
      textarea: 'TextInput',
    },
  };
  return framework === 'reactNative' ? (converter[framework][name] || name) : name;
};

export const childImportsBuilder = (DOM, folder, attributes) => {
  const imports = [];

  if ((folder === configGetAttribute('folders').pages || isParentComponent(attributes)) && DOM) {
    const domIterator = (dom) => {
      dom.forEach(({ attr, child }) => {
        const componentName = componentNameBuilder(attr);
        if (componentName) {
          const importPath = importPathBuilder(componentName);
          if (imports.indexOf(importPath) === -1) {
            imports.push(importPath);
          }

          if (child && !isParentComponent(attr)) {
            domIterator(child);
          }
        }
      });
    };

    domIterator(DOM);
  }

  const output = `${imports.join('\n')}\n`;
  return imports ? output : '';
};

const propFixName = (propName) => propName.substring(1, propName.length);

export const destructPropsBuilder = (props) => props.map((prop) => `, ${prop}`).join('');

const propsInjector = (props) => props.map((prop) => ` ${prop}={${prop}}`).join('');

const getChildProps = (childs, props) => {
  let childProps = [];

  childs.forEach(({ child, node, text }) => {
    if (node === 'text') {
      props.forEach((prop) => {
        if (text.indexOf(prop) !== -1) {
          childProps.push(propFixName(prop));
        }
      });
    } else if (child !== undefined) {
      childProps = [...childProps, ...getChildProps(child, props)];
    }
  });

  return childProps;
};

const propsReplacer = (string, props) => {
  let result = string || '';
  const childUsedProps = [];

  props.forEach((prop) => {
    if (result.indexOf(prop) !== -1) {
      childUsedProps.push(propFixName(prop));
    }
    result = replaceAll(result, prop, `{ ${propFixName(prop)} }`);
  });

  return { string: result, childUsedProps };
};

const indentationBuilder = (level) => {
  let indentation = '\t\t';

  for (let i = 0; i < level; i += 1) {
    indentation += '\t';
  }

  return indentation;
};

const TagBuilder = (tagName, close = false, props = '') => `<${close ? '/' : ''}${tagName}${props}>`;

export const childTagBuilder = (folder, DOM, attributes, props) => {
  let JSX = '';
  let lastDomString = false;
  let usedProps = [];

  if ((folder === configGetAttribute('folders').pages || isParentComponent(attributes)) && DOM) {
    const domIterator = (dom, level = 0) => {
      // eslint-disable-next-line complexity
      dom.forEach(({
        attr = {}, child, text,
      }, index) => {
        const componentName = componentNameBuilder(attr);
        if (componentName) {
          if (index) {
            JSX += '\n';
          }
          JSX += indentationBuilder(level);

          let childUsedProps = [];
          if (isParentComponent(attr)) {
            childUsedProps = getChildProps(child, props);
            usedProps = [...usedProps, ...childUsedProps];
          }
          JSX += TagBuilder(componentName, false, propsInjector(childUsedProps));

          if (child && !isParentComponent(attr)) {
            domIterator(child, level + 1);
            JSX += lastDomString ? '' : `\n${indentationBuilder(level)}`;
            lastDomString = false;
          }

          JSX += TagBuilder(componentName, true);
        } else if (isValidText(text)) {
          const { string, childUsedProps } = propsReplacer(cleanString(text), props);
          JSX += string;
          usedProps = [...usedProps, ...childUsedProps];
          lastDomString = true;
        }
      });
    };

    domIterator(DOM);
  }

  return { childJSX: JSX, usedProps };
};

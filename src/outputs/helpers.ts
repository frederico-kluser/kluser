import { isParentComponent } from '../helpers/attributes'
import { configGetAttribute } from '../helpers/global'
import { kluserPropInjector } from '../helpers/props'
import {
  cleanString,
  isValidText,
  upperCaseFirstLetter
} from '../helpers/string'

export const fileObjectBuilder = (fileName, fileContent) => ({
  fileName,
  fileContent: fileContent.join('\n')
})

export const styleBuilder = styleObj => {
  let styles = '\n'

  Object.keys(styleObj).forEach(property => {
    styles += `\t${property}: ${styleObj[property]};\n`
  })

  return styles
}

export const componentNameBuilder = attribute =>
  attribute && attribute.id ? upperCaseFirstLetter(attribute.id) : null

const importPathBuilder = componentName =>
  `import ${componentName} from '../../${
    configGetAttribute('folders').components
  }/${componentName}';`

// need improve to convert html tags to reactNative tag
export const styledTagBuilder = name => {
  const { framework } = configGetAttribute('features')
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
      textarea: 'TextInput'
    }
  }
  return framework === 'reactNative' ? converter[framework][name] || name : name
}

export const childImportsBuilder = (DOM, folder, attributes) => {
  const imports = []

  if (
    (folder === configGetAttribute('folders').pages ||
      isParentComponent(attributes)) &&
    DOM
  ) {
    const domIterator = dom => {
      dom.forEach(({ attr, child }) => {
        const componentName = componentNameBuilder(attr)
        if (componentName) {
          const importPath = importPathBuilder(componentName)
          if (imports.indexOf(importPath) === -1) {
            imports.push(importPath)
          }

          if (child && !isParentComponent(attr)) {
            domIterator(child)
          }
        }
      })
    }

    domIterator(DOM)
  }

  const output = `${imports.join('\n')}\n`
  return imports ? output : ''
}

const tagBuilder = (tagName, close, attr) =>
  `<${close ? '/' : ''}${tagName}${kluserPropInjector(attr.kluser_props)}>`

export const childTagBuilder = (folder, DOM, attributes) => {
  let JSX = ''

  if (
    (folder === configGetAttribute('folders').pages ||
      isParentComponent(attributes)) &&
    DOM
  ) {
    const domIterator = dom => {
      dom.forEach(({ attr = {}, child, text }) => {
        const componentName = componentNameBuilder(attr)
        if (componentName) {
          JSX += tagBuilder(componentName, false, attr)
          if (child && !isParentComponent(attr)) {
            domIterator(child)
          }
          JSX += tagBuilder(componentName, true, {})
        } else if (isValidText(text)) {
          JSX += cleanString(text)
        }
      })
    }

    domIterator(DOM)
  }

  return { childJSX: JSX }
}

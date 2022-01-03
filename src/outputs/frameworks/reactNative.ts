import { attributesInjector } from '../../helpers/attributes'
import file from '../../helpers/file'
import { configGetAttribute } from '../../helpers/global'
import { node } from '../../helpers/node'
import { kluserDestructPropInjector } from '../../helpers/props'
import {
  childImportsBuilder,
  childTagBuilder,
  componentNameBuilder,
  fileObjectBuilder,
  styleBuilder,
  styledTagBuilder
} from '../helpers'

const reactNative = (name, folder, styles, attr, DOM) => {
  const componentName = componentNameBuilder(attr)
  const { source } = configGetAttribute('folders')
  const { jest, storybook } = configGetAttribute('features')
  const { childJSX } = childTagBuilder(folder, DOM, attr)

  const filePath = `${source}/${folder}/${componentName}/`
  const files = [
    fileObjectBuilder('index.js', [
      `export { default } from './${componentName}';`,
      ''
    ]),
    fileObjectBuilder(`${componentName}.styled.js`, [
      "import styled from 'styled-components/native';",
      '',
      `const Container = styled.${styledTagBuilder(name)}\`${styleBuilder(
        styles
      )}\`;`,
      '',
      'export default Container;',
      ''
    ]),
    fileObjectBuilder(`${componentName}.js`, [
      "import React from 'react'\n",
      childImportsBuilder(DOM, folder, attr),
      `import Container from './${componentName}.styled';`,
      '',
      `const ${componentName} = ({ children${kluserDestructPropInjector(
        attr.kluser_props
      )} }) => (`,
      `\t<Container${attributesInjector(attr)}>${childJSX}`,
      '\t\t{ children }',
      '\t</Container>',
      ');',
      '',
      `export default ${componentName};`,
      ''
    ])
  ]

  if (jest) {
    files.push(
      fileObjectBuilder(`${componentName}.test.jsx`, [
        "import React from 'react'",
        "import renderer from 'react-test-renderer'",
        `import ${componentName} from './${componentName}'`,
        '',
        `describe('${componentName} page', () => {`,
        `\tit('${componentName} snapshot testing', () => {`,
        '\t\texpect.assertions(1)',
        '',
        `\t\tconst tree = renderer.create(<${componentName} />).toJSON()`,
        '',
        '\t\texpect(tree).toMatchSnapshot()',
        '\t})',
        '})'
      ])
    )
  }
  if (storybook) {
    files.push(
      fileObjectBuilder(`${componentName}.stories.js`, [
        "import { Story, Meta } from '@storybook/react/types-6-0';",
        `import ${componentName} from '.';`,
        '',
        'export default {',
        `\ttitle: '${componentName}',`,
        `\tcomponent: ${componentName}`,
        '} as Meta;',
        '',
        `export const Basic: Story = () => <${componentName} />;`
      ])
    )
  }

  files.forEach(({ fileName, fileContent }) => {
    file.write(fileName, fileContent, filePath)
    node(`npx prettier --write ${filePath}${fileName}`)
  })
}

export default reactNative

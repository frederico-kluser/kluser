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

const react = (name, folder, styles, attr, DOM) => {
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
      "import styled from 'styled-components';",
      '',
      `const Container = styled.${styledTagBuilder(name)}\`${styleBuilder(
        styles
      )}\`;`,
      '',
      'export default Container;',
      ''
    ]),
    fileObjectBuilder(`${componentName}.jsx`, [
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
        "import { render, screen } from '@testing-library/react';",
        "import { ReactNode } from 'react';",
        "import { ThemeProvider } from 'styled-components';",
        "import { theme } from '../../../styles/theme';",
        `import ${componentName} from '.';`,
        '',
        'const renderComponent = (children: ReactNode) =>',
        '\trender(<ThemeProvider theme={theme}>{children}</ThemeProvider>);',
        '',
        `describe('<${componentName} />', () => {`,
        "\tit('Should render the heading', () => {",
        `\t\trenderComponent(<${componentName} />);`,
        '',
        `\t\texpect(screen.getByText(/${componentName}/i)).toBeInTheDocument();`,
        '\t})',
        '})',
        ''
      ])
    )
  }
  if (storybook) {
    files.push(
      fileObjectBuilder(`${componentName}.stories.jsx`, [
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

export default react

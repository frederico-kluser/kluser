import file from '../../helpers/file';

const { attributesInjector } = require('../../helpers/attributes');
const { configGetAttribute } = require('../../helpers/global');
const {
  childImportsBuilder,
  childTagBuilder,
  componentNameBuilder,
  fileObjectBuilder,
  styleBuilder,
  styledTagBuilder,
  destructPropsBuilder,
} = require('../helpers');

const react = (name, folder = 'ui', styles, attr, DOM, props) => {
  const componentName = componentNameBuilder(attr);
  const { source, pages } = configGetAttribute('folders');
  const { jest, storybook } = configGetAttribute('features');
  const { childJSX, usedProps } = childTagBuilder(folder, DOM, attr, props);

  let passingProps = [];
  if (folder === pages || attr.kluser_parent !== undefined) {
    passingProps = usedProps;
  }

  const filePath = `${source}/${folder}/${componentName}/`;
  const files = [
    fileObjectBuilder('index.js', [
      `export { default } from './${componentName}';`,
      '',
    ]),
    fileObjectBuilder(`${componentName}.styled.js`, [
      'import styled from \'styled-components\';',
      '',
      `const Container = styled.${styledTagBuilder(name)}\`${styleBuilder(styles)}\`;`,
      '',
      'export default Container;',
      '',
    ]),
    fileObjectBuilder(`${componentName}.jsx`, [
      childImportsBuilder(DOM, folder, attr),
      `import Container from './${componentName}.styled';`,
      '',
      `const ${componentName} = ({ children${destructPropsBuilder(passingProps)} }) => (`,
      `\t<Container${attributesInjector(attr)}>${childJSX}`,
      '\t\t{ children }',
      '\t</Container>',
      ');',
      '',
      `export default ${componentName};`,
      '',
    ]),
  ];

  if (jest) {
    files.push(fileObjectBuilder(`${componentName}.test.jsx`, [
      'import { render, screen } from \'@testing-library/react\';',
      'import { ReactNode } from \'react\';',
      'import { ThemeProvider } from \'styled-components\';',
      'import { theme } from \'../../../styles/theme\';',
      `import ${componentName} from '.';`,
      '',
      'const renderComponent = (children: ReactNode) =>',
      '\trender(<ThemeProvider theme={theme}>{children}</ThemeProvider>);',
      '',
      `describe('<${componentName} />', () => {`,
      '\tit(\'Should render the heading\', () => {',
      `\t\trenderComponent(<${componentName} />);`,
      '',
      `\t\texpect(screen.getByText(/${componentName}/i)).toBeInTheDocument();`,
      '\t})',
      '})',
      '',
    ]));
  }
  if (storybook) {
    files.push(fileObjectBuilder(`${componentName}.stories.jsx`, [
      "import { Story, Meta } from '@storybook/react/types-6-0';",
      `import ${componentName} from '.';`,
      '',
      'export default {',
      `\ttitle: '${componentName}',`,
      `\tcomponent: ${componentName}`,
      '} as Meta;',
      '',
      `export const Basic: Story = () => <${componentName} />;`,
    ]));
  }

  files.forEach(({ fileName, fileContent }) => {
    file.write(fileName, fileContent, filePath);
  });
  // return filePath;
};

module.exports = react;

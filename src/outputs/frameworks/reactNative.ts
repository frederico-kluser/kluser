import { attributesInjector } from '../../helpers/attributes';
import file from '../../helpers/file';
import { configGetAttribute } from '../../helpers/global';
import { childImportsBuilder, childTagBuilder, componentNameBuilder, destructPropsBuilder, fileObjectBuilder, styleBuilder, styledTagBuilder } from '../helpers';

const reactNative = (name, folder = 'ui', styles, attr, DOM, props) => {
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
      'import styled from \'styled-components/native\';',
      '',
      `const Container = styled.${styledTagBuilder(name)}\`${styleBuilder(styles)}\`;`,
      '',
      'export default Container;',
      '',
    ]),
    fileObjectBuilder(`${componentName}.js`, [
      'import React from \'react\'\n',
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
    files.push(fileObjectBuilder(`${componentName}.test.js`, [
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
    files.push(fileObjectBuilder(`${componentName}.stories.js`, [
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

export default reactNative;

# Documentation

## Prerequisites

- Basic familiarity with HTML & CSS.
- Node.js and npm installed globally.

## Setup and Installation

Globally install kluser in your system.

```sh
$ npm install -g kluser
```

In a React or React Native project, use the command below to generate the local configuration files of your project.

```sh
$ kluser
```

- Use the keyboard arrows to choose between React or React Native as output and press ENTER.
- Add the desired features pressing SPACE and ENTER to continue.
- Select the default folder where the components and pages will be generated (default: 'src').
- Choose whether you want to generate a Build or enter the Live Preview mode to see the default structure being generated inside the default folder.

![Alt Text](./usage.gif)

Note that a folder called kluser was created within your current directory.

```
kluser
├── .kluser.json
├── index.html
└── style.css
```

#### _.kluser.json_

Contains the project settings

#### _index.html_

File for tag creation

#### _style.css_

File for styles editing (within index.html Other style files can be created)

## Create your components

### how create pages ?

suponhamos que queremos criar uma página chamada 'Info'. basicamente, precisamos criar uma tag html, diretamente dentro do body (e não dentro de outras tags) passando o nome da página como id, ex:

```html
<div id="Info"></div>
```

como nosso código final usa o [styled-components](https://styled-components.com/) para criar estilos, a tag escolhida será usada no styled (styled.TAG``) ex:

```
const Container = styled.div``;
```

**result**:

```
const Info = ({ children }) => (
  <Container>
    {children}
  </Container>
);
```

para o framework React Native, possuimos uma limitação de tags aceitas, qualquer uma que não seja uma das tags abaixo será usada de maneira literal:

- div
- span
- p
- h1
- h2
- h3
- h4
- h5
- h6
- a
- img
- button
- input
- select
- option
- textarea

### how create components ?

da mesma maneira de criar uma página, mas precisa ser filha de uma página ou de outro componente, ex:

```html
<div id="Info">
  <h1 id="Title">Info Page</h1>
</div>
```

**result**:

```
const Info = ({ children }) => (
  <Container>
    <Title></Title>
    {children}
  </Container>
);
```

### how styling pages/components ?

inside the style.css file, just write your styles using id as selector, ex:

```css
#Info {
  position: absolute;
  top: 0;
  left: 0;
  ...;
}
```

###### you can use any kind os css selector, but is recommended to use id

## Create complex components

Usando o [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/) como analogia, vemos que todos nossos componentes se parecem com atomos (componentes que não encapsulam outros), o que torna nossas páginas mais verbosas. Para criar componentes moleculas (componentes que encapsulam outros), precisamos passar o attributo kluser_props para a tag html.

**Sem o attributo kluser_props, ex:**

```html
<div id="Info">
  <div id="Header">
    <h1 id="Title">Info Page</h1>
    <button id="BackButton"></button>
  </div>
</div>
```

```
const Info = ({ children }) => (
  <Container>
    <Header>
      <Title></Title>
      <BackButton></BackButton>
    </Header>
    {children}
  </Container>
);
```

**Com o attributo kluser_props, ex:**

```html
<div id="Info">
  <div id="Header" kluser_props>
    <h1 id="Title">Info Page</h1>
    <button id="BackButton"></button>
  </div>
</div>
```

```
const Info = ({ children }) => (
  <Container>
    <Header></Header>
    {children}
  </Container>
);
```

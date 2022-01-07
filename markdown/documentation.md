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

![Alt Text](usage.gif)

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

Suppose we want to create a page called 'Info'. Basically, we need to create an HTML tag directly inside the body passing the name of the page as **id**, ex:

```html
<body>
  <div id="Info"></div>
</body>
```

As our final code uses [styled-components](https://styled-components.com/) to create styles, the chosen tag will be used in styled (styled.TAG``) ex:

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

For Framework React Native, we have a limitation of accepted tags, any one other than one of the tags below will be used literally:

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

similarly to create a page, but need to be the child of a page or another component, ex:

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

###### you can use any kind of css selector, but is recommended to use id

## Create complex components

Using [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/) as an analogy, we see that all our components look like atoms (components that do not encapsulate others), which makes our page more verbose. To create molecule components (components that encapsulate others), we need to pass the kluser_props atttribute to the HTML tag.

**Without the attribute kluser_props, ex:**

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

**With the attribute kluser_props, ex:**

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

## Passing inner tag props

To pass props in our components we need within the kluser_props attribute, set the prop name with the dollar sign '\$' passing a value with the equal sign '=' and put this props within the child component, ex:

```html
<div id="Home">
  <div id="Header" kluser_props="$pageName='Info'">
    <h1 id="Title">$pageName Page</h1>
  </div>
</div>
```

**result**:

###### source/pages/Home/Home.jsx

```
const Home = ({ children }) => (
  <Container>
    <Header pageName="Home"></Header>
    {children}
  </Container>
);
```

###### source/components/Header/Header.jsx

```
const Header = ({ children, pageName }) => (
  <Container>
    <Title>{pageName} Page</Title>
    {children}
  </Container>
);
```

### Passing multiple props ?

only separates each prop with semicolon, ex:

```html
<div
  id="Header"
  kluser_props="$firstName='Frederico';$age=27;$brazilian=true"
></div>
```

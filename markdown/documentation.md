# Documentation

## Prerequisites

- Basic familiarity with HTML & CSS.
- Node.js and npm installed globally.

## Setup and Installation

Globally install kluser in your system.

```sh
$ npm install -g kluser
```

In a React or React Native project, use the following command to generate your project's local configuration files.

```sh
$ kluser
```

- Use the keyboard arrows to choose between React or React Native as the output and press ENTER.
- Add the desired features by pressing SPACE and ENTER to continue.
- Select the default folder in which to generate the components and pages (default: 'src').
- Choose whether to create a build or enter Live Preview mode to see the default structure that will be created in the default folder.

![Alt Text](usage.gif)

Note that a folder named kluser has been created in your current directory.

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

Let us say we want to create a page called 'Info'. To do this, we need to create an HTML tag directly in the body and pass the name of the page as **id**

```html
<body>
  <div id="Info"></div>
</body>
```

Since our final code uses [styled-components](https://styled-components.com/) to create styles, the chosen tag is used in styled (styled. TAG'')

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

For the React Native framework, we have a restriction on the accepted tags. Any tag other than one of those listed below will be used

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

similar to creating a page, but you must be the child of a page or other component

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

inside the style.css file, just write your styles with id as selector

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

Using [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/) as an analogy, we see that all of our components look like atoms (components that do not encapsulate others), which makes our page more detailed. To create molecule components (components that encapsulate other components), we need to pass the kluser_props attribute to the HTML tag.

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

To pass props in our components, inside the kluser_props attribute we need to set the prop name with the dollar sign '\$' and pass a value with the equal sign '=' and insert this prop into the child component

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

separates only each prop with semicolon:

```html
<div
  id="Header"
  kluser_props="$firstName='Frederico';$age=27;$brazilian=true"
></div>
```

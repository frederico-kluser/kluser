import file from './file'
import matrix from './matrix'

const { cwd } = require('process')
const inquirer = require('inquirer')
const { exec } = require('child_process') // have problems to use yarn

export const node = async (command = 'ls -la') =>
  new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`error: ${error.message}`))
        return
      }
      if (stderr) {
        reject(new Error(`stderr: ${stderr}`))
        return
      }
      resolve(`stdout: ${stdout}`)
    })
  })

export const prompt = async (
  message = 'Choose an option',
  type = 'input',
  choices = []
) =>
  new Promise((resolve, reject) => {
    inquirer
      .prompt([
        {
          choices,
          message,
          type,
          name: 'result'
        }
      ])
      .then(({ result }) => resolve(result))
      .catch(reject)
  })

export const npmExec = async commands => {
  let response: any = ''
  console.clear()
  matrix()
  try {
    if (typeof commands === 'string') {
      response = await node(commands)
    } else {
      for (let index = 0; index < commands.length; index += 1) {
        // eslint-disable-next-line no-await-in-loop
        response += await node(commands[index])
      }
    }
  } catch (e) {
    response = e
  }

  matrix(false)
  console.log(response)

  return response
}

const packageJsonConfig = async () => {
  const { read, write } = file
  const packageJson = JSON.parse(read(`${cwd()}/package.json`))

  packageJson.resolutions = packageJson.resolutions || {}
  packageJson.dependencies = packageJson.dependencies || {}
  packageJson.dependencies['styled-components'] = '^5.3.3'
  packageJson.resolutions['styled-components'] = '^5'

  packageJson.devDependencies = packageJson.devDependencies || {}
  packageJson.devDependencies['prettier'] = '^1.12.1'
  packageJson.devDependencies['jest'] = '^24.1.0'

  write('package.json', JSON.stringify(packageJson), `${cwd()}/`)
  node(`npx prettier --write ${cwd()}/package.json`)
}

export const setupProject = async () => {
  const framework = await prompt('Choose an framework', 'list', [
    'react',
    'reactNative'
  ])
  const allFeatures = ['jest', 'storybook']
  const arrFeatures: any = await prompt(
    'Choose the features',
    'checkbox',
    allFeatures
  )
  let features = ''
  allFeatures.forEach(feature => {
    features += `\n\t\t"${feature}": ${
      arrFeatures.indexOf(feature) !== -1 ? 'true' : 'false'
    },`
  })
  const outputFolder =
    (await prompt('Choose the output folder name: (src default)', 'input')) ||
    'src'

  // after ask jest/storybook to config if need
  packageJsonConfig()

  const html = `<!DOCTYPE html>\n<html lang="en">\n<head>\n\t<meta charset="UTF-8">\n\t<meta http-equiv="X-UA-Compatible" content="IE=edge">\n\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n\t<title>Kluser</title>\n\t<link rel="stylesheet" href="style.css">\n</head>\n<!-- Each Tag Direct Body Daughter will be a page -->\n<!-- The others will be components -->\n<!-- \n\tSupported Tags For React Native:\n\t\tdiv: "View",\n\t\tspan: "Text",\n\t\tp: "Text",\n\t\th1: "Text",\n\t\th2: "Text",\n\t\th3: "Text",\n\t\th4: "Text",\n\t\th5: "Text",\n\t\th6: "Text",\n\t\ta: "Text",\n\t\timg: "Image",\n\t\tbutton: "TouchableOpacity",\n\t\tinput: "TextInput",\n\t\tselect: "Picker",\n\t\toption: "Picker",\n\t\ttextarea: "TextInput",\n-->\n<body>\n\t<div id="Home">\n\t\t<div id="Header" kluser_props="$pageName='Home'">\n\t\t\t<h1 id="Title">$pageName Page</h1>\n\t\t</div>\n\t</div>\n</body>\n</html>`
  const css =
    '#Home {\n\tposition: absolute;\n\ttop: 0;\n\tleft: 0;\n\twidth: 100%;\n\theight: 100%;\n\tbackground-color: #fff;\n}\n\n#Header {\n\tposition: absolute;\n\ttop: 0;\n\tleft: 0;\n\twidth: 100%;\n\theight: 50px;\n\tbackground-color: lightcoral;\n\ttext-align: center;\n\tline-height: 50px;\n}\n\n#Title {\n\tfont-size: 15px;\n\tcolor: #fff;margin: 0px;\n}'
  const kluser = `{\n\t"folders": {\n\t\t"components": "components",\n\t\t"pages": "pages",\n\t\t"source": "${outputFolder}"\n\t},\n\t"features": {${features}\n\t\t"framework": "${framework}"\n\t}\n}`

  const { write } = file
  write('index.html', html, `${cwd()}/kluser/`)
  write('style.css', css, `${cwd()}/kluser/`)
  write('/.kluser.json', kluser, `${cwd()}/kluser/`)
}

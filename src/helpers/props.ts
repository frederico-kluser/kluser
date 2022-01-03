import { allPropsGetNames, allPropsGetValue } from './global'
import { replaceAll } from './string'

const formatPropName = propName => propName.substring(1, propName.length)

const propsFormatter = (props, func, separator = '') =>
  props
    ? props
        .split(';')
        .map(prop => func(prop))
        .join(separator)
    : ''

export const kluserDestructPropInjector = props =>
  propsFormatter(props, prop => {
    const propName = formatPropName(prop).split('=')[0]
    return propName ? `, ${propName}` : ''
  })

const checkValueIsProp = propValue =>
  allPropsGetValue(propValue) !== undefined
    ? formatPropName(propValue)
    : propValue

export const kluserPropInjector = props =>
  propsFormatter(props, prop => {
    const [propName, propValue] = prop.split('=')
    let result = ' '
    result += formatPropName(propName)

    if (propValue && propValue !== 'true') {
      result += '='
      result +=
        propValue.indexOf("'") === -1
          ? `{${checkValueIsProp(propValue)}}`
          : propValue
    }
    return result
  })

export const kluserPropStorybookInjector = props =>
  propsFormatter(props, prop => {
    const [propName, propValue] = prop.split('=')
    let result = `,\n\t${formatPropName(propName)}`

    result += ': '
    result +=
      propValue.indexOf("'") === -1
        ? `{${checkValueIsProp(propValue)}}`
        : propValue

    return result
  })

export const kluserPropTextInjector = string => {
  let result = string

  allPropsGetNames().forEach(propName => {
    result = replaceAll(result, propName, `{${formatPropName(propName)}}`)
  })

  return result
}

import { allPropsGetNames } from './global'
import { replaceAll } from './string'

const formatPropName = propName => propName.substring(1, propName.length)

export const kluserDestructPropInjector = props =>
  props
    ? props
        .split(';')
        .map(prop => {
          const propName = formatPropName(prop).split('=')[0]
          return propName ? `, ${propName}` : ''
        })
        .join('')
    : ''

const kluserPropsTypeFormater = (prop: string) => {
  const [propName, propValue] = prop.split('=')
  let result = formatPropName(propName)

  if (propValue && propValue !== 'true') {
    result += '='
    result += propValue.indexOf("'") === -1 ? `{${propValue}}` : propValue
  }
  return result
}

export const kluserPropInjector = props =>
  props
    ? props
        .split(';')
        .map(prop => ` ${kluserPropsTypeFormater(prop)}`)
        .join('')
    : ''

export const kluserPropTextInjector = string => {
  let result = string

  allPropsGetNames().forEach(propName => {
    result = replaceAll(result, propName, `{${formatPropName(propName)}}`)
  })

  return result
}

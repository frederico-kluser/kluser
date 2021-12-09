import { reservedHTMLAttributesType } from '../types'
import { allPropsGetNames } from './global'
import { replaceAll } from './string'

const reservedHTMLAttributes: reservedHTMLAttributesType[] = [
  'kluser_parent',
  'class',
  'id'
]

export const isReservedWords = (word: string): boolean => {
  let result = false

  reservedHTMLAttributes.forEach(reservedAttribute => {
    if (word === reservedAttribute) {
      result = true
    }
  })

  return result
}

export const isParentComponent = (attribute: any = {}) =>
  attribute.kluser_parent !== undefined

export const attributesInjector = (obj): string => {
  let attributes = '' // space from the tag name

  Object.keys(obj).forEach(property => {
    if (!isReservedWords(property)) {
      attributes += `${property}="${obj[property]}" `
    }
  })

  return attributes ? ` ${attributes}` : ''
}

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

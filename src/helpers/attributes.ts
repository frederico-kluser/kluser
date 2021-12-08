import { reservedHTMLAttributesType } from '../types'

const reservedHTMLAttributes: reservedHTMLAttributesType[] = [
  'kluser_props',
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
        .map(prop => `, ${formatPropName(prop)}`)
        .join('')
    : ''

export const kluserPropInjector = props =>
  props
    ? props
        .split(';')
        .map(prop => ` ${formatPropName(prop)}={${formatPropName(prop)}}`)
        .join('')
    : ''

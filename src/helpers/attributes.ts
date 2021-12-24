import { reservedHTMLAttributesType } from '../types'

const reservedHTMLAttributes: reservedHTMLAttributesType[] = [
  'kluser_isolate',
  'kluser_props',
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
  attribute.kluser_isolate !== undefined

export const attributesInjector = (obj): string => {
  let attributes = '' // space from the tag name

  Object.keys(obj).forEach(property => {
    if (!isReservedWords(property)) {
      attributes += `${property}="${obj[property]}" `
    }
  })

  return attributes ? ` ${attributes}` : ''
}

export const upperCaseFirstLetter = string =>
  string.charAt(0).toUpperCase() + string.slice(1)

export const capitalize = string =>
  string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()

export const isValidText = (str = '') => {
  let boolean = false
  const arr = str.split('')
  const nullCharacters = [' ', '\n', '\t']

  arr.forEach(charecter => {
    if (nullCharacters.indexOf(charecter) === -1) {
      boolean = true
    }
  })

  return boolean
}

export const cleanString = string => {
  let lastPosition = string.length
  const invalidCharacters = ['\n', '\t', ' ']

  for (let index = string.length - 1; index >= 0; index -= 1) {
    const char = string[index]
    if (
      invalidCharacters.indexOf(char) === -1 &&
      lastPosition === string.length
    ) {
      lastPosition = index
      break
    }
  }

  return string.substr(0, lastPosition + 1)
}

const escapeRegExp = string => string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&')
export const replaceAll = (str, find, replace) =>
  str.replace(new RegExp(escapeRegExp(find), 'g'), replace)

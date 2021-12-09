let config: string = ''
export const configGetAttribute = property => JSON.parse(config)[property]
export const configSetter = value => {
  config = value
}

const allProps = {}
export const allPropsGetNames = () => Object.keys(allProps)
export const allPropsGetValue = (key: string) => allProps[key]
export const allPropsSetter = kluserProps => {
  if (kluserProps) {
    kluserProps.split(';').forEach(prop => {
      const [key, value = ''] = prop.split('=')
      if (key) {
        allProps[key] = value
      }
    })
  }
}

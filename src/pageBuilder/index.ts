import { configGetAttribute } from '../helpers/global'
import elementBuilder from '../outputs'

const elementCreator = ({
  attr = {},
  child,
  props = [],
  style = {},
  tag,
  type
}: any) => {
  let localProps = props

  if (attr.kluser_props) {
    localProps = attr.kluser_props.split(';')
  }

  if (child) {
    child.forEach(element => {
      filterTags({ ...element, localProps })
    })
  }

  if (tag && attr.id) {
    const { framework } = configGetAttribute('features')
    elementBuilder[framework](tag, type, style, attr, child, props)
  }
}

const filterTags = (
  parentElement,
  type = configGetAttribute('folders').components
) => {
  if (parentElement.length) {
    parentElement.forEach(childElement => {
      elementCreator({ ...childElement, type })
    })
  } else {
    elementCreator({ ...parentElement, type })
  }
}

export default filterTags

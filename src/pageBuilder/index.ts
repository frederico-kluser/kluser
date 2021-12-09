import { configGetAttribute } from '../helpers/global'
import elementBuilder from '../outputs'

const elementCreator = ({ attr = {}, child, style = {}, tag, type }: any) => {
  if (child) {
    child.forEach(element => {
      filterTags(element)
    })
  }

  if (tag && attr.id) {
    const { framework } = configGetAttribute('features')
    elementBuilder[framework](tag, type, style, attr, child)
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

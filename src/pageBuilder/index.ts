/* eslint-disable max-len */
/* eslint-disable no-use-before-define */

import { configGetAttribute } from "../helpers/global";
import elementBuilder from "../outputs";

const elementCreator = ({
  attr = {}, child, props = [], style = {}, tag, type,
}: any) => {
  if (attr.kluser_props) {
    // eslint-disable-next-line no-param-reassign
    props = attr.kluser_props.split(';');
  }

  if (child) {
    child.forEach((element) => {
      filterTags({ ...element, props });
    });
  }

  if (tag && attr.id) {
    const { framework } = configGetAttribute('features');
    elementBuilder[framework](tag, type, style, attr, child, props);
  }
};

const filterTags = (parentElement, type = configGetAttribute('folders').components) => {
  if (parentElement.length) {
    parentElement.forEach((childElement) => {
      elementCreator({ ...childElement, type });
    });
  } else {
    elementCreator({ ...parentElement, type });
  }
};

export default filterTags;

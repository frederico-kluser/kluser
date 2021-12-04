// export types
export type reservedHTMLAttributesType =
  | 'kluser_props'
  | 'kluser_parent'
  | 'class'
  | 'id'

export type customObject = { [key: string]: string }

export interface HtmlNode {
  tag?: string
  attr?: customObject
  child?: HtmlNode[]
  node: 'element' | 'text'
  style?: customObject
  text?: string
}

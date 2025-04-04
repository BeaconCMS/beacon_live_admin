export type AstNode = AstElement | string

export interface AstElement {
  tag: string
  attrs: Record<string, string>
  content: AstNode[]
  rendered_html?: string
  arg?: string
}

export function isAstElement(node: AstNode): node is AstElement {
  return typeof node !== "string"
}

export interface ComponentCategory {
  id: ComponentCategoryId
  name: string
}

export interface MenuCategory {
  name: string
  items: ComponentCategory[]
}

export interface ComponentDefinition {
  id: ComponentDefinitionId
  name: string
  category: ComponentCategoryId
  thumbnail: string
  template: string
  example: string
}

export interface Component {
  definitionId: ComponentDefinitionId
  attributes: {
    id: string
    class: string[]
    href?: string
  }
  slot?: boolean
  content: (string | Component)[]
}

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
export enum ComponentCategoryId {
  html_tags = "html_tag",
  basic = "basics",
  data = "data",
  elements = "elements",
  media = "media",
}

export enum ComponentDefinitionId {
  nav_1 = "nav_1",
  nav_2 = "nav_2",
  nav_3 = "nav_3",
  nav_4 = "nav_4",
  header_1 = "header_1",
  header_2 = "header_2",
  header_3 = "header_3",
  signup_1 = "signup_1",
  signup_2 = "signup_2",
  signup_3 = "signup_3",
  stats_1 = "stats_1",
  stats_2 = "stats_2",
  stats_3 = "stats_3",
  footer_1 = "footer_1",
  footer_2 = "footer_2",
  footer_3 = "footer_3",
  signin_1 = "signin_1",
  signin_2 = "signin_2",
  signin_3 = "signin_3",
  title = "title",
  button = "button",
  link = "link",
  paragraph = "paragraph",
  aside = "aside",
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
export interface RootComponent extends Component {
  pageId: string
  rendered_html: string | null
}

export interface Layout {
  ast: AstNode[]
}
export interface PageInfo {
  id: string
  path: string
  site: string
  layoutId: string
  layout: Layout
  components: RootComponent[]
}
export interface Page extends PageInfo {
  ast: AstNode[]
}

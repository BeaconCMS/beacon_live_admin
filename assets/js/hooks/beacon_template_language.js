const BEACON_LANGUAGE_ID = "beacon"

const voidTags = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
])
const rawTextTags = new Set(["script", "style", "textarea", "title"])

function registerBeaconTemplateLanguage(monaco) {
  if (monaco.__beaconTemplateLanguageRegistered) {
    return
  }

  if (!monaco.languages.getLanguages().some((language) => language.id === BEACON_LANGUAGE_ID)) {
    monaco.languages.register({
      id: BEACON_LANGUAGE_ID,
      aliases: ["Beacon Template", "beacon"],
      mimetypes: ["text/x-beacon-template"],
    })
  }

  monaco.languages.setLanguageConfiguration(BEACON_LANGUAGE_ID, {
    comments: {
      blockComment: ["<!--", "-->"],
    },
    brackets: [
      ["<", ">"],
      ["{", "}"],
      ["(", ")"],
      ["[", "]"],
    ],
    autoClosingPairs: [
      { open: "{", close: "}" },
      { open: "(", close: ")" },
      { open: "[", close: "]" },
      { open: '"', close: '"', notIn: ["string"] },
      { open: "'", close: "'", notIn: ["string"] },
      { open: "{{", close: "}}" },
    ],
    surroundingPairs: [
      { open: '"', close: '"' },
      { open: "'", close: "'" },
      { open: "{", close: "}" },
      { open: "(", close: ")" },
      { open: "[", close: "]" },
    ],
  })

  monaco.languages.setMonarchTokensProvider(BEACON_LANGUAGE_ID, {
    tokenizer: {
      root: [
        [/<!--/, "comment", "@comment"],
        [/\{\{/, "delimiter.bracket", "@interpolation"],
        [/(<\/?)([A-Za-z][\w:-]*)/, ["delimiter.html", "tag"], "@tag"],
        [/[^<{]+/, ""],
      ],
      comment: [
        [/-->/, "comment", "@pop"],
        [/[^-]+/, "comment"],
        [/./, "comment"],
      ],
      interpolation: [
        [/\}\}/, "delimiter.bracket", "@pop"],
        [/\|[ \t]*[A-Za-z_][\w-]*/, "function"],
        [/"[^"]*"/, "string"],
        [/'[^']*'/, "string"],
        [/\b(true|false|nil|and|or|not|in)\b/, "keyword"],
        [/[A-Za-z_][\w.]*/, "variable"],
        [/[=!<>]=?|[+\-*/]/, "operator"],
        [/[{}()[\],.:|]/, "delimiter"],
        [/./, ""],
      ],
      tag: [
        [/\s+/, ""],
        [/\/?>/, "delimiter.html", "@pop"],
        [/([:@]?[A-Za-z_][\w:.-]*)(\s*=)/, ["attribute.name", "delimiter"]],
        [/[A-Za-z_][\w:.-]*/, "attribute.name"],
        [/"[^"]*"/, "attribute.value"],
        [/'[^']*'/, "attribute.value"],
        [/\{[^}]*\}/, "attribute.value"],
      ],
    },
  })

  monaco.languages.registerDocumentFormattingEditProvider(BEACON_LANGUAGE_ID, {
    provideDocumentFormattingEdits(model, options) {
      const formatted = formatBeaconTemplate(model.getValue(), options)

      if (!formatted || formatted === model.getValue()) {
        return []
      }

      return [
        {
          range: model.getFullModelRange(),
          text: formatted,
        },
      ]
    },
  })

  monaco.__beaconTemplateLanguageRegistered = true
}

function formatBeaconTemplate(source, options = {}) {
  try {
    const parser = new BeaconTemplateParser(source)
    const nodes = parser.parse()
    const indent = options.insertSpaces === false ? "\t" : " ".repeat(options.tabSize || 2)
    const formatted = formatNodes(nodes, 0, indent).join("\n")

    return formatted.length > 0 ? `${formatted}\n` : ""
  } catch (_error) {
    return null
  }
}

class BeaconTemplateParser {
  constructor(source) {
    this.source = source
    this.offset = 0
  }

  parse() {
    const nodes = this.parseNodes(null)
    this.skipWhitespace()

    if (!this.eof()) {
      throw new Error("unexpected trailing input")
    }

    return trimBoundaryWhitespace(nodes)
  }

  parseNodes(closingTag) {
    const nodes = []

    while (!this.eof()) {
      if (this.startsWith("</")) {
        const tag = this.parseClosingTag()

        if (!closingTag || tag.toLowerCase() !== closingTag.toLowerCase()) {
          throw new Error("mismatched closing tag")
        }

        return trimBoundaryWhitespace(nodes)
      }

      nodes.push(this.parseNode())
    }

    if (closingTag) {
      throw new Error("missing closing tag")
    }

    return trimBoundaryWhitespace(nodes)
  }

  parseNode() {
    if (this.startsWith("<!--")) {
      return this.parseComment()
    }

    if (this.startsWith("<!")) {
      return this.parseDeclaration()
    }

    if (this.startsWith("<?")) {
      return this.parseProcessingInstruction()
    }

    if (this.startsWith("<")) {
      return this.parseElement()
    }

    return this.parseText()
  }

  parseComment() {
    const finish = this.source.indexOf("-->", this.offset + 4)

    if (finish === -1) {
      throw new Error("unterminated comment")
    }

    const value = this.source.slice(this.offset, finish + 3)
    this.offset = finish + 3
    return { type: "comment", value }
  }

  parseDeclaration() {
    const finish = this.findTagEnd(this.offset + 2)

    if (finish === -1) {
      throw new Error("unterminated declaration")
    }

    const value = this.source.slice(this.offset, finish + 1)
    this.offset = finish + 1
    return { type: "declaration", value }
  }

  parseProcessingInstruction() {
    const finish = this.source.indexOf("?>", this.offset + 2)

    if (finish === -1) {
      throw new Error("unterminated processing instruction")
    }

    const value = this.source.slice(this.offset, finish + 2)
    this.offset = finish + 2
    return { type: "declaration", value }
  }

  parseElement() {
    const start = this.offset
    this.offset++
    const tag = this.parseTagName()
    const finish = this.findTagEnd(this.offset)

    if (finish === -1) {
      throw new Error("unterminated start tag")
    }

    const attrs = this.source.slice(this.offset, finish).trim()
    this.offset = finish + 1

    const selfClosing = attrs.endsWith("/")
    const normalizedAttrs = selfClosing ? attrs.slice(0, -1).trimEnd() : attrs
    const lowerTag = tag.toLowerCase()

    if (selfClosing || voidTags.has(lowerTag)) {
      return {
        type: "element",
        tag,
        attrs: normalizedAttrs,
        selfClosing,
        void: voidTags.has(lowerTag),
        children: [],
        source: this.source.slice(start, this.offset),
      }
    }

    if (rawTextTags.has(lowerTag)) {
      const closing = `</${tag}>`
      const closeOffset = this.source.toLowerCase().indexOf(closing.toLowerCase(), this.offset)

      if (closeOffset === -1) {
        throw new Error("missing raw text closing tag")
      }

      const rawText = this.source.slice(this.offset, closeOffset)
      this.offset = closeOffset + closing.length

      return {
        type: "element",
        tag,
        attrs: normalizedAttrs,
        rawText,
        children: [],
      }
    }

    const children = this.parseNodes(tag)

    return {
      type: "element",
      tag,
      attrs: normalizedAttrs,
      children,
    }
  }

  parseClosingTag() {
    this.offset += 2
    this.skipWhitespace()
    const tag = this.parseTagName()
    this.skipWhitespace()

    if (!this.startsWith(">")) {
      throw new Error("unterminated closing tag")
    }

    this.offset++
    return tag
  }

  parseTagName() {
    const start = this.offset

    while (!this.eof() && /[A-Za-z0-9_:-]/.test(this.source[this.offset])) {
      this.offset++
    }

    if (start === this.offset) {
      throw new Error("expected tag name")
    }

    return this.source.slice(start, this.offset)
  }

  parseText() {
    const finish = this.findTextEnd()
    const end = finish === -1 ? this.source.length : finish
    const value = this.source.slice(this.offset, end)
    this.offset = end
    return { type: "text", value }
  }

  findTextEnd() {
    let inInterpolation = false

    for (let i = this.offset; i < this.source.length; i++) {
      if (!inInterpolation && this.source.startsWith("{{", i)) {
        inInterpolation = true
        i++
      } else if (inInterpolation && this.source.startsWith("}}", i)) {
        inInterpolation = false
        i++
      } else if (!inInterpolation && this.source[i] === "<") {
        return i
      }
    }

    if (inInterpolation) {
      throw new Error("unterminated interpolation")
    }

    return -1
  }

  findTagEnd(start) {
    let quote = null
    let braceDepth = 0

    for (let i = start; i < this.source.length; i++) {
      const char = this.source[i]

      if (quote) {
        if (char === "\\" && i + 1 < this.source.length) {
          i++
        } else if (char === quote) {
          quote = null
        }
      } else if (char === '"' || char === "'") {
        quote = char
      } else if (char === "{") {
        braceDepth++
      } else if (char === "}") {
        braceDepth = Math.max(0, braceDepth - 1)
      } else if (char === ">" && braceDepth === 0) {
        return i
      }
    }

    return -1
  }

  skipWhitespace() {
    while (!this.eof() && /\s/.test(this.source[this.offset])) {
      this.offset++
    }
  }

  startsWith(token) {
    return this.source.startsWith(token, this.offset)
  }

  eof() {
    return this.offset >= this.source.length
  }
}

function formatNodes(nodes, depth, indent) {
  return nodes.flatMap((node) => formatNode(node, depth, indent)).filter((line) => line !== null)
}

function formatNode(node, depth, indent) {
  const prefix = indent.repeat(depth)

  if (node.type === "text") {
    const text = normalizeText(node.value)
    return text ? [`${prefix}${text}`] : []
  }

  if (node.type === "comment" || node.type === "declaration") {
    return [`${prefix}${node.value.trim()}`]
  }

  if (node.type !== "element") {
    return []
  }

  const attrs = node.attrs ? ` ${node.attrs}` : ""

  if (node.selfClosing) {
    return [`${prefix}<${node.tag}${attrs} />`]
  }

  if (node.void) {
    return [`${prefix}<${node.tag}${attrs}>`]
  }

  if (typeof node.rawText === "string") {
    const rawText = node.rawText.trim()

    if (rawText === "") {
      return [`${prefix}<${node.tag}${attrs}></${node.tag}>`]
    }

    if (!rawText.includes("\n")) {
      return [`${prefix}<${node.tag}${attrs}>${rawText}</${node.tag}>`]
    }

    return [
      `${prefix}<${node.tag}${attrs}>`,
      ...rawText.split("\n").map((line) => `${indent.repeat(depth + 1)}${line.trimEnd()}`),
      `${prefix}</${node.tag}>`,
    ]
  }

  if (node.children.length === 0) {
    return [`${prefix}<${node.tag}${attrs}></${node.tag}>`]
  }

  const inlineText = inlineChildren(node.children)

  if (inlineText !== null && inlineText.length + node.tag.length + attrs.length < 120) {
    return [`${prefix}<${node.tag}${attrs}>${inlineText}</${node.tag}>`]
  }

  return [`${prefix}<${node.tag}${attrs}>`, ...formatNodes(node.children, depth + 1, indent), `${prefix}</${node.tag}>`]
}

function inlineChildren(children) {
  const parts = []

  for (const child of children) {
    if (child.type !== "text") {
      return null
    }

    const text = normalizeText(child.value)

    if (text) {
      parts.push(text)
    }
  }

  return parts.join(" ")
}

function normalizeText(text) {
  return text.replace(/\s+/g, " ").trim()
}

function trimBoundaryWhitespace(nodes) {
  let start = 0
  let end = nodes.length

  while (start < end && isWhitespaceText(nodes[start])) {
    start++
  }

  while (end > start && isWhitespaceText(nodes[end - 1])) {
    end--
  }

  return nodes.slice(start, end)
}

function isWhitespaceText(node) {
  return node.type === "text" && node.value.trim() === ""
}

export { BEACON_LANGUAGE_ID, formatBeaconTemplate, registerBeaconTemplateLanguage }

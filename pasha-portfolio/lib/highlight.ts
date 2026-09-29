type Lang = 'html' | 'css' | 'js'
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const JS_KW = 'let|const|var|function|return|if|else|for|while|of|in|new|true|false|null|undefined|class|import|from|export|async|await|this'
const rules: Record<Lang, [RegExp, string[]]> = {
  html: [/(<!--[\s\S]*?-->)|(<\/?[\w-]+)|(\s[\w-]+)(?==)|("[^"]*"|'[^']*')|(\/?>)/g, ['com', 'tag', 'attr', 'str', 'tag']],
  css: [/(\/\*[\s\S]*?\*\/)|("[^"]*"|'[^']*')|(#[0-9a-fA-F]{3,8}\b|\b\d+\.?\d*(?:px|rem|em|%|vh|vw|s|ms|deg)?)|([\w-]+)(?=\s*:)|([.#][\w-]+|(?<![\w-])[a-z][\w-]*(?=[^{};]*\{))/g, ['com', 'str', 'num', 'attr', 'tag']],
  js: [new RegExp(`(\\/\\/.*|\\/\\*[\\s\\S]*?\\*\\/)|("(?:\\\\.|[^"\\\\])*"|'(?:\\\\.|[^'\\\\])*'|\`(?:\\\\.|[^\`\\\\])*\`)|\\b(\\d+\\.?\\d*)\\b|\\b(${JS_KW})\\b|([A-Za-z_$][\\w$]*)(?=\\()`, 'g'), ['com', 'str', 'num', 'kw', 'fn']]
}
export function highlight(code: string, lang: Lang) {
  const [re, cls] = rules[lang]
  let out = '', last = 0
  code.replace(re, (m: string, ...g: unknown[]) => {
    const idx = (g.slice(0, cls.length) as (string | undefined)[]).findIndex(x => x !== undefined)
    const at = g[cls.length] as number
    out += esc(code.slice(last, at)) + `<span class="t-${cls[idx]}">${esc(m)}</span>`
    last = at + m.length
    return m
  })
  return out + esc(code.slice(last)) + '\n'
}

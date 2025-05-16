import { marked } from 'marked'
import DOMPurify from 'dompurify'
import Prism from 'prismjs'

import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-markup'

import 'prismjs/themes/prism.css'

export default function renderMarkdown(markdown) {
  if (!markdown) return ''

  const renderer = new marked.Renderer()

  renderer.code = (code, language) => {
    // Ensure code is a string
    const codeStr = typeof code === 'string' ? code : String(code)

    const lang = Prism.languages[language] ? language : 'plaintext'
    const html = Prism.highlight(codeStr, Prism.languages[lang], lang)
    return `<pre class="language-${lang}"><code class="language-${lang}">${html}</code></pre>`
  }

  marked.setOptions({
    renderer,
    gfm: true,
    breaks: true,
    smartypants: true,
  })

  const rawHtml = marked.parse(markdown)
  const cleanHtml = DOMPurify.sanitize(rawHtml, {
    ADD_ATTR: ['class'],
    ADD_TAGS: ['mark'],
  })

  return cleanHtml
}

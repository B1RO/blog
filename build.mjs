import esbuild from 'esbuild'
import mdx from '@mdx-js/esbuild'
import { promises as fs } from 'fs'
import path from 'path'

const contentDir = path.resolve('content')
const distDir = path.resolve('dist')

await fs.mkdir(distDir, { recursive: true })

const files = (await fs.readdir(contentDir)).filter(f => f.endsWith('.mdx'))

const style = `<style>\n  body { max-width: 800px; margin: 0 auto; }\n  p:first-of-type { color: gray; }\n</style>`

let links = ''
for (const file of files) {
  const name = path.parse(file).name
  const tempEntry = path.join(distDir, `entry-${name}.tsx`)
  const relativeMdxPath = path.relative(distDir, path.join(contentDir, file))
  const entry = `import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport Content from './${relativeMdxPath.replace(/\\/g, '/') }';\nconst root = ReactDOM.createRoot(document.getElementById('root'));\nroot.render(<Content />);`
  await fs.writeFile(tempEntry, entry)

  await esbuild.build({
    entryPoints: [tempEntry],
    bundle: true,
    minify: true,
    outfile: path.join(distDir, `${name}.js`),
    plugins: [mdx()],
    write: true,
  })

  await fs.unlink(tempEntry)

  const html = `<!DOCTYPE html>\n<html>\n<head>\n  <title>${name}</title>\n  ${style}\n</head>\n<body>\n  <div id="root"></div>\n  <script src="${name}.js"></script>\n</body>\n</html>`
  await fs.writeFile(path.join(distDir, `${name}.html`), html)
  links += `  <li><a href="${name}.html">${name}</a></li>\n`
}

const indexHtml = `<!DOCTYPE html>\n<html>\n<head>\n  <title>Blog</title>\n  ${style}\n</head>\n<body>\n  <h1>Blog Posts</h1>\n  <ul>\n${links.trim()}\n  </ul>\n</body>\n</html>`

await fs.writeFile(path.join(distDir, 'index.html'), indexHtml)

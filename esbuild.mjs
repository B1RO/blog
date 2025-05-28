import esbuild from 'esbuild';
import mdx from "@mdx-js/esbuild"
import fs from "fs"

const style = `<style>\n  body { max-width: 800px; margin: 0 auto; }\n  p:first-of-type { color: gray; }\n</style>`

esbuild
  .build({
    entryPoints: ['src/index.tsx'],
    bundle: true,
    minify: true,
    target : ["chrome58"],
    outfile: 'dist/index.js',
    plugins : [mdx()]
  })
  
  .catch(() => process.exit(1));

// Then write the HTML file
const html = `
<!DOCTYPE html>
<html>
<head>
  <title>My App</title>
  ${style}
</head>
<body>
  <div id="root"/>
  <script src="index.js"></script>
</body>
</html>
`;

if (!fs.existsSync('dist')){
  fs.mkdirSync('dist');
}

fs.writeFile('dist/index.html', html, err => {
  if (err) {
    console.error('Error writing file', err);
  } else {
    console.log('Successfully wrote file');
  }
})
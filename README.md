# MDX Blog

Place your `.mdx` files inside the `content/` folder. Running `npm run build` converts each file to an HTML page in `dist/` and creates an index page linking to them. Any other files in `content/` (like images) are copied to `dist/` so you can reference them from your posts.

Serve the generated site locally with:

```bash
npm run build
npm run serve
```

A GitHub Actions workflow in `.github/workflows/deploy.yml` builds the site and publishes the `dist/` folder to GitHub Pages whenever you push to the `master` branch.


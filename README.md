# Notiverse
Obsidian Mathematics Notes
Inspired by Pikachu345

#README

## Local Website

This vault now builds into a public Obsidian-style static site.

```bash
npm install
npm run dev
```

Open `http://localhost:4173`. While the dev server is running, edits to root-level
Markdown notes or `.obsidian` config rebuild the site and refresh the browser.

For a one-time production build:

```bash
npm run build
```

The generated website lives in `docs/`, which GitHub Pages can publish directly.
The included GitHub Actions workflow also builds and deploys automatically after
pushes to `main`.

# Dev Master Tracker

A retro-themed developer skill roadmap tracker. 50+ topics (languages, frontend,
backend, data, architecture, cloud/DevOps and full-stack tracks), each with a
curriculum of sections and skills. Click any skill for: Meaning, Diagram, Code,
Pros/Cons, Industry use, and YouTube video resources. Progress is saved in your
browser (localStorage).

## Run it locally

Requirements: Node.js 18+ and npm.

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Build for production (deploy as a static website)

```bash
npm run build      # outputs a static site to ./dist
npm run preview    # preview the production build locally
```

The `dist/` folder is a plain static site - host it anywhere
(Netlify, Vercel, GitHub Pages, S3, nginx, ...).

## Project structure

```
dev-master-tracker/
  index.html                 # loads fonts + the React entry
  vite.config.js             # Vite + React plugin
  src/
    main.jsx                 # React entry point
    index.css                # base page styling
    DevMasterTracker.jsx     # the whole app (data + UI)
```

All topic data lives in the `TOPICS` array inside `src/DevMasterTracker.jsx`.
To add or expand a topic, edit that array - each topic has `sections`
(the curriculum) and an optional `detail` map of richly written skills.

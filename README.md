# WAJ.DEV - Portfolio

A high-performance, interaction-heavy portfolio site for a Founding Engineer / Product Engineer.
Built with a "System Core" aesthetic, focusing on raw technical precision and fluid interactivity.

## Tech Stack
*   **Framework**: Astro (Migrated from Vanilla HTML/JS)
*   **Core**: Semantic HTML5, CSS3, Vanilla JavaScript
*   **Animation**: GSAP (GreenSock) Core + ScrollTrigger
*   **Graphics**: HTML5 Canvas (Geometric Mesh Background)
*   **Fonts**: Space Grotesk (Display), Manrope (Body), JetBrains Mono (Code/Accents)

## Key Features
*   **Single Page Architecture**: Smooth scrolling main page with deep-linkable sections.
*   **Dynamic Background**: Interactive geometric wave (Canvas) with mouse-reactive physics and smooth color lerping.
*   **Interactive UI**:
    *   "Decipher" text scrambling effect on hover (Smart Casing).
    *   Magnetic buttons and hover states.
    *   GSAP-driven timeline/trajectory animation.
*   **Bento Grid**: Masonry-style layout for selected work.

## Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/       # Static assets (images, css, js)
├── src/
│   ├── components/ # Reusable `.astro` components
│   └── pages/      # Route pages (`index.astro`, `project_*.astro`)
└── package.json
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |

## Deployment

This project is configured to auto-deploy to **GitHub Pages** using GitHub Actions.
Any push to `main` triggers the workflow defined in `.github/workflows/deploy.yml`.

To configure:
1.  Go to Repo Settings > Pages.
2.  Select **GitHub Actions** as the source.

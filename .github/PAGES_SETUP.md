# GitHub Pages Setup Instructions

This repository is configured to automatically deploy the demo site to GitHub Pages using GitHub Actions.

## One-Time Setup Required

To enable GitHub Pages for this repository, follow these steps:

1. Go to your repository on GitHub
2. Click on **Settings** (⚙️)
3. In the left sidebar, click on **Pages**
4. Under "Build and deployment":
   - **Source**: Select "GitHub Actions"
   - (The workflow file `.github/workflows/deploy.yml` will handle the rest)
5. Save the changes

## After Setup

Once configured, the demo site will automatically deploy to:
**https://codepen.github.io/sliderVars/**

Every push to the `main` branch will trigger a new deployment.

You can also manually trigger a deployment by:
1. Going to the **Actions** tab
2. Selecting the "Deploy to GitHub Pages" workflow
3. Clicking "Run workflow"

## Local Testing

To test the demo site build locally:

```bash
npm run build:demo
```

This creates a production build in the `docs/` folder. You can preview it with:

```bash
npx vite preview --outDir docs --port 3000
```

## Notes

- The `docs/` folder is ignored by git (it's built by GitHub Actions)
- The demo uses the base path `/sliderVars/` for GitHub Pages project page URLs
- The library build (`npm run build`) is separate and outputs to `dist/`


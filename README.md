# Original
A minimal Greek New Testament and Hebrew Old Testament PWA.

## Automatic build
GitHub Actions checks out MACULA Greek and MACULA Hebrew (with Git LFS), converts their word-level TSV data into chapter JSON, validates plausible chapter counts, and deploys the static site to GitHub Pages.

### GitHub Pages setup
Repository Settings → Pages → Build and deployment → Source: **GitHub Actions**.

The workflow can be run automatically by pushing to `main`, or manually from Actions → Build and deploy Original → Run workflow.

## Data
MACULA Greek and MACULA Hebrew are maintained by Clear Bible. See the upstream repositories for their full licences and attribution requirements. The build does not commit upstream corpora into this repository; it retrieves them at build time.

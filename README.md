# Kahraman Life & Data Science Consulting — Website

Professional website for **Kahraman Life and Data Science Consulting**, built as a static site ready for GitHub Pages hosting.

## Files

```
index.html   — Main HTML (single page)
style.css    — All styles
script.js    — Interactions: canvas animation, scroll effects, contact form
```

## Deploy to GitHub Pages (5 minutes)

1. **Create a GitHub repository** — go to github.com → New repository
   - Name it: `kahraman-consulting` (or any name you like)
   - Set to **Public**
   - Do NOT initialize with README (you already have files)

2. **Upload the files**
   - In the new repo, click "Add file" → "Upload files"
   - Drag and drop: `index.html`, `style.css`, `script.js`
   - Commit directly to `main`

3. **Enable GitHub Pages**
   - Go to repo **Settings** → **Pages** (left sidebar)
   - Under "Source", select **Deploy from a branch**
   - Branch: `main`, Folder: `/ (root)`
   - Click **Save**

4. **Your site is live** at:
   `https://YOUR-GITHUB-USERNAME.github.io/kahraman-consulting/`
   (Takes ~1–2 minutes to deploy)

## Custom domain (optional)

If you want `consulting.kahramanlab.org` or similar:
1. Add a `CNAME` file to the repo with your domain name (one line)
2. Configure your DNS provider to point to `YOUR-USERNAME.github.io`
3. Set the custom domain in GitHub Pages settings

## Contact form setup

The contact form currently falls back to a `mailto:` link. To receive form submissions as emails:

1. Go to [formspree.io](https://formspree.io) and create a free account
2. Create a new form → copy the Form ID (e.g. `xpwzgkve`)
3. In `script.js`, find this line:
   ```js
   const FORMSPREE_ID = ''; // Add your Formspree form ID here
   ```
   And change it to:
   ```js
   const FORMSPREE_ID = 'xpwzgkve'; // your actual ID
   ```
4. Commit the change — form submissions will now arrive in your email inbox

## Customisation

- **Email address**: Search `abdullah.kahraman@fhnw.ch` in `script.js` and update
- **Colors**: All design tokens are CSS variables at the top of `style.css`
- **Content**: All text is in `index.html` — no build step needed
- **Add your photo**: Replace the `AK` avatar in the contact section with an `<img>` tag

## Tech stack

Pure HTML + CSS + Vanilla JS. No frameworks, no build step, no dependencies.
Loads fast, works offline, and deploys anywhere.

# Personal Digital Art Commission

Standalone static page for a personal digital art commission configurator.

## Contents

- `index.html` - standalone entry page.
- `assets/art-commission/art-commission.js` - renderer, pricing state, prompt builder, and image-generation request logic.
- `assets/art-commission/hero.jpg` - top artwork crop.
- `assets/art-commission/footer.jpg` - bottom artwork crop.

## Deploy

This project is static HTML/CSS/JS and can be deployed directly to Cloudflare Pages from the repository root.

The image generation panel calls an OpenAI-compatible `/images/generations` endpoint from the browser. It requires the user to provide their own API base URL, image model, and API key.

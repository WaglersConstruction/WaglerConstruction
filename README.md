# Wagler's Amish Construction Website

A fast, dependency-free static website hosted on GitHub Pages at
[waglersamishconstruction.com](https://waglersamishconstruction.com/).

## Structure

- `index.html` — homepage and Formspree estimate form
- `thank-you.html` — form confirmation page
- `assets/styles.css` — complete responsive styling
- `assets/script.js` — mobile navigation, footer year, and gallery loading
- `assets/images/` — optional project photos

## Adding project photos

Add up to eight optimized JPEG images named `project-01.jpg` through
`project-08.jpg` inside `assets/images/`. The gallery automatically displays a
styled placeholder whenever an expected photo is not present. For good page
speed, resize images to roughly 1200–1600 pixels wide and compress them before
committing.

The contact form uses the existing Formspree endpoint. Do not change its form
action unless the business intentionally moves to a different Formspree form.

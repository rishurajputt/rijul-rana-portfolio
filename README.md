# Rijul Rana — Portfolio

Static HTML portfolio for **Rijul Rana**, Digital Marketing Specialist & Sr. SEO Analyst.

## Tech Stack

- HTML5
- CSS3 (custom properties, glassmorphism, responsive layout)
- Vanilla JavaScript
- Three.js (3D hero background)
- GSAP + ScrollTrigger (scroll animations)

## Deploy on Vercel

1. Push this folder to GitHub.
2. Import the repo at [vercel.com](https://vercel.com) → **Add New Project**.
3. No build command needed — Vercel will serve the static files.
4. Set **Output Directory** to `.` (root).

## Contact Form (receive submissions by email)

The form uses [Web3Forms](https://web3forms.com) — free for static sites, no backend required.

1. Go to [web3forms.com](https://web3forms.com) and create a free account.
2. Enter your email (`iamrishuuux@gmail.com`) to get an **Access Key**.
3. Open `index.html` and replace `YOUR_WEB3FORMS_ACCESS_KEY` on the contact form:

```html
<form ... data-access-key="paste-your-key-here">
```

When someone submits the form, Web3Forms sends the message directly to your inbox.

## Getting Started

No build step required. Open `index.html` in your browser, or serve the folder locally:

```bash
# Python
python -m http.server 8080

# Node (if you have npx)
npx serve .
```

Then open [http://localhost:8080](http://localhost:8080).

## Project Structure

```
index.html      — Main page
style.css       — All styles (dark/light themes)
script.js       — Interactions, 3D scene, animations
images/         — Profile photos
resume/         — Resume PDF for download
```

## Profile Photo

Your photo is used from:

```
images/rijul-rana.png
```

## Resume Download

Place your resume PDF at:

```
resume/rijul-rana-resume.pdf
```

The **Download Resume** buttons will save it as `Rijul-Rana-Resume.pdf`.

## Features

- Dark / light theme toggle (saved in browser)
- 3D animated hero background
- Scroll reveal animations
- Animated skill bars & timeline
- Contact form (opens email client)
- Fully responsive layout

## Contact

- **Email:** iamrishuuux@gmail.com
- **Phone:** +91 8626885808
- **LinkedIn:** https://www.linkedin.com/in/rijul-rana
- **Location:** Chandigarh, India

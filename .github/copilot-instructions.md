# GitHub Copilot – Project Prompt for triviaquiz.games

## Context
This is the code for **triviaquiz.games**, an SEO-optimised quiz website + PWA.
Goal: generate static SEO pages while enabling User-Generated Content (UGC).

---

## Architecture Principles
- Use **static HTML pages** wherever possible (SEO!).
- Keep everything **lightweight** – no unnecessary frameworks.
- Maintain **PWA compatibility**.
- **No third-party scripts** except Firebase (Firestore).
- Dark-mode design using existing CSS variables in `css/style.css`.
- Mobile-first responsive layout.

## Stack
- Vanilla HTML / CSS / JS
- Firebase Firestore (for UGC form submissions and community question reads)
- Firebase config lives in `js/firebase-config.js` (never commit real keys to public repos)

---

## Pages & Features Copilot Should Support

### A) Submit Page (`/submit`)
- HTML form with fields: `question`, `answer`, `category`, optional `author`
- POST data to Firebase Firestore via the modular JS SDK
- Minimalistic, accessible, responsive
- SEO intro text above the form
- Success / error feedback without page reload

### B) Community Questions Page (`/community-questions`)
- Load submitted questions from Firestore
- Render as `<ul>` with `<li>` per question: question, answer, category, (optional) author
- Client-side pagination (10 per page)
- SEO-optimised intro text
- Internal links to quiz start pages

---

## SEO Rules – Every Page Must Have
- `<title>` containing the target keyword
- `<meta name="description">` with compelling copy
- `<h1>` with the primary keyword
- No duplicate titles across pages
- Semantic HTML structure (`<header>`, `<main>`, `<footer>`, `<section>`, `<nav>`)
- Internal links: Home → Submit → Community Questions → Quiz start pages

## Internal Link Map
| From | To |
|------|----|
| `index.html` | `submit/index.html`, `community-questions/index.html` |
| `submit/index.html` | `community-questions/index.html`, `index.html` |
| `community-questions/index.html` | `https://bitcoin.triviaquiz.games`, `https://boardgame.triviaquiz.games`, `submit/index.html` |

---

## Code Style
- Clear, minimalist, **Vanilla HTML/CSS/JS** only
- No unnecessary dependencies
- Comments: sparse but meaningful
- Reuse existing CSS classes from `css/style.css` wherever possible
- Use the existing CSS variables: `--primary-color`, `--secondary-color`, `--accent-color`, `--dark-bg`, `--card-bg`, `--light-text`, `--gray-text`

---

## What Copilot MAY Do Automatically
- Generate boilerplate for new static pages (reuse header/footer pattern from `index.html`)
- Suggest SEO copy
- Generate forms with Firebase write logic
- Create JSON structures for community questions
- Write small utility functions (sorting, pagination, debounce)
- Suggest internal linking opportunities

## What Copilot Must NOT Do
- Suggest complex frameworks (React, Vue, Next.js, etc.)
- Set up server-side rendering
- Add analytics scripts
- Add external libraries without a clear reason
- Commit Firebase credentials

---

## Example Tasks Copilot Should Solve
- "Create a new page /submit with form and SEO text."
- "Generate a paginated list from Firestore questions."
- "Build pagination for the community-questions page."
- "Create internal links between all relevant pages."
- "Write a minimal CSS layout for a form page."

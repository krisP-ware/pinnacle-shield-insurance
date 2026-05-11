# Pinnacle Shield Insurance
**Capstone Project #1** — A multi-page static insurance company website built with HTML, CSS, and JavaScript using Bootstrap 5.

---

## 📁 Project Structure

```
pinnacle-shield-insurance/
├── index.html        # Homepage (fully built)
├── about.html        # About Us page (placeholder)
├── quote.html        # Get a Quote page (placeholder)
├── faq.html          # FAQ page (placeholder)
├── css/
│   └── styles.css    # Custom stylesheet
├── js/
│   ├── main.js       # Site-wide JavaScript (smooth scroll, active nav)
│   └── quote.js      # Quote page script (placeholder)
└── README.md
```

---

## 📄 Pages

| File | Status | Description |
|---|---|---|
| `index.html` | ✅ Complete | Full homepage with nav, hero, cards, insurance plans, and footer |
| `about.html` | 🔲 Placeholder | About Us page — to be built |
| `quote.html` | 🔲 Placeholder | Get a Quote form page — to be built |
| `faq.html` | 🔲 Placeholder | Frequently Asked Questions — to be built |

---

## 🏠 Homepage (`index.html`)

The homepage is fully implemented and contains the following sections:

### Navigation Bar
- Built with Bootstrap 5 (`navbar-expand-lg navbar-dark bg-dark`)
- Displays the company brand name: **Pinnacle Shield Insurance**
- Links to all four pages: Home, Get a Quote, About Us, FAQ
- Collapses into a hamburger menu on small screens
- Active page is highlighted automatically via JavaScript

### Hero Section
- Earthy green gradient background (`#4a7c59` → `#2d5a3d`)
- Large white headline and subheading
- **"Get Your Free Quote"** call-to-action button (`btn-warning btn-lg`) that smoothly scrolls down to the insurance plans section

### Why Choose Us
- Three Bootstrap cards in a responsive `row`/`col-md-4` grid
- Highlights: ⚡ Fast Quotes, 🛡️ Trusted Coverage, 🕐 24/7 Support
- Cards lift on hover with a smooth `transform` + `box-shadow` transition

### Our Insurance Plans
- Three-column Bootstrap grid with custom styled cards
- Covers: 🚗 Auto Insurance, 🏠 Home Insurance, ❤️ Life Insurance
- Each card has a brief description and a "Get Quote" button

### Footer
- Dark background with amber top-border accent (consistent with the navbar)
- Company name and © 2026 copyright
- Quick navigation links
- Placeholder contact info (email, phone, address)

---

## 🎨 Stylesheet (`css/styles.css`)

- **CSS Reset** — `box-sizing: border-box`, zeroed margins/padding on all elements
- `html { scroll-behavior: smooth }` — native smooth scroll fallback
- Hero section styling — gradient background, centred text, responsive padding
- Card hover effects — `translateY` lift + `box-shadow` using CSS `transition`
- Footer styling — matches the navbar's dark/amber visual language
- **Media query** (`max-width: 767.98px`) — adjusts hero font sizes, card spacing, and footer layout on small screens

---

## ⚙️ JavaScript (`js/main.js`)

### Smooth Scroll
- Listens for clicks on any anchor link (`a[href^="#"]`)
- Animates scrolling using a custom **`requestAnimationFrame`** loop
- Uses an **easeInOutQuad** easing function for a natural feel (slow → fast → slow)
- Scroll duration is controlled by a single `SCROLL_DURATION` variable (default: `900ms`)
- Offsets scroll position by the navbar height to prevent headings from being hidden

### Active Nav Highlighting
- On page load, reads `window.location.pathname` to determine the current page filename
- Loops over all `.navbar-nav .nav-link` elements and adds the Bootstrap `active` class + `aria-current="page"` to the matching link
- Removes stale `active` classes from all non-matching links — works across all pages automatically

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Page structure and semantic markup |
| CSS3 | Custom styles, transitions, media queries |
| JavaScript (ES5/6) | Smooth scroll, active nav logic |
| [Bootstrap 5.3.2](https://getbootstrap.com/) | Responsive grid, navbar, cards, utility classes |

Bootstrap is loaded via CDN — no build tools or package manager required.

---

## 🚀 Running the Project

This is a fully static site — no server or build step needed.

1. Clone or download the repository
2. Open `index.html` in any modern browser
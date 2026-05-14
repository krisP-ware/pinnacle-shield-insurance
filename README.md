# 🛡️ Pinnacle Shield Insurance
**Capstone Project #1** — A multipage static insurance company website built with HTML, CSS, and JavaScript using Bootstrap 5.
**Created by:** Kris Penn
**Live Link:** [https://krisp-ware.github.io/pinnacle-shield-insurance/](https://krisp-ware.github.io/pinnacle-shield-insurance/)
---

## 📁 Project Structure

```
pinnacle-shield-insurance/
├── index.html        # Homepage
├── about.html        # About Us page
├── quote.html        # Get a Quote page
├── faq.html          # FAQ page
├── assets/
│   └── fox.jpg       # Team photo used on the About page
├── css/
│   └── styles.css    # Custom stylesheet (Clean Corporate Blue theme)
├── js/
│   ├── main.js       # Site-wide JS (smooth scroll, active nav)
│   └── quote.js      # Quote page logic (form, validation, calculation, results, localStorage)
└── README.md
```

---

## 📄 Pages

| File         | Status     | Description                                                            |
|--------------|------------|------------------------------------------------------------------------|
| `index.html` | ✅ Complete | Homepage — nav, hero, Why Choose Us, insurance plans, footer           |
| `quote.html` | ✅ Complete | Dynamic quote form with validation, calculation, results, save & print |
| `about.html` | ✅ Complete | Company overview, team cards, core values grid                         |
| `faq.html`   | ✅ Complete | Bootstrap accordion FAQ with live search/filter                        |

---

## 🏠 Homepage (`index.html`)

### Navigation Bar
- Bootstrap 5 `navbar-light bg-white` with border-bottom shadow
- Brand: **🛡️ Pinnacle Shield Insurance**
- Links to all four pages; collapses to a hamburger menu on mobile
- Active page highlighted automatically via JavaScript

### Hero Section
- Deep navy → brand blue → sky blue gradient (`#1e3a8a → #2563EB → #60a5fa`)
- Rounded corners (`border-radius: 20px`) and inset from viewport edges (`margin: 1.25rem`)
- Large white headline and subheading
- **"Get Your Free Quote"** CTA button smooth-scrolls to the `#insurance-plans` section

### Why Choose Us
- Three Bootstrap cards with `1.25rem` horizontal margins and `border-radius: 12px`
- Cards: ⚡ Fast Quotes, 🛡️ Trusted Coverage, 🕐 24/7 Support
- Cards lift on hover with `translateY(-6px)` + `box-shadow` transition

### Our Insurance Plans
- Three-column Bootstrap grid linking to `quote.html`
- Plans: 🚗 Auto Insurance, 🏠 Home Insurance, ❤️ Life Insurance

### Footer
- Dark background with quick nav links and company contact info

---

## 📋 Quote Page (`quote.html`)

### Form Progress Indicator
- Three-step visual stepper: **Select Type → Fill Details → View Quote**
- Step bubbles update state (default / active / completed `✓`) via `setFormStep(n)`
- Connector lines fill in as steps are completed

### Insurance Type Card Picker
- Three clickable radio cards: 🚗 Auto, 🏠 Home, ❤️ Life
- Uses Bootstrap `btn-check` pattern — hidden radio inputs with styled card labels
- Selecting a card reveals the relevant field section and hides the others

### Dynamic Form Fields

Shared fields (appear once a type is selected):
- **Email Address** — validated with `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- **Additional Notes** — optional textarea
- **Get My Quote** submit button

**Auto Insurance (9 fields)**

| Field          | Validation                                            |
|----------------|-------------------------------------------------------|
| Full Name      | Required, min 2 chars, digits blocked on input        |
| Age            | Required, 16–100                                      |
| ZIP Code       | Required, exactly 5 digits                            |
| Vehicle Year   | Required, 1990–2026                                   |
| Vehicle Make   | Required (select)                                     |
| Vehicle Model  | Required (text)                                       |
| Annual Mileage | Required (select)                                     |
| Driving Record | Required (select)                                     |
| Coverage Level | Required (radio cards) — Basic / Standard / Premium   |

**Home Insurance (10 fields)**

| Field             | Validation                                          |
|-------------------|-----------------------------------------------------|
| Full Name         | Required, min 2 chars, digits blocked on input      |
| Age               | Required, 18–100                                    |
| ZIP Code          | Required, exactly 5 digits                          |
| Home Value        | Required, min $50,000                               |
| Year Built        | Required, 1900–2026                                 |
| Square Footage    | Required, 500–10,000                                |
| Construction Type | Required (select)                                   |
| Security System   | Checkbox — 5% discount if checked                   |
| Fire Sprinklers   | Checkbox — 8% discount if checked                   |
| Coverage Level    | Required (radio cards) — Basic / Standard / Premium |

**Life Insurance (9 fields)**

| Field                   | Validation                                          |
|-------------------------|-----------------------------------------------------|
| Full Name               | Required, min 2 chars, digits blocked on input      |
| Age                     | Required, 18–85                                     |
| ZIP Code                | Required, exactly 5 digits                          |
| Gender                  | Required (select)                                   |
| Coverage Amount         | Required (select) — $100k / $250k / $500k / $1M     |
| Exercise Frequency      | Required (select)                                   |
| Smoker                  | Required (radio buttons)                            |
| Pre-existing Conditions | Checkbox — 50% surcharge if checked                 |
| Coverage Level          | Required (radio cards) — Basic / Standard / Premium |

### Results Card
- **Summary stats** — Name, insurance type, monthly premium, annual premium, email
- **Premium breakdown table** — one row per factor with the user's value and multiplier impact
- **Action buttons**: 🖨️ Print Quote, 💾 Save Quote, 🔄 Get Another Quote

### Save & Print
- **Print Quote** — `window.print()` with `@media print` CSS that hides form and UI chrome; shows company letterhead
- **Save Quote** — stores the full quote (including breakdown rows) in `localStorage` under `savedQuotes`
- **Saved Quotes section** — rendered on page load and after every save; newest first, with collapsible breakdown, 🖨️ Print and 🗑️ Delete per entry, and a 🗑️ Clear All button
- **Print Saved Quote** — builds a standalone HTML page as a `Blob` URL, opens it in a popup, and auto-triggers `window.print()`; revokes the object URL after load to avoid memory leaks

---

## 🧮 Quote Calculation Logic (`js/quote.js`)

### Auto Insurance
```
Monthly = $75 × Age factor × Vehicle age factor × Mileage factor × Driving record × Coverage
```
| Factor         | Values                                                                      |
|----------------|-----------------------------------------------------------------------------|
| Age            | Under 25: ×1.5 / 25–65: ×1.0 / Over 65: ×1.3                                |
| Vehicle Age    | Under 3 yrs: ×1.3 / 3–10 yrs: ×1.0 / Over 10 yrs: ×0.8                      |
| Mileage        | Under 5k: ×0.8 / 5–10k: ×1.0 / 10–15k: ×1.1 / 15–20k: ×1.3 / Over 20k: ×1.5 |
| Driving Record | Clean: ×1.0 / 1 ticket: ×1.2 / 2+ tickets: ×1.5 / Accident: ×1.8            |
| Coverage       | Basic: ×0.8 / Standard: ×1.0 / Premium: ×1.4                                |

### Home Insurance
```
Monthly = (Home value × 0.003 ÷ 12) × Year built × Construction × Coverage
        + (Square footage × $0.01)
        × Security discount × Sprinkler discount
```
| Factor          | Values                                                   |
|-----------------|----------------------------------------------------------|
| Year Built      | Before 1970: ×1.4 / 1970–1999: ×1.1 / 2000+: ×1.0        |
| Construction    | Wood: ×1.2 / Brick: ×1.0 / Concrete: ×0.9 / Steel: ×0.85 |
| Size surcharge  | +$0.01/sq ft/month (additive)                            |
| Security System | ×0.95 (−5% discount)                                     |
| Fire Sprinklers | ×0.92 (−8% discount)                                     |
| Coverage        | Basic: ×0.8 / Standard: ×1.0 / Premium: ×1.4             |

### Life Insurance
```
Monthly = (Coverage amount × 0.0005 ÷ 12) × Age × Smoker × Exercise × Pre-existing × Gender × Coverage
```
| Factor       | Values                                                   |
|--------------|----------------------------------------------------------|
| Age          | 18–30: ×1.0 / 31–45: ×1.5 / 46–60: ×2.5 / 61–85: ×4.0    |
| Smoker       | No: ×1.0 / Yes: ×2.0                                     |
| Exercise     | Rarely: ×1.3 / 1–2/wk: ×1.1 / 3–4/wk: ×1.0 / 5+/wk: ×0.9 |
| Pre-existing | No: ×1.0 / Yes: ×1.5                                     |
| Gender       | Male: ×1.1 / Female: ×1.0 / Non-binary: ×1.05            |
| Coverage     | Basic: ×0.8 / Standard: ×1.0 / Premium: ×1.4             |

---

## ✅ Form Validation (`js/quote.js`)

- Form uses `novalidate` — all validation handled in JavaScript
- All errors shown simultaneously on submit
- Invalid fields: `is-invalid` class (red border + inline message)
- Valid fields: `is-valid` class (green border)
- ZIP codes: `/^\d{5}$/` regex
- Numerics: `parseInt`/`parseFloat` + `isNaN` guard + range check
- Radio groups: dedicated `.type-card-invalid` / `.auto-coverage-invalid` etc. elements
- Name fields: digits silently stripped on `input` event via `replace(/[0-9]/g, '')`
- Full validation state cleared on "Get Another Quote" reset

---

## 🧑‍💼 About Page (`about.html`)

- Page banner matching the hero gradient (rounded, inset, `100px` vertical padding)
- **Company Overview** — founding story and mission statement
- **Meet the Team** — four circular team photo cards (`assets/fox.jpg`), name, title, and bio
- **Our Core Values** — six-card grid: Integrity, Customer First, Innovation, Community, Transparency, Excellence

---

## ❓ FAQ Page (`faq.html`)

- Page banner consistent with other interior pages
- **Live search bar** — filters accordion items in real time; shows a "no results" message when nothing matches
- **Bootstrap Accordion** — 8 questions covering coverage, quotes, claims, bundling, and cancellation

---

## 🎨 Stylesheet (`css/styles.css`)

### Color Palette — Clean Corporate Blue
| Variable              | Value     | Usage                         |
|-----------------------|-----------|-------------------------------|
| `--color-primary`     | `#2563EB` | Brand blue                    |
| `--color-accent`      | `#2563EB` | CTAs, highlights              |
| `--color-accent-dark` | `#1D4ED8` | Hover/active states           |
| `--color-bg`          | `#FFFFFF` | Page background               |
| `--color-bg-alt`      | `#F3F4F6` | Alternate section backgrounds |
| `--color-selected`    | `#EFF6FF` | Checked/open state tint       |
| `--color-border`      | `#E5E7EB` | Borders and dividers          |
| `--color-text`        | `#111827` | Body text                     |
| `--color-text-muted`  | `#6B7280` | Secondary/muted text          |

### Key Sections
- **CSS Reset** — `box-sizing: border-box`, zeroed margins/padding globally
- **Navbar** — white background, `border-bottom`, `box-shadow`
- **Hero / page banners** — `linear-gradient(135deg, #1e3a8a 0%, #2563EB 55%, #60a5fa 100%)`, `border-radius: 20px`, `margin: 1.25rem`
- **Why Choose Us** — `margin: 0 1.25rem`, `border-radius: 12px`
- **Card hover** — `translateY(-6px)` lift + brand-blue `box-shadow`
- **Form step indicator** — bubble + connector CSS with active/completed states
- **Saved Quotes** — `padding-top: 1.5rem`; card headers with blue left-border accent
- **`@media print`** — hides navbar, footer, banner, form card, progress steps, actions section, and saved quotes; reveals company letterhead header
- **Responsive** (`max-width: 767.98px`) — adjusts hero text size, card spacing, footer layout

---

## ⚙️ JavaScript (`js/main.js`)

### Smooth Scroll
- Intercepts `a[href^="#"]` anchor clicks site-wide
- Custom `requestAnimationFrame` loop with **easeInOutQuad** easing
- Duration: `SCROLL_DURATION = 900ms`
- Offsets by navbar height to prevent content being hidden behind the nav
- `smoothScrollTo(targetY)` is a **global function** reused by `quote.js` for post-submit, post-save, and reset scrolling

### Active Nav Highlighting
- Reads `window.location.pathname` on page load to identify the current page
- Applies `active` + `aria-current="page"` to the matching nav link
- Removes stale states from all other links — works across all four pages automatically

---

## 🛠️ Tech Stack

| Technology                                   | Purpose                                                                                   |
|----------------------------------------------|-------------------------------------------------------------------------------------------|
| HTML5                                        | Semantic page structure                                                                   |
| CSS3                                         | Custom styles, CSS variables, transitions, media queries, print styles                    |
| JavaScript ES6 (`const`/`let`)               | Form logic, validation, calculation, scroll, localStorage                                 |
| [Bootstrap 5.3.2](https://getbootstrap.com/) | Responsive grid, navbar, cards, accordion, utility classes                                |
| `Intl.NumberFormat`                          | Currency formatting throughout                                                            |
| `localStorage`                               | Persisting saved quotes between sessions                                                  |
| `Blob` / `URL.createObjectURL`               | Generating standalone print pages for saved quotes (replaces deprecated `document.write`) |

Bootstrap is loaded via CDN — no build tools or package manager required.

---

## 🚀 Running the Project

This is a fully static site — no server or build step needed.

1. Clone or download the repository
2. Open `index.html` in any modern browser
# Pinnacle Shield Insurance
**Capstone Project #1** — A multi-page static insurance company website built with HTML, CSS, and JavaScript using Bootstrap 5.

---

## 📁 Project Structure

```
pinnacle-shield-insurance/
├── index.html        # Homepage (fully built)
├── about.html        # About Us page (placeholder)
├── quote.html        # Get a Quote page (fully built)
├── faq.html          # FAQ page (placeholder)
├── css/
│   └── styles.css    # Custom stylesheet
├── js/
│   ├── main.js       # Site-wide JavaScript (smooth scroll, active nav)
│   └── quote.js      # Quote page logic (form, validation, calculation, results)
└── README.md
```

---

## 📄 Pages

| File | Status | Description |
|---|---|---|
| `index.html` | ✅ Complete | Full homepage with nav, hero, cards, insurance plans, and footer |
| `quote.html` | ✅ Complete | Full quote form with dynamic fields, validation, calculation, and results |
| `about.html` | 🔲 Placeholder | About Us page — to be built |
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

## 📋 Quote Page (`quote.html`)

The quote page is fully implemented and contains:

### Insurance Type Card Picker
- Three clickable radio cards at the top of the form: 🚗 Auto, 🏠 Home, ❤️ Life
- Uses Bootstrap's `btn-check` pattern — hidden radio inputs with styled `<label>` cards
- Selecting a type reveals the relevant field section and hides the others

### Dynamic Form Fields (per type)

**Auto Insurance (9 fields)**
| Field | Type | Validation |
|---|---|---|
| Full Name | Text | Required, min 2 characters |
| Age | Number | Required, 16–100 |
| ZIP Code | Text | Required, exactly 5 digits |
| Vehicle Year | Number | Required, 1990–2026 |
| Vehicle Make | Select | Toyota / Honda / Ford / BMW / Tesla / Other |
| Vehicle Model | Text | Required |
| Annual Mileage | Select | 5 bands: Under 5k → Over 20k |
| Driving Record | Select | Clean / 1 Ticket / 2+ Tickets / Accident |
| Coverage Level | Radio cards | Basic / Standard / Premium |

**Home Insurance (10 fields)**
| Field | Type | Validation |
|---|---|---|
| Full Name | Text | Required, min 2 characters |
| Age | Number | Required, 18–100 |
| ZIP Code | Text | Required, exactly 5 digits |
| Home Value | Number | Required, min $50,000 |
| Year Built | Number | Required, 1900–2026 |
| Square Footage | Number | Required, 500–10,000 |
| Construction Type | Select | Wood Frame / Brick / Concrete / Steel |
| Has Security System | Checkbox | Discount if checked |
| Has Fire Sprinklers | Checkbox | Discount if checked |
| Coverage Level | Radio cards | Basic / Standard / Premium |

**Life Insurance (9 fields)**
| Field | Type | Validation |
|---|---|---|
| Full Name | Text | Required, min 2 characters |
| Age | Number | Required, 18–85 |
| ZIP Code | Text | Required, exactly 5 digits |
| Gender | Select | Male / Female / Non-binary |
| Coverage Amount | Select | $100k / $250k / $500k / $1M |
| Exercise Frequency | Select | Rarely / 1–2 / 3–4 / 5+/week |
| Smoker | Radio buttons | Yes / No |
| Pre-existing Conditions | Checkbox | Increases premium if checked |
| Coverage Level | Radio cards | Basic / Standard / Premium |

### Results Card (shown after valid submission)
- **Summary stats** — Customer name, insurance type, monthly premium (formatted as currency), annual premium (monthly × 12)
- **Premium breakdown table** — one row per calculation factor, showing the user's input value and its multiplier impact (e.g. `+50% surcharge (×1.5) — young/senior driver`)
- **"Get Another Quote"** button — resets the form, clears validation state, hides results, and smooth-scrolls back to the top of the form

---

## 🧮 Quote Calculation Logic (`js/quote.js`)

All three types use a **base rate × multiplier chain** derived from actuarial-style factor tables.

### Auto Insurance
```
Monthly = $75 × Age factor × Vehicle age factor × Mileage factor × Driving record × Coverage level
```

| Factor | Values |
|---|---|
| Age | Under 25: ×1.5 / 25–65: ×1.0 / Over 65: ×1.3 |
| Vehicle Age | Under 3 yrs: ×1.3 / 3–10 yrs: ×1.0 / Over 10 yrs: ×0.8 |
| Mileage | Under 5k: ×0.8 / 5–10k: ×1.0 / 10–15k: ×1.1 / 15–20k: ×1.3 / Over 20k: ×1.5 |
| Driving Record | Clean: ×1.0 / 1 ticket: ×1.2 / 2+ tickets: ×1.5 / Accident: ×1.8 |
| Coverage | Basic: ×0.8 / Standard: ×1.0 / Premium: ×1.4 |

### Home Insurance
```
Monthly = (Home value × 0.003 / 12) × Year built × Construction × Coverage
        + (Square footage × $0.01)
        × Security discount × Sprinkler discount
```

| Factor | Values |
|---|---|
| Year Built | Before 1970: ×1.4 / 1970–1999: ×1.1 / 2000+: ×1.0 |
| Construction | Wood: ×1.2 / Brick: ×1.0 / Concrete: ×0.9 / Steel: ×0.85 |
| Size | +$0.01/sq ft/month (additive) |
| Security System | ×0.95 (−5% discount) |
| Fire Sprinklers | ×0.92 (−8% discount) |
| Coverage | Basic: ×0.8 / Standard: ×1.0 / Premium: ×1.4 |

### Life Insurance
```
Monthly = (Coverage amount × 0.0005 / 12) × Age × Smoker × Exercise × Pre-existing × Gender × Coverage level
```

| Factor | Values |
|---|---|
| Age | 18–30: ×1.0 / 31–45: ×1.5 / 46–60: ×2.5 / 61–85: ×4.0 |
| Smoker | No: ×1.0 / Yes: ×2.0 |
| Exercise | Rarely: ×1.3 / 1–2/wk: ×1.1 / 3–4/wk: ×1.0 / 5+/wk: ×0.9 |
| Pre-existing | No: ×1.0 / Yes: ×1.5 |
| Gender | Male: ×1.1 / Female: ×1.0 / Non-binary: ×1.05 |
| Coverage | Basic: ×0.8 / Standard: ×1.0 / Premium: ×1.4 |

---

## ✅ Form Validation (`js/quote.js`)

Validation is handled entirely in JavaScript — the form uses `novalidate` and no HTML5 `required` attributes on type-specific fields.

- All fields are validated on every submit attempt (all errors shown at once, not one at a time)
- Invalid fields receive Bootstrap's `is-invalid` class (red border + inline error message)
- Valid fields receive `is-valid` class (green border confirms input)
- ZIP codes validated with `/^\d{5}$/` regex
- Numeric fields checked with `parseInt`/`parseFloat` + `isNaN` guard + explicit range checks
- Radio groups (coverage level, smoker) validated manually with a dedicated error message element
- Validation state is fully cleared when "Get Another Quote" is clicked

---

## 🎨 Stylesheet (`css/styles.css`)

- **CSS Reset** — `box-sizing: border-box`, zeroed margins/padding on all elements
- `html { scroll-behavior: smooth }` — native smooth scroll fallback
- Hero section styling — gradient background, centred text, responsive padding
- Card hover effects — `translateY` lift + `box-shadow` using CSS `transition`
- **Type card picker** — styled radio `<label>` cards with green selected state
- **Coverage level radio buttons** — compact pill-style cards matching the brand palette
- Footer styling — matches the navbar's dark/amber visual language
- **Media query** (`max-width: 767.98px`) — adjusts hero font sizes, card spacing, and footer layout on small screens

---

## ⚙️ JavaScript (`js/main.js`)

### Smooth Scroll
- Listens for clicks on any anchor link (`a[href^="#"]`)
- Animates scrolling using a custom **`requestAnimationFrame`** loop with an **easeInOutQuad** easing function (slow → fast → slow)
- Scroll duration controlled by `SCROLL_DURATION` (default: `900ms`)
- Offsets scroll position by the navbar height so headings aren't hidden behind the nav
- `smoothScrollTo(targetY)` is a **globally available function** — reused by `quote.js` for results reveal and form reset scrolling

### Active Nav Highlighting
- On page load, reads `window.location.pathname` to determine the current page filename
- Adds Bootstrap's `active` class + `aria-current="page"` to the matching nav link
- Removes stale active states from all non-matching links — works automatically across all pages

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Page structure and semantic markup |
| CSS3 | Custom styles, transitions, media queries |
| JavaScript ES6 (`const`/`let`) | Form logic, validation, calculation, smooth scroll |
| [Bootstrap 5.3.2](https://getbootstrap.com/) | Responsive grid, navbar, cards, utility classes |
| `Intl.NumberFormat` | Currency formatting in the results card |

Bootstrap is loaded via CDN — no build tools or package manager required.

---

## 🚀 Running the Project

This is a fully static site — no server or build step needed.

1. Clone or download the repository
2. Open `index.html` in any modern browser
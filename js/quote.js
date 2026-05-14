/* Pinnacle Shield Insurance – Quote Logic */

/* ----- Calculation Tables ----- */
const COVERAGE_MULTIPLIERS = {
    basic:    0.8,
    standard: 1.0,
    premium:  1.4
};

/* ── Auto factors ── */
function getAutoAgeFactor(age) {
    if (age < 25) return 1.5;
    if (age <= 65) return 1.0;
    return 1.3;
}

function getVehicleAgeFactor(vehicleYear) {
    const vehicleAge = 2026 - parseInt(vehicleYear, 10);
    if (vehicleAge < 3)  return 1.3;   // nearly new
    if (vehicleAge <= 10) return 1.0;  // mid-age
    return 0.8;                        // older vehicle — cheaper to replace
}

const MILEAGE_FACTORS = {
    under5k:   0.8,
    '5to10k':  1.0,
    '10to15k': 1.1,
    '15to20k': 1.3,
    over20k:   1.5
};

const DRIVING_RECORD_FACTORS = {
    clean:      1.0,
    '1ticket':  1.2,
    '2tickets': 1.5,
    accident:   1.8
};

/* ── Home factors ── */
const CONSTRUCTION_FACTORS = {
    wood:     1.2,
    brick:    1.0,
    concrete: 0.9,
    steel:    0.85
};

function getYearBuiltFactor(year) {
    if (year < 1970) return 1.4;
    if (year < 2000) return 1.1;
    return 1.0;
}

/* ── Life factors ── */
function getLifeAgeFactor(age) {
    if (age <= 30) return 1.0;
    if (age <= 45) return 1.5;
    if (age <= 60) return 2.5;
    return 4.0;
}

const GENDER_FACTORS = {
    male:      1.1,
    female:    1.0,
    nonbinary: 1.05
};

const EXERCISE_FACTORS = {
    rarely: 1.3,
    '1to2': 1.1,
    '3to4': 1.0,
    '5plus': 0.9
};

const TYPE_LABELS = {
    auto: '🚗 Auto Insurance',
    home: '🏠 Home Insurance',
    life: '❤️ Life Insurance'
};

const COVERAGE_LABELS = {
    basic:    'Basic',
    standard: 'Standard',
    premium:  'Premium'
};

/* ── Calculation functions ── */
function calculateAutoQuote(age, vehicleYear, mileage, record, coverage) {
    return Math.round(
        75 *
        getAutoAgeFactor(parseInt(age, 10)) *
        getVehicleAgeFactor(vehicleYear) *
        (MILEAGE_FACTORS[mileage]         || 1) *
        (DRIVING_RECORD_FACTORS[record]   || 1) *
        (COVERAGE_MULTIPLIERS[coverage]   || 1)
    );
}

function calculateHomeQuote(homeValue, yearBuilt, sqft, constructionType, hasSecurity, hasSprinklers, coverage) {
    let price = (parseFloat(homeValue) * 0.003 / 12) *
        getYearBuiltFactor(parseInt(yearBuilt, 10)) *
        (CONSTRUCTION_FACTORS[constructionType] || 1) *
        (COVERAGE_MULTIPLIERS[coverage]         || 1);

    price += parseInt(sqft, 10) * 0.01;   // additive size surcharge

    if (hasSecurity)   price *= 0.95;     // 5% discount
    if (hasSprinklers) price *= 0.92;     // 8% discount

    return Math.round(price);
}

const COVERAGE_AMOUNT_VALUES = {
    '100k': 100000,
    '250k': 250000,
    '500k': 500000,
    '1m':   1000000
};

function calculateLifeQuote(age, gender, smoker, coverageAmount, exercise, hasPreexisting, coverage) {
    const amount = COVERAGE_AMOUNT_VALUES[coverageAmount] || 100000;
    return Math.round(
        (amount * 0.0005 / 12) *
        getLifeAgeFactor(parseInt(age, 10)) *
        (smoker === 'yes' ? 2.0 : 1.0) *
        (EXERCISE_FACTORS[exercise]     || 1) *
        (hasPreexisting ? 1.5 : 1.0) *
        (GENDER_FACTORS[gender]         || 1) *
        (COVERAGE_MULTIPLIERS[coverage] || 1)
    );
}

/* =========================================
   Form Progress Indicator
   ========================================= */

function setFormStep(stepNum) {
    [1, 2, 3].forEach(function (i) {
        const stepEl = document.getElementById('formStep' + i);
        if (!stepEl) return;
        const bubble = stepEl.querySelector('.step-bubble');
        stepEl.classList.remove('active', 'completed');
        if (i < stepNum) {
            stepEl.classList.add('completed');
            bubble.textContent = '✓';
        } else {
            bubble.textContent = i;
            if (i === stepNum) stepEl.classList.add('active');
        }
    });

    // Fill connectors between completed steps
    [1, 2].forEach(function (i) {
        const conn = document.getElementById('stepConnector' + i);
        if (conn) conn.classList.toggle('filled', i < stepNum);
    });
}

/* Name Fields — Strip digits on input */
['autoFullName', 'homeFullName', 'lifeFullName'].forEach(function (id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input', function () {
        const pos = this.selectionStart;
        const cleaned = this.value.replace(/[0-9]/g, '');
        if (cleaned !== this.value) {
            this.value = cleaned;
            // Restore cursor position accounting for removed characters
            this.setSelectionRange(pos - 1, pos - 1);
        }
    });
});

/* Type Card — Show / Hide Field Sections */
const FIELD_SECTIONS = {
    auto: 'autoFields',
    home: 'homeFields',
    life: 'lifeFields'
};

document.querySelectorAll('input[name="insuranceType"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
        // Hide all type-specific sections
        Object.keys(FIELD_SECTIONS).forEach(function (key) {
            document.getElementById(FIELD_SECTIONS[key]).classList.add('d-none');
        });

        // Show the selected type's section
        const sectionId = FIELD_SECTIONS[this.value];
        if (sectionId) {
            document.getElementById(sectionId).classList.remove('d-none');
        }

        // Show common fields (email, notes, submit) now that a type is chosen
        document.getElementById('commonFields').classList.remove('d-none');
        document.getElementById('commonFieldsBottom').classList.remove('d-none');

        document.querySelector('.type-card-invalid').classList.add('d-none');

        setFormStep(2);
    });
});

/* Validation Helpers */
function validateField(id, isValid) {
    const el = document.getElementById(id);
    if (isValid) {
        el.classList.remove('is-invalid');
        el.classList.add('is-valid');
    } else {
        el.classList.remove('is-valid');
        el.classList.add('is-invalid');
    }
    return isValid;
}

function validateAutoFields() {
    let ok = true;

    ok = validateField('email',
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            document.getElementById('email').value.trim()
        )
    ) && ok;

    ok = validateField('autoFullName',
        document.getElementById('autoFullName').value.trim().length >= 2
    ) && ok;

    const age = parseInt(document.getElementById('autoAge').value, 10);
    ok = validateField('autoAge', !isNaN(age) && age >= 16 && age <= 100) && ok;

    ok = validateField('autoZip',
        /^\d{5}$/.test(document.getElementById('autoZip').value.trim())
    ) && ok;

    const year = parseInt(document.getElementById('autoVehicleYear').value, 10);
    ok = validateField('autoVehicleYear',
        !isNaN(year) && year >= 1990 && year <= 2026
    ) && ok;

    ok = validateField('autoVehicleMake',
        !!document.getElementById('autoVehicleMake').value
    ) && ok;

    ok = validateField('autoVehicleModel',
        document.getElementById('autoVehicleModel').value.trim().length > 0
    ) && ok;

    ok = validateField('autoMileage',
        !!document.getElementById('autoMileage').value
    ) && ok;

    ok = validateField('autoDrivingRecord',
        !!document.getElementById('autoDrivingRecord').value
    ) && ok;

    const selectedCoverage = document.querySelector('input[name="autoCoverage"]:checked');
    const coverageError    = document.querySelector('.auto-coverage-invalid');
    if (selectedCoverage) {
        coverageError.classList.add('d-none');
    } else {
        coverageError.classList.remove('d-none');
        ok = false;
    }

    return ok;
}

function validateHomeFields() {
    let ok = true;

    ok = validateField('email',
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            document.getElementById('email').value.trim()
        )
    ) && ok;

    ok = validateField('homeFullName',
        document.getElementById('homeFullName').value.trim().length >= 2
    ) && ok;

    const age = parseInt(document.getElementById('homeAge').value, 10);
    ok = validateField('homeAge', !isNaN(age) && age >= 18 && age <= 100) && ok;

    ok = validateField('homeZip',
        /^\d{5}$/.test(document.getElementById('homeZip').value.trim())
    ) && ok;

    const homeValue = parseFloat(document.getElementById('homeValue').value);
    ok = validateField('homeValue', !isNaN(homeValue) && homeValue >= 50000) && ok;

    const yearBuilt = parseInt(document.getElementById('homeYearBuilt').value, 10);
    ok = validateField('homeYearBuilt',
        !isNaN(yearBuilt) && yearBuilt >= 1900 && yearBuilt <= 2026
    ) && ok;

    const sqft = parseInt(document.getElementById('homeSquareFootage').value, 10);
    ok = validateField('homeSquareFootage',
        !isNaN(sqft) && sqft >= 500 && sqft <= 10000
    ) && ok;

    ok = validateField('homeConstructionType',
        !!document.getElementById('homeConstructionType').value
    ) && ok;

    const selectedCoverage = document.querySelector('input[name="homeCoverage"]:checked');
    const coverageError    = document.querySelector('.home-coverage-invalid');
    if (selectedCoverage) {
        coverageError.classList.add('d-none');
    } else {
        coverageError.classList.remove('d-none');
        ok = false;
    }

    return ok;
}

function validateLifeFields() {
    let ok = true;

    ok = validateField('email',
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            document.getElementById('email').value.trim()
        )
    ) && ok;

    ok = validateField('lifeFullName',
        document.getElementById('lifeFullName').value.trim().length >= 2
    ) && ok;

    const age = parseInt(document.getElementById('lifeAge').value, 10);
    ok = validateField('lifeAge', !isNaN(age) && age >= 18 && age <= 85) && ok;

    ok = validateField('lifeZip',
        /^\d{5}$/.test(document.getElementById('lifeZip').value.trim())
    ) && ok;

    ok = validateField('lifeGender',
        !!document.getElementById('lifeGender').value
    ) && ok;

    ok = validateField('lifeCoverageAmount',
        !!document.getElementById('lifeCoverageAmount').value
    ) && ok;

    ok = validateField('lifeExercise',
        !!document.getElementById('lifeExercise').value
    ) && ok;

    const selectedSmoker = document.querySelector('input[name="lifeSmoker"]:checked');
    const smokerError    = document.querySelector('.life-smoker-invalid');
    if (selectedSmoker) {
        smokerError.classList.add('d-none');
    } else {
        smokerError.classList.remove('d-none');
        ok = false;
    }

    const selectedCoverage = document.querySelector('input[name="lifeCoverage"]:checked');
    const coverageError    = document.querySelector('.life-coverage-invalid');
    if (selectedCoverage) {
        coverageError.classList.add('d-none');
    } else {
        coverageError.classList.remove('d-none');
        ok = false;
    }

    return ok;
}

/* Display Helpers */
let _lastBreakdownRows = [];   // populated by addBreakdownRow, captured for saving
let _currentQuoteData  = null; // set by showResults, read by saveCurrentQuote

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(amount);
}

function multiplierImpact(factor, description) {
    const pct = Math.round(Math.abs((factor - 1) * 100));
    if (factor === 1.0) return 'No effect (×1.0)';
    const dir = factor > 1 ? `+${pct}% surcharge` : `−${pct}% discount`;
    return `${dir} (×${factor})${description ? ' — ' + description : ''}`;
}

function addBreakdownRow(tbody, factor, userValue, impact) {
    _lastBreakdownRows.push({ factor, userValue, impact });
    const row = document.createElement('tr');
    row.innerHTML =
        '<td>' + factor + '</td>' +
        '<td>' + userValue + '</td>' +
        '<td>' + impact + '</td>';
    tbody.appendChild(row);
}

/* ── Per-type breakdown builders ── */
const MILEAGE_LABELS = {
    under5k:   'Under 5,000 miles',
    '5to10k':  '5,000–10,000 miles',
    '10to15k': '10,001–15,000 miles',
    '15to20k': '15,001–20,000 miles',
    over20k:   'Over 20,000 miles'
};

const DRIVING_RECORD_LABELS = {
    clean:      'Clean',
    '1ticket':  '1 Ticket',
    '2tickets': '2+ Tickets',
    accident:   'Accident in Last 3 Years'
};

const CONSTRUCTION_LABELS = {
    wood:     'Wood Frame',
    brick:    'Brick',
    concrete: 'Concrete',
    steel:    'Steel'
};

const EXERCISE_LABELS = {
    rarely: 'Rarely',
    '1to2': '1–2 times/week',
    '3to4': '3–4 times/week',
    '5plus': '5+ times/week'
};

const COVERAGE_AMOUNT_LABELS = {
    '100k': '$100,000',
    '250k': '$250,000',
    '500k': '$500,000',
    '1m':   '$1,000,000'
};

function buildAutoBreakdown(tbody, age, vehicleYear, mileage, record, coverage) {
    const vehicleAge = 2026 - parseInt(vehicleYear, 10);
    const ageF       = getAutoAgeFactor(parseInt(age, 10));
    const vehF       = getVehicleAgeFactor(vehicleYear);
    const milF       = MILEAGE_FACTORS[mileage]         || 1;
    const recF       = DRIVING_RECORD_FACTORS[record]   || 1;
    const covF       = COVERAGE_MULTIPLIERS[coverage]   || 1;

    addBreakdownRow(tbody, 'Base Rate',      '—',                                           formatCurrency(75) + '/mo');
    addBreakdownRow(tbody, 'Driver Age',     age + ' years old',                            multiplierImpact(ageF, ageF > 1 ? 'young/senior driver' : 'standard age'));
    addBreakdownRow(tbody, 'Vehicle Age',    vehicleYear + ' (' + vehicleAge + ' yrs old)', multiplierImpact(vehF, vehF > 1 ? 'newer vehicle' : 'older vehicle'));
    addBreakdownRow(tbody, 'Annual Mileage', MILEAGE_LABELS[mileage] || mileage,            multiplierImpact(milF, ''));
    addBreakdownRow(tbody, 'Driving Record', DRIVING_RECORD_LABELS[record] || record,       multiplierImpact(recF, recF > 1 ? 'violations on record' : ''));
    addBreakdownRow(tbody, 'Coverage Level', COVERAGE_LABELS[coverage],                    multiplierImpact(covF, ''));
}

function buildHomeBreakdown(tbody, homeValue, yearBuilt, sqft, construction, hasSecurity, hasSprinklers, coverage) {
    const baseMonthly = parseFloat(homeValue) * 0.003 / 12;
    const ybF         = getYearBuiltFactor(parseInt(yearBuilt, 10));
    const conF        = CONSTRUCTION_FACTORS[construction] || 1;
    const covF        = COVERAGE_MULTIPLIERS[coverage]     || 1;
    const sizeCost    = parseInt(sqft, 10) * 0.01;

    addBreakdownRow(tbody, 'Base Rate',            formatCurrency(parseFloat(homeValue)) + ' home',  formatCurrency(baseMonthly) + '/mo (value × 0.003 ÷ 12)');
    addBreakdownRow(tbody, 'Year Built',           yearBuilt,                                        multiplierImpact(ybF, parseInt(yearBuilt) < 1970 ? 'older home' : parseInt(yearBuilt) < 2000 ? 'mid-age home' : 'modern home'));
    addBreakdownRow(tbody, 'Construction Type',    CONSTRUCTION_LABELS[construction] || construction, multiplierImpact(conF, conF > 1 ? 'higher fire risk' : conF < 1 ? 'fire-resistant' : ''));
    addBreakdownRow(tbody, 'Square Footage',       parseInt(sqft).toLocaleString() + ' sq ft',       '+' + formatCurrency(sizeCost) + '/mo ($0.01 per sq ft)');
    addBreakdownRow(tbody, 'Security System',      hasSecurity   ? 'Yes' : 'No',                     hasSecurity   ? multiplierImpact(0.95, 'discount applied') : 'No discount');
    addBreakdownRow(tbody, 'Fire Sprinklers',      hasSprinklers ? 'Yes' : 'No',                     hasSprinklers ? multiplierImpact(0.92, 'discount applied') : 'No discount');
    addBreakdownRow(tbody, 'Coverage Level',       COVERAGE_LABELS[coverage],                        multiplierImpact(covF, ''));
}

function buildLifeBreakdown(tbody, age, gender, smoker, coverageAmount, exercise, hasPreexisting, coverage) {
    const amount    = COVERAGE_AMOUNT_VALUES[coverageAmount] || 100000;
    const baseRate  = amount * 0.0005 / 12;
    const ageF      = getLifeAgeFactor(parseInt(age, 10));
    const smokerF   = smoker === 'yes' ? 2.0 : 1.0;
    const exF       = EXERCISE_FACTORS[exercise]     || 1;
    const preF      = hasPreexisting ? 1.5 : 1.0;
    const genF      = GENDER_FACTORS[gender]         || 1;
    const covF      = COVERAGE_MULTIPLIERS[coverage] || 1;

    addBreakdownRow(tbody, 'Base Rate',              COVERAGE_AMOUNT_LABELS[coverageAmount] + ' coverage', formatCurrency(baseRate) + '/mo (amount × 0.0005 ÷ 12)');
    addBreakdownRow(tbody, 'Age',                    age + ' years old',                                   multiplierImpact(ageF, ''));
    addBreakdownRow(tbody, 'Gender',                 gender.charAt(0).toUpperCase() + gender.slice(1),     multiplierImpact(genF, ''));
    addBreakdownRow(tbody, 'Smoker',                 smoker === 'yes' ? 'Yes' : 'No',                      multiplierImpact(smokerF, smoker === 'yes' ? 'significant health risk' : ''));
    addBreakdownRow(tbody, 'Exercise Frequency',     EXERCISE_LABELS[exercise] || exercise,                multiplierImpact(exF, ''));
    addBreakdownRow(tbody, 'Pre-existing Conditions',hasPreexisting ? 'Yes' : 'No',                        multiplierImpact(preF, hasPreexisting ? 'increased health risk' : ''));
    addBreakdownRow(tbody, 'Coverage Level',         COVERAGE_LABELS[coverage],                            multiplierImpact(covF, ''));
}

/* Show Results Card */

function showResults(name, email, type, coverage, monthlyPrice, buildBreakdownFn) {
    const annual = monthlyPrice * 12;

    // Populate summary stats
    document.getElementById('resultName').textContent    = name;
    document.getElementById('resultType').textContent    = TYPE_LABELS[type];
    document.getElementById('resultMonthly').textContent = formatCurrency(monthlyPrice);
    document.getElementById('resultAnnual').textContent  = formatCurrency(annual);
    document.getElementById('resultEmail').textContent   = email;

    // Clear and rebuild breakdown table, capturing rows for saving
    const tbody = document.getElementById('breakdownTableBody');
    tbody.innerHTML  = '';
    _lastBreakdownRows = [];
    buildBreakdownFn(tbody);

    // Store current quote data ready for saving
    _currentQuoteData = {
        id:        Date.now(),
        savedAt:   new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        type,
        typeLabel: TYPE_LABELS[type],
        name,
        email,
        monthly:   monthlyPrice,
        annual,
        coverage:  COVERAGE_LABELS[coverage] || coverage,
        breakdown: [..._lastBreakdownRows]
    };

    // Reset the Save button to its active state
    const saveBtn = document.getElementById('saveQuoteBtn');
    saveBtn.textContent = '💾 Save Quote';
    saveBtn.disabled    = false;
    saveBtn.classList.remove('btn-secondary');
    saveBtn.classList.add('btn-success');

    // Reveal the card
    const resultsCard  = document.getElementById('quoteResults');
    resultsCard.classList.remove('d-none');

    setFormStep(3);

    // Smooth scroll to results — reuses smoothScrollTo() defined in main.js
    const navbar       = document.querySelector('.navbar');
    const navbarHeight = navbar ? navbar.offsetHeight : 0;
    const targetTop    = resultsCard.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 16;
    smoothScrollTo(targetTop);
}

/* Form Submit Handler */

document.getElementById('quoteForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const selectedType = document.querySelector('input[name="insuranceType"]:checked');
    const typeError    = document.querySelector('.type-card-invalid');

    if (!selectedType) {
        typeError.classList.remove('d-none');
        return;
    }
    typeError.classList.add('d-none');

    const type  = selectedType.value;
    const email = document.getElementById('email').value.trim();

    if (type === 'auto') {
        if (!validateAutoFields()) return;

        const name        = document.getElementById('autoFullName').value.trim();
        const age         = document.getElementById('autoAge').value;
        const vehicleYear = document.getElementById('autoVehicleYear').value;
        const mileage     = document.getElementById('autoMileage').value;
        const record      = document.getElementById('autoDrivingRecord').value;
        const coverage    = document.querySelector('input[name="autoCoverage"]:checked').value;
        const price       = calculateAutoQuote(age, vehicleYear, mileage, record, coverage);

        showResults(name, email, type, coverage, price, function (tbody) {
            buildAutoBreakdown(tbody, age, vehicleYear, mileage, record, coverage);
        });

    } else if (type === 'home') {
        if (!validateHomeFields()) return;

        const name          = document.getElementById('homeFullName').value.trim();
        const homeValue     = document.getElementById('homeValue').value;
        const yearBuilt     = document.getElementById('homeYearBuilt').value;
        const sqft          = document.getElementById('homeSquareFootage').value;
        const construction  = document.getElementById('homeConstructionType').value;
        const hasSecurity   = document.getElementById('homeSecuritySystem').checked;
        const hasSprinklers = document.getElementById('homeFireSprinklers').checked;
        const coverage      = document.querySelector('input[name="homeCoverage"]:checked').value;
        const price         = calculateHomeQuote(homeValue, yearBuilt, sqft, construction, hasSecurity, hasSprinklers, coverage);

        showResults(name, email, type, coverage, price, function (tbody) {
            buildHomeBreakdown(tbody, homeValue, yearBuilt, sqft, construction, hasSecurity, hasSprinklers, coverage);
        });

    } else if (type === 'life') {
        if (!validateLifeFields()) return;

        const name           = document.getElementById('lifeFullName').value.trim();
        const age            = document.getElementById('lifeAge').value;
        const gender         = document.getElementById('lifeGender').value;
        const smoker         = document.querySelector('input[name="lifeSmoker"]:checked').value;
        const coverageAmount = document.getElementById('lifeCoverageAmount').value;
        const exercise       = document.getElementById('lifeExercise').value;
        const hasPreexisting = document.getElementById('lifePreexisting').checked;
        const coverage       = document.querySelector('input[name="lifeCoverage"]:checked').value;
        const price          = calculateLifeQuote(age, gender, smoker, coverageAmount, exercise, hasPreexisting, coverage);

        showResults(name, email, type, coverage, price, function (tbody) {
            buildLifeBreakdown(tbody, age, gender, smoker, coverageAmount, exercise, hasPreexisting, coverage);
        });
    }
});

/* =========================================
   localStorage — Save / Load / Delete
   ========================================= */

function saveCurrentQuote() {
    if (!_currentQuoteData) return;

    const quotes = JSON.parse(localStorage.getItem('savedQuotes')) || [];

    // Prevent saving the exact same quote twice
    if (quotes.some(function (q) { return q.id === _currentQuoteData.id; })) return;

    quotes.push(_currentQuoteData);
    localStorage.setItem('savedQuotes', JSON.stringify(quotes));

    // Update button to "saved" state
    const saveBtn       = document.getElementById('saveQuoteBtn');
    saveBtn.textContent = '✅ Quote Saved!';
    saveBtn.disabled    = true;
    saveBtn.classList.replace('btn-success', 'btn-secondary');

    renderSavedQuotes();

    // Scroll down to the saved quotes section
    const section      = document.getElementById('savedQuotesSection');
    const navbar       = document.querySelector('.navbar');
    const navbarHeight = navbar ? navbar.offsetHeight : 0;
    const targetTop    = section.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 16;
    smoothScrollTo(targetTop);
}

function deleteSavedQuote(id) {
    let quotes = JSON.parse(localStorage.getItem('savedQuotes')) || [];
    quotes = quotes.filter(function (q) { return q.id !== id; });
    localStorage.setItem('savedQuotes', JSON.stringify(quotes));
    renderSavedQuotes();
}

function clearAllSavedQuotes() {
    if (!confirm('Are you sure you want to delete all saved quotes?')) return;
    localStorage.removeItem('savedQuotes');
    renderSavedQuotes();
}

function renderSavedQuotes() {
    const container = document.getElementById('savedQuotesContainer');
    if (!container) return;

    const quotes = JSON.parse(localStorage.getItem('savedQuotes')) || [];

    if (quotes.length === 0) {
        container.innerHTML = '';
        return;
    }

    let html = `
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="fw-bold mb-0">🗂️ Saved Quotes <span class="badge bg-secondary">${quotes.length}</span></h5>
            <button class="btn btn-sm btn-outline-danger" onclick="clearAllSavedQuotes()">🗑️ Clear All</button>
        </div>`;

    // Newest first
    [...quotes].reverse().forEach(function (q) {
        const breakdownRows = (q.breakdown || []).map(function (row) {
            return '<tr><td>' + row.factor + '</td><td>' + row.userValue + '</td><td>' + row.impact + '</td></tr>';
        }).join('');

        html += `
        <div class="card border-0 shadow-sm mb-3">
            <div class="card-header d-flex justify-content-between align-items-center py-2 px-3"
                 style="background:#f0f7f2; border-left:4px solid #2d5a3d;">
                <span class="fw-semibold">${q.typeLabel} &mdash; ${q.name}</span>
                <span class="text-muted small">${q.savedAt}</span>
            </div>
            <div class="card-body px-3 py-3">
                <div class="row g-2 mb-3">
                    <div class="col-6 col-sm-3">
                        <div class="text-muted small">Monthly</div>
                        <div class="fw-bold text-success fs-5">${formatCurrency(q.monthly)}</div>
                    </div>
                    <div class="col-6 col-sm-3">
                        <div class="text-muted small">Annual</div>
                        <div class="fw-bold text-success">${formatCurrency(q.annual)}</div>
                    </div>
                    <div class="col-6 col-sm-3">
                        <div class="text-muted small">Coverage</div>
                        <div class="fw-semibold">${q.coverage}</div>
                    </div>
                    <div class="col-6 col-sm-3">
                        <div class="text-muted small">Email</div>
                        <div class="small text-truncate">${q.email}</div>
                    </div>
                </div>
                ${breakdownRows ? `
                <details class="mb-3">
                    <summary class="text-muted small" style="cursor:pointer; user-select:none;">
                        📊 View Breakdown
                    </summary>
                    <div class="table-responsive mt-2">
                        <table class="table table-sm table-striped mb-0">
                            <thead class="table-dark">
                                <tr><th>Factor</th><th>Your Info</th><th>Impact</th></tr>
                            </thead>
                            <tbody>${breakdownRows}</tbody>
                        </table>
                    </div>
                </details>` : ''}
                <div class="d-flex justify-content-end">
                    <button class="btn btn-sm btn-outline-danger"
                            onclick="deleteSavedQuote(${q.id})">🗑️ Delete</button>
                </div>
            </div>
        </div>`;
    });

    container.innerHTML = html;
}

/* Save Quote button */
document.getElementById('saveQuoteBtn').addEventListener('click', saveCurrentQuote);

/* Reset / Start Over */

document.getElementById('resetQuote').addEventListener('click', function () {
    const form = document.getElementById('quoteForm');
    form.reset();

    form.querySelectorAll('.is-valid, .is-invalid').forEach(function (el) {
        el.classList.remove('is-valid', 'is-invalid');
    });

    document.querySelectorAll('.type-fields').forEach(function (section) {
        section.classList.add('d-none');
    });

    document.getElementById('commonFields').classList.add('d-none');
    document.getElementById('commonFieldsBottom').classList.add('d-none');

    document.querySelector('.type-card-invalid').classList.add('d-none');
    document.querySelector('.auto-coverage-invalid').classList.add('d-none');
    document.querySelector('.home-coverage-invalid').classList.add('d-none');
    document.querySelector('.life-smoker-invalid').classList.add('d-none');
    document.querySelector('.life-coverage-invalid').classList.add('d-none');

    document.getElementById('quoteResults').classList.add('d-none');

    // Reset Save button
    const saveBtn       = document.getElementById('saveQuoteBtn');
    saveBtn.textContent = '💾 Save Quote';
    saveBtn.disabled    = false;
    saveBtn.classList.remove('btn-secondary');
    saveBtn.classList.add('btn-success');
    _currentQuoteData   = null;

    setFormStep(1);

    const formCard     = document.getElementById('quoteForm').closest('.card');
    const navbar       = document.querySelector('.navbar');
    const navbarHeight = navbar ? navbar.offsetHeight : 0;
    const targetTop    = formCard.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 16;
    smoothScrollTo(targetTop);
});

// Render any previously saved quotes when the page first loads
renderSavedQuotes();


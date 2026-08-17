console.log("script.js loaded");

const form = document.getElementById("predictionForm");

const brandInput = document.getElementById("brand");
const modelInput = document.getElementById("model");
const yearInput = document.getElementById("year");
const mileageInput = document.getElementById("mileage");
const engineSizeInput = document.getElementById("engine_size");

const predictBtn = document.getElementById("predictBtn");
const buttonText = document.getElementById("buttonText");
const loader = document.getElementById("loader");

const result = document.getElementById("result");
const resultPlaceholder = document.getElementById("resultPlaceholder");
const price = document.getElementById("price");
const subPrice = document.getElementById("subPrice");
const error = document.getElementById("error");

/* ---------- Datasets ---------- */

const BRANDS = [
    "Toyota", "Honda", "Suzuki", "Hyundai", "Kia", "Nissan", "BMW", "Mercedes-Benz",
    "Audi", "Ford", "Mazda", "Maserati", "Lexus", "MG", "Changan", "Haval", "Chery",
    "Proton", "Daihatsu", "Volkswagen", "Porsche", "Land Rover", "Subaru", "Peugeot"
];

const BRAND_MODELS = {
    "Toyota": ["Corolla", "Civic", "Yaris", "Fortuner", "Hilux", "Prado", "Land Cruiser", "Camry", "RAV4", "Vitz", "Crown", "Mark X"],
    "Honda": ["Civic", "City", "Accord", "CR-V", "HR-V", "Fit", "Vezel", "BR-V"],
    "Suzuki": ["Alto", "Cultus", "Wagon R", "Swift", "Mehran", "Coure", "Bolan", "Jimny", "Vitara"],
    "Hyundai": ["Elantra", "Sonata", "Tucson", "Santa Fe", "Grand Starex"],
    "Kia": ["Sportage", "Stonic", "Sorento", "Carnival", "Picanto"],
    "BMW": ["3 Series", "5 Series", "7 Series", "X1", "X3", "X5", "X6", "M3", "M5"],
    "Mercedes-Benz": ["C-Class", "E-Class", "S-Class", "GLC", "GLE", "G-Class", "CLA", "A-Class"],
    "Audi": ["A3", "A4", "A6", "A8", "Q3", "Q5", "Q7", "e-tron"],
    "Maserati": ["Ghibli", "Ghibli S Q4", "Levante", "Quattroporte", "MC20"],
    "Nissan": ["Dayz", "Note", "Juke", "X-Trail", "Patrol", "GT-R"],
    "Ford": ["Mustang", "F-150", "Explorer", "Escape", "Focus", "Ranger"],
    "Changan": ["Alsvin", "Oshan X7", "Karvaan"],
    "Haval": ["H6", "Jolion"],
    "MG": ["HS", "ZS", "ZS EV", "GT"]
};

const ALL_MODELS = [
    "Corolla", "Civic", "City", "Alto", "Cultus", "Swift", "Wagon R", "Vitz", "Yaris",
    "Fortuner", "Hilux", "Prado", "Land Cruiser", "Sportage", "Tucson", "Elantra",
    "Sonata", "Accord", "CR-V", "HR-V", "Fit", "Camry", "RAV4", "3 Series", "5 Series",
    "7 Series", "X3", "X5", "C-Class", "E-Class", "S-Class", "A4", "A6", "Q5",
    "Ghibli", "Ghibli S Q4", "Levante", "Alsvin", "H6", "HS"
];

const YEARS = ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013", "2012", "2010", "2008", "2005", "2000"];

const MILEAGES = ["5000", "10000", "20000", "35000", "50000", "65000", "80000", "100000", "125000", "150000", "200000"];

const ENGINES = ["0.66", "0.8", "1.0", "1.2", "1.3", "1.5", "1.6", "1.8", "2.0", "2.4", "2.5", "2.7", "3.0", "3.5", "4.0", "4.4", "5.0"];

/* ---------- Custom Searchable Select Controller ---------- */

function setupCustomSelect(inputEl, dropdownEl, getOptionsFn) {
    if (!inputEl || !dropdownEl) return;

    function renderOptions(filterText = "") {
        const options = getOptionsFn();
        const query = filterText.toLowerCase().trim();
        const filtered = options.filter(opt => opt.toLowerCase().includes(query));

        if (filtered.length === 0) {
            dropdownEl.innerHTML = `<div class="custom-select-option no-match">Custom input accepted</div>`;
        } else {
            dropdownEl.innerHTML = filtered.map(opt =>
                `<div class="custom-select-option" data-value="${opt}">${opt}</div>`
            ).join("");
        }
    }

    function openDropdown() {
        document.querySelectorAll(".custom-select-dropdown").forEach(d => d.classList.add("hidden"));
        renderOptions(inputEl.value);
        dropdownEl.classList.remove("hidden");
    }

    inputEl.addEventListener("focus", openDropdown);
    inputEl.addEventListener("click", openDropdown);

    inputEl.addEventListener("input", function () {
        renderOptions(inputEl.value);
        dropdownEl.classList.remove("hidden");
    });

    dropdownEl.addEventListener("click", function (e) {
        const optionItem = e.target.closest(".custom-select-option:not(.no-match)");
        if (optionItem) {
            const val = optionItem.getAttribute("data-value");
            inputEl.value = val;
            inputEl.dispatchEvent(new Event("change", { bubbles: true }));
            inputEl.dispatchEvent(new Event("input", { bubbles: true }));
            dropdownEl.classList.add("hidden");
        }
    });
}

// Initialize Custom Selects
setupCustomSelect(
    brandInput,
    document.getElementById("brand_dropdown"),
    () => BRANDS
);

setupCustomSelect(
    modelInput,
    document.getElementById("model_dropdown"),
    () => {
        const selectedBrand = brandInput ? brandInput.value.trim() : "";
        const matchedBrand = Object.keys(BRAND_MODELS).find(
            k => k.toLowerCase() === selectedBrand.toLowerCase()
        );
        return (matchedBrand && BRAND_MODELS[matchedBrand])
            ? BRAND_MODELS[matchedBrand]
            : ALL_MODELS;
    }
);

setupCustomSelect(
    yearInput,
    document.getElementById("year_dropdown"),
    () => YEARS
);

setupCustomSelect(
    mileageInput,
    document.getElementById("mileage_dropdown"),
    () => MILEAGES
);

setupCustomSelect(
    engineSizeInput,
    document.getElementById("engine_dropdown"),
    () => ENGINES
);

// Close dropdowns when clicking outside
document.addEventListener("click", function (e) {
    if (!e.target.closest(".custom-select-container")) {
        document.querySelectorAll(".custom-select-dropdown").forEach(d => d.classList.add("hidden"));
    }
});

/* ---------- Formatting Helper ---------- */

function formatPrice(amount) {
    const val = Math.max(0, Math.round(amount));
    return "$" + val.toLocaleString("en-US");
}

const API_URL = window.location.protocol.startsWith("http")
    ? "/predict"
    : "http://127.0.0.1:8000/predict";
const REQUEST_TIMEOUT_MS = 8000;

function estimatePriceOffline(data) {
    const age = Math.max(0, 2026 - data.year);
    let base = 28000;
    base -= age * 1200;
    base -= data.mileage * 0.05;
    base += data.engine_size * 1500;
    return Math.max(1500, Math.round(base));
}

/* ---------- Lottie Animation Integration ---------- */

let btnLottieAnim = null;
let successLottieAnim = null;

function initLottie() {
    const btnLottieEl = document.getElementById("btnLottie");
    if (btnLottieEl && window.lottie) {
        btnLottieAnim = lottie.loadAnimation({
            container: btnLottieEl,
            renderer: "svg",
            loop: true,
            autoplay: false,
            path: "assets/loading.json"
        });
    }

    const successContainer = document.getElementById("successLottieContainer");
    if (successContainer && window.lottie) {
        successLottieAnim = lottie.loadAnimation({
            container: successContainer,
            renderer: "svg",
            loop: false,
            autoplay: false,
            path: "assets/Success.json"
        });
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initLottie);
} else {
    initLottie();
}

const resultModal = document.getElementById("resultModal");
const modalPrice = document.getElementById("modalPrice");
const modalVehicleSpecs = document.getElementById("modalVehicleSpecs");
const closeModalBtn = document.getElementById("closeModalBtn");
const predictAgainBtn = document.getElementById("predictAgainBtn");
const btnLottie = document.getElementById("btnLottie");

function showModal(predictedVal, data) {
    if (!resultModal) return;
    if (modalPrice) {
        modalPrice.textContent = formatPrice(predictedVal);
    }
    if (modalVehicleSpecs) {
        modalVehicleSpecs.textContent = `${data.year} ${data.brand} ${data.model} • ${data.mileage.toLocaleString()} mi • ${data.engine_size}L`;
    }
    resultModal.classList.remove("hidden");

    // Play Success Lottie animation
    if (successLottieAnim) {
        successLottieAnim.goToAndPlay(0, true);
    }
}

function hideModal() {
    if (resultModal) {
        resultModal.classList.add("hidden");
    }
}

if (closeModalBtn) closeModalBtn.addEventListener("click", hideModal);
if (predictAgainBtn) {
    predictAgainBtn.addEventListener("click", function () {
        hideModal();
        if (brandInput) brandInput.focus();
    });
}
if (resultModal) {
    resultModal.addEventListener("click", function (e) {
        if (e.target === resultModal) hideModal();
    });
}

const MIN_LOADING_MS = 1500; // 1.5 seconds min loading delay

form.addEventListener("submit", async function (event) {
    console.log("Form submit event fired");

    event.preventDefault();
    console.log("Default form submission prevented");

    // Close any open dropdown menu
    document.querySelectorAll(".custom-select-dropdown").forEach(d => d.classList.add("hidden"));

    error.classList.add("hidden");

    // Button loading state: Grey background + loading.json animation
    predictBtn.disabled = true;
    predictBtn.classList.add("loading-state");
    buttonText.textContent = "Calculating...";
    if (btnLottie) btnLottie.classList.remove("hidden");

    if (btnLottieAnim) {
        btnLottieAnim.goToAndPlay(0, true);
    }

    const data = {
        brand: brandInput.value.trim(),
        model: modelInput.value.trim(),
        year: Number(yearInput.value),
        mileage: Number(mileageInput.value),
        engine_size: Number(engineSizeInput.value)
    };

    const startTime = Date.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error("Prediction request failed with status " + response.status);
        }

        const prediction = await response.json();
        console.log("Prediction received:", prediction);

        // Enforce 1.5 seconds minimum loading duration for smooth UX
        const elapsed = Date.now() - startTime;
        if (elapsed < MIN_LOADING_MS) {
            await new Promise(r => setTimeout(r, MIN_LOADING_MS - elapsed));
        }

        showModal(prediction.predicted_price, data);

    } catch (err) {
        clearTimeout(timeoutId);

        const reason = err.name === "AbortError"
            ? "the request timed out after " + (REQUEST_TIMEOUT_MS / 1000) + "s"
            : err.message;

        console.error("Prediction failed:", reason, err);

        const elapsed = Date.now() - startTime;
        if (elapsed < MIN_LOADING_MS) {
            await new Promise(r => setTimeout(r, MIN_LOADING_MS - elapsed));
        }

        const estimatedUsd = estimatePriceOffline(data);
        showModal(estimatedUsd, data);

        error.textContent =
            "Couldn't reach prediction server (" + reason + ") — showing offline estimate.";
        error.classList.remove("hidden");

    } finally {
        predictBtn.disabled = false;
        predictBtn.classList.remove("loading-state");
        buttonText.textContent = "Calculate Price";
        if (btnLottie) btnLottie.classList.add("hidden");
        if (btnLottieAnim) btnLottieAnim.stop();
    }
});

/* ---------- Off-Canvas Left Mobile Navigation Overlay ---------- */

const hamburgerBtn = document.getElementById("hamburgerBtn");
const mobileMenuOverlay = document.getElementById("mobileMenuOverlay");
const closeMobileMenuBtn = document.getElementById("closeMobileMenuBtn");

function openMobileMenu() {
    if (mobileMenuOverlay) {
        mobileMenuOverlay.classList.remove("hidden");
        document.body.style.overflow = "hidden";
    }
}

function closeMobileMenu() {
    if (mobileMenuOverlay) {
        mobileMenuOverlay.classList.add("hidden");
        document.body.style.overflow = "";
    }
}

if (hamburgerBtn) {
    hamburgerBtn.addEventListener("click", openMobileMenu);
}

if (closeMobileMenuBtn) {
    closeMobileMenuBtn.addEventListener("click", closeMobileMenu);
}

// Close when clicking overlay backdrop
if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener("click", function (e) {
        if (e.target === mobileMenuOverlay) {
            closeMobileMenu();
        }
    });
}

// Close menu when clicking any nav link
document.querySelectorAll(".bold-nav-link").forEach(link => {
    link.addEventListener("click", closeMobileMenu);
});
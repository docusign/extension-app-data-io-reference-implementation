"use strict";
document.addEventListener('DOMContentLoaded', () => {
    const consentButton = document.getElementById('consentButton');
    if (!consentButton) {
        console.error('Consent button not found');
        return;
    }
    consentButton.addEventListener('click', () => {
        const redirectUri = consentButton.dataset.redirectUri;
        const code = consentButton.dataset.code;
        const state = consentButton.dataset.state;
        if (!redirectUri || !code || !state) {
            console.error('Missing redirect parameters');
            return;
        }
        window.location.href = `${redirectUri}?code=${code}&state=${state}`;
    });
});

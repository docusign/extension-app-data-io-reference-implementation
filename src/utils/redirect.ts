document.addEventListener('DOMContentLoaded', () => {
    // Find the consent button by its ID
    const consentButton = document.getElementById('consentButton') as HTMLButtonElement | null;
  
    if (!consentButton) {
      console.error('Consent button not found');
      return;
    }
  
    // Add a click event listener to the button
    consentButton.addEventListener('click', () => {
      // Get the dynamic attributes from the button
      const redirectUri = consentButton.dataset.redirectUri;
      const code = consentButton.dataset.code;
      const state = consentButton.dataset.state;
  
      // Validate that all required attributes are present
      if (!redirectUri || !code || !state) {
        console.error('Missing redirect parameters');
        return;
      }
  
      // Perform the redirect
      window.location.href = `${redirectUri}?code=${code}&state=${state}`;
    });
  });
  
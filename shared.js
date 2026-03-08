// Shared Script for Module 3 Web App

// Central configuration or utility functions can go here
console.log('Shared logic loaded for Module 3');

// For example, a shared function to navigate back to the main hub
function goBackToHub() {
    window.location.href = 'index.html';
}

// Automatically add a back button to submodules if an element with id="navLeft" exists
document.addEventListener('DOMContentLoaded', () => {
    const navLeft = document.getElementById('navLeft');
    // Only add if we aren't already on the hub (index.html), and the container exists
    if (navLeft && !window.location.pathname.endsWith('index.html')) {
        const backBtn = document.createElement('button');
        backBtn.className = 'btn btn-outline';
        backBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 0.5rem;">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Hub`;

        backBtn.addEventListener('click', goBackToHub);
        navLeft.appendChild(backBtn);
    }
});

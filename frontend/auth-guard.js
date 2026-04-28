/**
 * Auth Guard Script
 * Include this in pages that require authentication
 * Ensures JWT token is valid before allowing access
 */

(function() {
    // Check if user is authenticated
    if (!AuthUtil.isAuthenticated()) {
        // Redirect to login if no token
        window.location.href = '/login.html';
        return;
    }

    // Optional: Add logout link handler to all logout buttons
    const setupLogoutHandlers = () => {
        const logoutLinks = document.querySelectorAll('a[href*="logout"]');
        logoutLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                AuthUtil.clearAuth();
                // Redirect directly to the shared login page.
                window.location.href = '/login.html';
            });
        });
    };

    // Setup logout handlers when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupLogoutHandlers);
    } else {
        setupLogoutHandlers();
    }

    // Display user role/info if element exists
    const roleElements = document.querySelectorAll('[data-auth-user], [data-auth-role]');
    roleElements.forEach(element => {
        if (element.hasAttribute('data-auth-user')) {
            element.textContent = AuthUtil.getRole() || 'User';
        }
    });
})();

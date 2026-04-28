/**
 * Authentication Utility Module
 * Handles JWT token storage, validation, and role-based access
 */

const AuthUtil = {
    /**
     * Store JWT token in localStorage
     */
    setToken(token) {
        localStorage.setItem('authToken', token);
    },

    /**
     * Retrieve JWT token from localStorage
     */
    getToken() {
        return localStorage.getItem('authToken');
    },

    /**
     * Store user role in localStorage
     */
    setRole(role) {
        localStorage.setItem('userRole', role);
    },

    setUserId(userId) {
        localStorage.setItem('userId', String(userId));
    },

    getUserId() {
        return localStorage.getItem('userId');
    },

    setUsername(username) {
        localStorage.setItem('username', username);
    },

    getUsername() {
        return localStorage.getItem('username');
    },

    /**
     * Retrieve user role from localStorage
     */
    getRole() {
        return localStorage.getItem('userRole');
    },

    /**
     * Check if user is authenticated (token exists)
     */
    isAuthenticated() {
        return !!this.getToken();
    },

    /**
     * Check if user has specific role
     */
    hasRole(role) {
        return this.getRole() === role;
    },

    /**
     * Clear token and role (logout)
     */
    clearAuth() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
    },

    /**
     * Get dashboard URL based on role
     */
    getDashboardUrl(role) {
        if (role === 'Admin') return '/library_admin/dashboard.html';
        return '/user/dashboard.html';
    },

    /**
     * Get authorization header for API requests
     */
    getAuthHeader() {
        const token = this.getToken();
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    },

    /**
     * Redirect to login if not authenticated
     */
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = '/login.html';
        }
    },

    /**
     * Redirect if already authenticated
     */
    redirectIfAuthenticated() {
        if (this.isAuthenticated()) {
            const dashboardUrl = this.getDashboardUrl(this.getRole());
            window.location.href = dashboardUrl;
        }
    }
};

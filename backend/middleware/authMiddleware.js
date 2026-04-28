const jwt = require('jsonwebtoken');

// JWT secret key - must match the one used in login
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_change_in_production';

/**
 * Middleware to verify JWT token
 * Add this to routes that require authentication
 */
const verifyToken = (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({ 
                success: false, 
                message: 'Authorization header is missing' 
            });
        }

        // Extract token from "Bearer <token>" format
        const token = authHeader.startsWith('Bearer ') 
            ? authHeader.slice(7) 
            : authHeader;

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Attach user info to request object
        req.user = {
            username: decoded.username,
            role: decoded.role
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false, 
                message: 'Token has expired' 
            });
        }
        
        return res.status(401).json({ 
            success: false, 
            message: 'Invalid token',
            error: error.message 
        });
    }
};

/**
 * Middleware to verify JWT token and specific role
 * Usage: verifyTokenAndRole(['Admin']) for admin-only routes
 */
const verifyTokenAndRole = (allowedRoles = []) => {
    return (req, res, next) => {
        try {
            // Get token from Authorization header
            const authHeader = req.headers.authorization;
            
            if (!authHeader) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Authorization header is missing' 
                });
            }

            // Extract token
            const token = authHeader.startsWith('Bearer ') 
                ? authHeader.slice(7) 
                : authHeader;

            // Verify token
            const decoded = jwt.verify(token, JWT_SECRET);
            
            // Check role if specified
            if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Access denied. Insufficient permissions.' 
                });
            }

            // Attach user info to request
            req.user = {
                username: decoded.username,
                role: decoded.role
            };

            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Token has expired' 
                });
            }
            
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid token',
                error: error.message 
            });
        }
    };
};

module.exports = {
    verifyToken,
    verifyTokenAndRole
};

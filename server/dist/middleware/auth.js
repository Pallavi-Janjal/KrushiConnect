"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Authentication required. Please sign in.' });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = (0, jwt_1.verifyToken)(token);
        req.user = payload;
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid or expired session token. Please sign in again.' });
        return;
    }
};
exports.authenticate = authenticate;
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ message: 'Authentication required.' });
            return;
        }
        const normalizedUserRole = req.user.role.toUpperCase();
        const normalizedAllowedRoles = allowedRoles.map(r => r.toUpperCase());
        if (!normalizedAllowedRoles.includes(normalizedUserRole)) {
            res.status(403).json({ message: 'Forbidden. You do not have permission for this action.' });
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;

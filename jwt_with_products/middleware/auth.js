const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];

    // Check if Authorization header exists
    if (!authHeader) {
        return res.status(401).json({
            message: "Access token required",
        });
    }

    // Get token from "Bearer TOKEN"
    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Access token required",
        });
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        if (error) {
            return res.status(403).json({
                message: "Invalid or expired token",
            });
        }

        req.user = user;

        next();
    });
}

module.exports = authenticateToken;

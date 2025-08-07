
// Check if user has required role(s)
exports.checkRole= (roles) => {
return (req, res, next) => {
    try {
    const userRole = req.user.role;
    if (!userRole) {
        return res.status(401).json({ message: 'Unauthorized: No role found' });
    }
    if (roles.includes(userRole)) {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden: Invalid role' });
    }
    } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
    }
};
}


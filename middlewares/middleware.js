import jwt from "jsonwebtoken";

// check login middlewere
export function authMiddleware (req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        res.redirect("/user/login");
    } else {
        const decoded = jwt.verify(token, jwtSecret);
        req.userID = decoded.userID;
        next();
    }
};
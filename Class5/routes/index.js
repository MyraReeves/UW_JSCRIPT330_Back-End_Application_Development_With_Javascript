const { Router } = require("express");
const router = Router();
const jwt = require('jsonwebtoken');


// You'll want to write an `isAuthorized` middleware function that can be reused. It should verify the JWT provided in `req.headers.authorization` and put the decoded value on the `req` object.
// Define Express middleware:
const authorizationMiddleware = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        return res.sendStatus(401);
    }

    const token = authorizationHeader.split(' ')[1];

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    }
    catch (error) {
        return res.sendStatus(401);
    }
};

module.exports = router;

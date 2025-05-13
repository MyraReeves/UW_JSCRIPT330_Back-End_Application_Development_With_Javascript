/////////////////////////////////////////////////////////////////////////////////////////////////////////
// INSTRUCTIONS:  You'll want to write an `isAuthorized` middleware function that can be re-used.     //
// It should verify the JWT provided in `req.headers.authorization`                                  //
// and put the decoded value on the `req` object.                                                   //
/////////////////////////////////////////////////////////////////////////////////////////////////////


// Import the JSON web token library dependency:
const jwt = require("jsonwebtoken");


/////////////////////////////////////////
// Middleware authorization function: //
///////////////////////////////////////
const isAuthorized = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;      // Retrieves the value of the `Authorization` header from the incoming HTTP request.

    // If the header token is missing or does not start with the word `Bearer ` return a 401 error:
    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
        return res.sendStatus(401); // Not authorized because no token was provided
    }

    // Extract the token from the header by looking for what follows the space after the word "Bearer":
    const token = authorizationHeader.split(" ")[1];

    // Attempt to verify and decode the token using the secret stored in the `.env` file (`JWT_SECRET`):
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }

// If an invalid token is given, return a 401 error:
    catch (error) {
        return res.sendStatus(401);
    }
};


module.exports = isAuthorized;
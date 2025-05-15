////////////////////////////////////////////////////////////////////////////////////////////////////
// INSTRUCTIONS:  You'll want to write an `isAdmin` middleware function that can be reused.      //
// If the user making the request is not an admin it should respond with a 403 Forbidden error. //
/////////////////////////////////////////////////////////////////////////////////////////////////

const isAdmin = (req, res, next) => {
    // Before granting access, check who the user is, their role, and that their role includes "admin":
    if (req.user && req.user.roles && req.user.roles.includes("admin")) {
      return next();
    }
    // If they are not an Admin, return a 403 "Forbidden" error:
    return res.sendStatus(403);
  };
  
  module.exports = isAdmin;
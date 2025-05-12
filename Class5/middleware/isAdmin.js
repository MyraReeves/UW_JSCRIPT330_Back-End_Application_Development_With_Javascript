// INSTRUCTIONS:  You'll want to write an `isAdmin` middleware function that can be reused. If the user making the request is not an admin it should respond with a 403 Forbidden error.

const isAdmin = (req, res, next) => {
    if (req.user && req.user.roles.includes("admin")) {
      return next();
    }
    return res.sendStatus(403);
  };
  
  module.exports = isAdmin;
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const isAdmin = require("../middleware/isAdmin");
const isAuthorized = require("../middleware/isAuthorized");
const userDao = require("../DAOS/userDao");
const router = express.Router();


//////////////////////
// New User Signup //
////////////////////
router.post("/signup", async (req, res) => {
    const { email, password, roles = ["user"] } = req.body;

    // Check first that the email and password aren't empty strings. If they are, then return a 400 Bad Request error:
    if (!email || !password || password.trim() === ""){
        return res.sendStatus(400)
    }

    try {
        const hashed = await bcrypt.hash(password, 10);
        const user = await userDao.createUser({ email, password: hashed, roles });
        await user.save();
        res.status(201).json({ message: "New user successfully created!" });
    }
    catch (error) {
        // "MongoDB/Mongoose uses error code 11000 when a unique constraint is violated — which is what happens if the email already exists."
        if (error.code === 11000) {
            // The auth.test file says instead that it "should return 409 Conflict with a repeat signup."
            return res.status(409).json({ message: "Email already in use" });
          }
        
        // A generic 400 error can be used for all other creation errors:
          res.sendStatus(400);
        }
});



////////////
// Login //
//////////
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Check that both email and password have been provided.  If not, return a 400 error:
    if (!email || !password || password.trim() === "") {
        return res.status(400).json({ message: "Both email and password are required" });
    }

    try {

        // Find a user within the database using their email address:
        const user = await userDao.findUserByEmail(email);

        // Return an "Unauthorized" error if the user email address can't be found:
        if (!user) return res.sendStatus(401);

        // Compare the entered password with the one saved in the DB for that user:
        const match = await bcrypt.compare(password, user.password);

        // Return an "Unauthorized" error if the password credentials don't match:
        if (!match) return res.sendStatus(401);

        // Otherwise, generate an encrypted JSON web token for the authenticated user:
        const token = jwt.sign(
            { _id: user._id, email: user.email, roles: user.roles },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        // and return it inside the response:
        res.json({ token });
    }

    // Send an internal server error 500 if the log in attempt fails for some other reason:
    catch (error) {
        res.sendStatus(500);
    }
});


//////////////////////
// Change password //
////////////////////
router.put("/password", isAuthorized, async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        // Find the user by their id:
        const user = await userDao.findUserById(req.user._id);

        // Return an error if the user is not found:
        if (!user) return res.sendStatus(404);

        // Compare the entered password with the one saved inside the DB
        const match = await bcrypt.compare(oldPassword, user.password);

        // Return an "Unauthorized" error if the previous password that is entered does not match what was saved:
        if (!match) return res.sendStatus(401);

        // Otherwise, encrypt the new password and save it:
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.json({ message: "Password updated" });
    }

    // Send an interal server error 500 if the password change attempt failed for some other reason:
    catch (error) {
        res.sendStatus(500);
    }
});


/////////////////////////////////
// DELETE a user - Admin only //
///////////////////////////////
router.delete("/:id", isAuthorized, isAdmin, async (req, res) => {
    try {
        const deleted = await userDao.deleteUser(req.params.id);

        // If the user is not found, return a 404 error:
        if (!deleted) return res.sendStatus(404);

        // Otherwise, send confirmation that the user was deleted:
        res.json({ message: "User deleted" });
    } 
    catch (err) {
        res.sendStatus(500);
    }
  });


module.exports = router;
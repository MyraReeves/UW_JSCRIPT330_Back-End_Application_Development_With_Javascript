const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const isAuthorized = require("../middleware/isAuthorized");
const router = express.Router();


//////////////////////
// New User Signup //
////////////////////
router.post("/signup", async (req, res) => {
    const { email, password, roles = ["user"] } = req.body;

    try {
        const hashed = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashed, roles });
        await user.save();
        res.status(201).json({ message: "New user successfully created!" });
    }
    catch (error) {
        res.sendStatus(400);
    }
});


////////////
// Login //
//////////
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Return an error if the user email address can't be found:
        const user = await User.findOne({ email });
        if (!user) return res.sendStatus(401);

        // Return an error if the password credentials don't match:
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.sendStatus(401);

        // Otherwise, generate a JSON web token for the authenticated user:
        const token = jwt.sign(
            { _id: user._id, roles: user.roles },
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
        // Return an error if the user is not found:
        const user = await User.findById(req.user._id);
        if (!user) return res.sendStatus(404);

        // Return an error if the previous password that is entered does not match what's on file:
        const match = await bcrypt.compare(oldPassword, user.password);
        if (!match) return res.sendStatus(401);

        // Otherwise, encrypt the new password and save it:
        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.json({ message: "Password updated" });
    }

    // Send an interal server error 500 if the password change attempt failed for some other reason:
    catch (error) {
        res.sendStatus(500).json;
    }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { isLoggedIn } = require("../middleware.js"); // Import isLoggedIn middleware
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");


// Handle signup form rendering and submission
router.route("/signup")
    .get(userController.renderSignUpForm)
    .post(wrapAsync(userController.signUp));

// Render login form
router.get("/login", userController.renderLoginForm);

// Handle login form submission
router.post("/login", saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
}), userController.login);

// Handle logout
router.get("/logout", userController.logOut);

module.exports = router;

const User = require('../models/user.js'); // Import User model
const passport = require('passport');

module.exports.renderSignUpForm = (req, res) => {
    res.render("users/signup.ejs"); 
};

module.exports.signUp = async (req, res, next) => { 
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "Welcome to Wanderlust");
            let redirectUrl = res.locals.redirectUrl || "/listings";
            res.redirect(redirectUrl);
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs"); 
};

module.exports.login = (req, res) => {
    req.flash("success", "Welcome Back To Wanderlust..!");
    res.redirect(res.locals.redirectUrl || '/listings');
};

module.exports.logOut = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "You are logged out successfully.");
        res.redirect("/listings");
    });
};

var express = require("express");
var router = express.Router();
var passport = require("passport");
var user = require("../models/user");

router.get("/", function(req, res){
    res.render("home");
});

// =============
// AUTH ROUTES
// =============
// show registration form
router.get("/register", function(req, res){
	res.render("./auth/register");
});

router.post("/register", function(req, res){
	var newUser = new user({username: req.body.username});
    user.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.redirect('/register');
        }
        passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to YelpCamp "+user.username);
           res.redirect("/");
        });
    });
});


// show login form
router.get("/login", function(req, res){
	res.render("./auth/login");
});

//login logic
router.post("/login", passport.authenticate("local",
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	})
);

router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "You logged out successfully");
	res.redirect("/campgrounds");
});

module.exports = router;
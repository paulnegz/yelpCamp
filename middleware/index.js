var express = require("express");
var campground = require("../models/campground");
var comment = require("../models/comment");
// middleware goes here
var middlewareOBJ ={};
middlewareOBJ.checkCampgroundOwnership = function(req, res, next){
	if(req.isAuthenticated()){
        campground.findById(req.params.id, function(err, foundCampground){
           if(err || !foundCampground){
			   req.flash("error", "Campground not found");
               res.redirect("back");
           }  else {
               // does user own the campground?
            if(foundCampground.author.id.equals(req.user._id)) {
                next();
            } else {
				req.flash("error", "You do not have permission to do that");
                res.redirect("back");
            }
           }
        });
    } else {
		req.flash("error", "You need to be logged in");
        res.redirect("/login");
    }
};

middlewareOBJ.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
        comment.findById(req.params.comment_id, function(err, foundComment){
           if(err || !foundComment){
			   req.flash("error", "Comment not found");
               res.redirect("back");
           }  else {
               // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)) {
                next();
            } else {
				req.flash("error", "You do not have permission to do that");
                res.redirect("/login");
            }
           }
        });
    } else {
		req.flash("error", "You need to be logged in");
        res.redirect("back");
    }
};

middlewareOBJ.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
	req.flash("error", "You need to be logged in");
    res.redirect("/login");
};

module.exports = middlewareOBJ;
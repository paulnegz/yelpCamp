var express = require("express");
var router  = express.Router({mergeParams: true});
var campground = require("../models/campground");
var comment = require("../models/comment");
var middleware = require("../middleware/index");
// =============================
// COMMENTS ROUTE
// =============================
router.get("/new", middleware.isLoggedIn, function(req, res){
	var id = req.params.id;
	campground.findById(id,function (err, foundCampground){
		if(err){
			console.log(err); 
		} else{
			// console.log(foundCampground);
			//render show template with that id
			res.render("./comments/new",{campground:foundCampground});
		}
	});	
});

router.post("/", middleware.isLoggedIn, function(req, res){
	//find camp ground using id
	//create new comment
	//connect comment to post
	//redirect to campground show page 	
	var commentOBJ = req.body.comment;
	var id = req.params.id;
	campground.findById(id,function (err, foundCampground){
		if(err){
			console.log(err); 
		} else{
			// console.log(foundCampground);
			//render show template with that id
			comment.create(commentOBJ, function(err, newComment){
				if(err){
					console.log(err);
				} else{
					//add username and id to comment
					newComment.author.id = req.user._id;	
					newComment.author.username = req.user.username;
					newComment.save();
					foundCampground.comments.push(newComment);
					foundCampground.save();
					req.flash("success", "Comment was added");
				}
				
			});
		}
	});
	res.redirect("/campgrounds/"+id);	
});
//edit comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	var comment_id = req.params.comment_id;
	var id = req.params.id;
	
	campground.findById(id, function(err, foundCampground){
		if(err|| !foundCampground)
			{
				req.flash("error", "Campground not found");
				return res.redirect("back");
			}
		comment.findById(comment_id, function(err, foundComment){
		if(err){
			console.log(err);
			res.redirect("back");
		} else{
			res.render("./comments/edit",{campground_id: id, comment:foundComment});
		} 
	});
	});	
});

//update comment
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	var comment_id = req.params.comment_id;
	comment.findByIdAndUpdate(comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			console.log(err);
			res.redirect("back");
		} else{
			res.redirect("/campgrounds/"+req.params.id);
		} 
	});
});

//update comment
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	var comment_id = req.params.comment_id;
	comment.findByIdAndRemove(comment_id, function(err){
		if(err){
			console.log(err);
			res.redirect("back");
		} else{
			req.flash("success", "Comment deleted");
			res.redirect("/campgrounds/"+req.params.id);
		} 
	});
});



module.exports = router;
var express = require("express");
var router = express.Router({mergeParams: true});
var campground = require("../models/campground");
var comment = require("../models/comment");
var middleware = require("../middleware/index");


router.get("/", function(req, res){
	//Get all camprounds from DataBase
	campground.find({}, function(err, campground){
		if (err){
			console.log(err);
		}else{
			 res.render("./campgrounds/index",{campgrounds:campground});
			}
	});
});

router.post("/", middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
	var description = req.body.description;
	var price = req.body.price;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	//create a new campground and save to database
	campground.create(
	{
	name: name,
	image: image,
	price: price,	
	description: description,
	author: author
	}, function(err, newCampground){
		if(err || !newCampground){
		console.log(err);
		req.flash("error", "Campground not created");
		} else{
			newCampground.populate("author");
			req.flash("success", "Campground was successfully added");
		}
	
	
	});
    //redirect back to campgrounds page
    res.redirect("/campgrounds");
});

router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("./campgrounds/new.ejs"); 
});

router.get("/:id", function(req, res){
	//find campground with provided id
	var id = req.params.id;
	campground.findById(id).populate("comments").exec(function (err, foundCampground){
		if(err || !foundCampground){
			console.log(err); 
			req.flash("error", "Campground not found");
			return res.redirect("/camprounds");
		} else{
			// console.log(foundCampground);
			//render show template with that id
			res.render("./campgrounds/show",{campground:foundCampground});
		}
	});
});

// EDIT CAMPGROUNDS
router.get("/:id/edit", middleware.checkCampgroundOwnership,  function(req, res){
	var id = req.params.id;
	campground.findById(id, function (err, foundCampground){
		res.render("./campgrounds/edit",{campground:foundCampground});
	});
});


// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    // find and update the correct campground
    campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err || !updatedCampground){
		   console.log(err);
           res.redirect("/campgrounds");
       } else {
           //redirect somewhere(show page)
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});

// DESTROY CAMPGROUNDS
router.delete("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    campground.findByIdAndRemove(req.params.id, (err, campgroundRemoved) => {
        if (err) {
            console.log(err);
        }
        comment.deleteMany( {_id: { $in: campgroundRemoved.comments } }, (err) => {
            if (err) {
                console.log(err);
            }
			req.flash("success", "Campground deleted");
            res.redirect("/campgrounds");
        });
    });
});


module.exports = router;
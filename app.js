var express				  = require("express");
var app 				  = express();
var mongoose 			  = require("mongoose");
var passport 			  = require("passport");
var flash    			  = require("connect-flash");
var LocalStrategy 		  = require("passport-local");
var methodOverride   	  = require("method-override");
var passportLocalMongoose = require("passport-local-mongoose");
var bodyParser 			  = require("body-parser");
var campground			  = require("./models/campground");
var comment				  = require("./models/comment");
var user 				  = require("./models/user");
var seedDB 				  = require("./seeds");
// INCLUDING ROUTES
var commentRoutes = require("./routes/comments");
var indexRoutes = require("./routes/index");
var campgroundsRoutes = require("./routes/campgrounds");

app.use(flash());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(require("express-session")({
		secret: 		   "This can be anything at all. For encoding data",
		resave: 		   false,
		saveUninitialized: false
	}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

// mongoose.connect('mongodb://localhost/yelp_camp',{
mongoose.connect('mongodb+srv://paulnegz:sKullcandiEs8991!@cluster0-6p1ed.mongodb.net/test?retryWrites=true&w=majority',{
	useNewUrlParser: true,
	useCreateIndex: true
}).then(() =>{
	console.log('Connected to DB!');
}).catch(err=> {
	console.log('ERROR:',err.message);
});
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});
// seedDB(); //seed the datatbase

app.use(indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundsRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp Server Has Started!");
});
// app.listen(3000, function(){
//    console.log("The YelpCamp Server Has Started!");
// });

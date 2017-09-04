var express     = require("express"),
app             = express(),
bodyParser      = require("body-parser"),
mongoose        = require("mongoose"),
flash           = require("connect-flash"),
passport        = require("passport"),
LocalStrategy   = require("passport-local"),
methodOverride  = require("method-override"),
Campground      = require("./models/campground"),
User            = require("./models/user"),
Comment         = require("./models/comment"),
seedDB          = require("./seeds");


// requiring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes       = require("./routes/index");


// connecting to the database
// local DB
// mongoose.connect("mongodb://localhost/yelp_camp");

// mLAB
mongoose.connect("mongodb://patrykbaklaj:password@ds125774.mlab.com:25774/yelp_camp");

// mongodb://patrykbaklaj:password@ds125774.mlab.com:25774/yelp_camp

// app setup
app.use(flash());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");

// executing seeds
// seedDB();



// PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret: "My name is Patryk",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use( function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


// app.listen(3000, function(){
//   console.log("Server is listening on port 3000");
//   console.log("YelpCamp v1");
// });
app.listen(process.env.PORT, process.env.IP, function(){
  console.log("Server started...");
});

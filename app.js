var express     = require("express"),
app             = express(),
bodyParser      = require("body-parser"),
mongoose        = require("mongoose"),
passport        = require("passport"),
LocalStrategy   = require("passport-local"),
Campground      = require("./models/campground"),
User            = require("./models/user"),
Comment         = require("./models/comment"),
seedDB          = require("./seeds");


// requiring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes       = require("./routes/index");


// connecting to the database
mongoose.connect("mongodb://localhost/yelp_camp");

// app setup
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
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
  next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(3000, function(){
  console.log("Server is listening on port 3000");
  console.log("YelpCamp v1");
});

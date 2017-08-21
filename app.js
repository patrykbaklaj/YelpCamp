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


// connecting to the database
mongoose.connect("mongodb://localhost/yelp_camp");

// app setup
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

app.get("/", function(req, res){
  res.render("landing");
});
// executing seeds
seedDB();

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


// INDEX -show all campgrounds
app.get("/campgrounds", function(req, res){
  // get All camps from database
  Campground.find({}, function(err, allCamps){
    if (err) {
      console.log("An error occurred");
      console.log(err);
    } else {
      res.render("campgrounds/index", {campgrounds: allCamps});
    }
  });
});

// CREATE - add new camps to database
app.post("/campgrounds", function(req, res){
  // get data from form
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newCampground = {
    name: name,
    image: image,
    description: desc
  }
  // creating new camp and save to the database
  Campground.create(newCampground, function(err, newCamp){
    if (err) {
      console.log("An error occurred");
      console.log(err);
    } else {
      // redirecting to campgrounds
      res.redirect("/campgrounds");
    }
  });
});

// NEW - display form to add new camp
app.get("/campgrounds/new", function(req, res){
  res.render("campgrounds/new");
});

// SHOW - shows more info about one (single) camp with provided ID
app.get("/campgrounds/:id", function(req, res){
  //find the campground with provided ID
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    if (err) {
      console.log(err);
    } else {
      // render SHOW template with one campground
      res.render("campgrounds/show", {campground: foundCampground});
    }
  });
});

// ======================
//  COMMENTS ROUTES
// ======================

app.get("/campgrounds/:id/comments/new", isLoggedIn , function(req, res){
  // find camp by Id and pass through to render page
  Campground.findById(req.params.id, function(err, campground){
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", {campground});
    }
  })
});

app.post("/campgrounds/:id/comments", isLoggedIn , function(req, res){
  // lookup campground using id
  Campground.findById(req.params.id, function(err, campground){
    if (err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, function(err, comment){
        if (err) {
          console.log(err);
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
        }
      })
    }
  });
});

// =========================
// AUTHENTICATION ROUTES
// =========================

// show register form
app.get("/register", function(req, res){
  res.render("register");
});

// handle sign up logic
app.post("/register", function(req, res){
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, function(err, user){
    if (err) {
      console.log(err);
      return res.render("register");
    }
    passport.authenticate("local")(req, res, function(){
      res.redirect("/campgrounds");
    });
  });
});

// shows login form
app.get("/login", function(req, res){
  res.render("login");
});

// handling login logic
app.post("/login",
passport.authenticate("local",
{
  successRedirect: "/campgrounds", failureRedirect: "/login"
}), function(req, res){
});

// logout route
app.get("/logout", function(req, res){
  req.logout();
  res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

app.listen(3000, function(){
  console.log("Server is listening on port 3000");
  console.log("YelpCamp v1");
});

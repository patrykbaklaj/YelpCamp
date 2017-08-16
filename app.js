var express     = require("express"),
app         = express(),
bodyParser  = require("body-parser"),
mongoose    = require("mongoose"),
Campground  = require("./models/campground"),
Comment     = require("./models/comment"),
seedDB      = require("./seeds");


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

// INDEX -show all campgrounds
app.get("/campgrounds", function(req, res){
  // get All camps from database
  Campground.find({}, function(err, allCamps){
    if (err) {
      console.log("An error occurred");
      console.log(err);
    } else {
      console.log("successfully added new item");
      console.log(allCamps);
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
      console.log("successfully added new item to DB");
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

app.get("/campgrounds/:id/comments/new", function(req, res){
  // find camp by Id and pass through to render page
  Campground.findById(req.params.id, function(err, campground){
    if (err) {
      console.log(err);
    } else {
      res.render("comments/new", {campground});
    }
  })
});

app.post("/campgrounds/:id/comments", function(req, res){
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

app.listen(3000, function(){
  console.log("Server is listening on port 3000");
  console.log("YelpCamp v1");
});

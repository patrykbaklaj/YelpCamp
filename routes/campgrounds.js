var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

// INDEX -show all campgrounds
router.get("/", function(req, res){
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
router.post("/", middleware.isLoggedIn , function(req, res){
  // get data from form
  var name = req.body.name;
  var price = req.body.price;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
  var newCampground = {
    name: name,
    price: price,
    image: image,
    description: desc,
    author: author
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
router.get("/new", middleware.isLoggedIn , function(req, res){
  res.render("campgrounds/new");
});

// SHOW - shows more info about one (single) camp with provided ID
router.get("/:id", function(req, res){
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

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership , function(req, res){
  Campground.findById(req.params.id, function(err, foundCampground){
    res.render("campgrounds/edit", {campground: foundCampground});
  });
});


// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership , function(req, res){
  // find and update a correct campground
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
    if (err) {
      res.redirect("/campgrounds");
    } else {
      // redirect somewhere
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// Destroy Routes
router.delete("/:id", middleware.checkCampgroundOwnership , function(req, res){
  Campground.findByIdAndRemove(req.params.id, function(err){
    if (err) {
      res.redirect("/campgrounds");
    } else {
      res.redirect("/campgrounds");
    }
  })
});

module.exports = router;

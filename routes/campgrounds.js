var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

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
router.post("/", function(req, res){
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
router.get("/new", function(req, res){
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

module.exports = router;

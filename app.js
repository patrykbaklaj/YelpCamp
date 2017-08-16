var express     = require("express"),
app         = express(),
bodyParser  = require("body-parser"),
mongoose    = require("mongoose"),
Campground  = require("./models/campground"),
seedDB      = require("./seeds");

// executing seeds
seedDB();

// connecting to the database
mongoose.connect("mongodb://localhost/yelp_camp");

// app setup
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// creating sample item and adding to the database
// Campground.create(
//   {
//     name: "Granite Hill",
//     image: "http://soaringeaglecampground.com/test/wp-content/uploads/2014/01/view-of-the-basket-at-Soaring-Eagle.jpg",
//     description: "This is a huge Granit Hill campground!"
//   },
//   function(err, item) {
//       if (err) {
//         console.log("An Error Occurred");
//         console.log(err);
//       } else {
//         console.log("successfully created and added item to database");
//         console.log(item);
//       }
//     });


    app.get("/", function(req, res){
      res.render("landing");
    });

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
          res.render("index", {campgrounds: allCamps});
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
      res.render("new.ejs");
    });

// SHOW - shows more info about one (single) camp with provided ID
app.get("/campgrounds/:id", function(req, res){
  //find the campground with provided ID
  Campground.findById(req.params.id, function(err, foundCampground){
    if (err) {
      console.log(err);
    } else {
      res.render("show", {campground: foundCampground});
    }
  });
  // render SHOW template with one campground
});


    app.listen(3000, function(){
      console.log("Server is listening on port 3000");
      console.log("YelpCamp v1");
    });

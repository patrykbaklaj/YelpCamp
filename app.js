var express     = require("express"),
app         = express(),
bodyParser  = require("body-parser"),
mongoose    = require("mongoose");

// connecting to the database
mongoose.connect("mongodb://localhost/yelp_camp");

// app setup
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// schema setup
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String
});

// compiling into a model
var Campground = mongoose.model("Campground", campgroundSchema);

// creating sample item and adding to the database
// Campground.create(
//   {
//     name: "Granite Hill",
//     image: "http://soaringeaglecampground.com/test/wp-content/uploads/2014/01/view-of-the-basket-at-Soaring-Eagle.jpg"}, function(err, item) {
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

    app.get("/campgrounds", function(req, res){
      // get All camps from database
      Campground.find({}, function(err, allCamps){
        if (err) {
          console.log("An error occurred");
          console.log(err);
        } else {
          console.log("successfully added new item");
          console.log(allCamps);
          res.render("campgrounds", {campgrounds: allCamps});
        }
      });
    });

    app.post("/campgrounds", function(req, res){
      // get data from form
      var name = req.body.name;
      var image = req.body.image;
      var newCampground = {
        name: name,
        image: image
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

    app.get("/campgrounds/new", function(req, res){
      res.render("new.ejs");
    });

    app.get("/*", function(req, res){
      res.send("Sorry! Page not found! Please make sure the URL is correct");
    });



    app.listen(3000, function(){
      console.log("Server is listening on port 3000");
      console.log("YelpCamp v1");
    });

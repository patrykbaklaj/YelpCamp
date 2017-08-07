var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");


var campgrounds = [
  {name: "Salmon Creek", image: "https://img.hipcamp.com/image/upload/c_limit,f_auto,h_1200,q_60,w_1920/v1440478008/campground-photos/csnhvxn0qcki2id5vxnc.jpg"},
  {name: "Granite Hill", image: "http://soaringeaglecampground.com/test/wp-content/uploads/2014/01/view-of-the-basket-at-Soaring-Eagle.jpg"},
  {name: "Montain Goat", image: "https://www.nhstateparks.org/uploads/images/Dry-River_Campground_02.jpg"},
  {name: "Deep hole", image: "http://pickwick-dam.com/wp-content/uploads/2015/08/17991101764_fcb19c7311_k.jpg"}
];


app.get("/", function(req, res){
  res.render("landing");
});

app.get("/campgrounds", function(req, res){
  res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", function(req, res){
  // get data from form
  var name = req.body.name;
  var image = req.body.image;
  var newCampground = {
    name: name,
    image: image
  }
  // add data to array
  campgrounds.push(newCampground);
  // redirect
  res.redirect("/campgrounds");
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

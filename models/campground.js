var mongoose = require("mongoose");

// schema setup
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});


// compiling into a model and exporting
module.exports = mongoose.model("Campground", campgroundSchema);

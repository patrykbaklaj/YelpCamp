var mongoose = require("mongoose");
var Campground = require("./models/campground");

// sample data to work with
var data = [
  {
    name: "Rykowisko",
    image: "http://nagniatamy.pl/wp-content/uploads/2014/08/namiot-w-lesie.jpg",
    description: "Na łonie natury..."
  },
  {
    name: "Nad rzeką",
    image: "http://st.depositphotos.com/1012051/1355/i/950/depositphotos_13554478-stock-photo-tents-at-river-in-remote.jpg",
    description: "Biwak nad brzegiem rzeki."
  },
  {
    name: "W górach",
    image: "https://cdn7.podroze.smcloud.net/t/photos/138252/namiot-w-gorach.jpg",
    description: "Ekstremalnie..."
  }
]


function seedDB(){
  // remove all campgrounds
  Campground.remove({}, function(err){
    if (err) {
      console.log(err);
    } else {
      console.log("Campgrounds removed");
      // add a few Campgrounds
      data.forEach(function(seed){
        Campground.create(seed, function(err, data){
          if (err) {
            console.log(err);
          } else {
            console.log("Added campground");
          }
        });
      })
    }
  });
  // add a few comments
}

module.exports = seedDB;

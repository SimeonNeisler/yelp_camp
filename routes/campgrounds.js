var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");


//Campground Routes
router.get("/", (req, res) => {
  console.log(req.user);
  //Get Campgrounds from db
  Campground.find({}, (err, campgrounds) => {
    if(err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", {
        campgrounds: campgrounds
      });
    }
  });
});


//NEW - show form to create new campground
router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new")
});


//CREATE - adds new campground to DB
router.post("/", isLoggedIn, (req, res) => {
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  }
    Campground.create({
      name: name,
      image: image,
      description: desc,
      author: author
    }, function(err, campground) {
      if (err) {
        console.log(err);
      } else {
        console.log("New Campground!");
        console.log(campground);
      }
    });
  res.redirect("/campgrounds");
});


//Find campground with provided ID
router.get("/:id", (req, res) => {
  Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
    if(err) {
      console.log(err);
    } else {
      console.log(foundCampground);
      res.render("campgrounds/show", {campground: foundCampground});
    }
  });
});

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = router;

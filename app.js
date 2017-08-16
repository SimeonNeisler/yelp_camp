var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment");
    seedDB = require("./seeds"),
    app = express();


seedDB();
mongoose.connect("mongodb://localhost/yelpcamp");


Campground.find();


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.render("landing");
});

app.get("/campgrounds", (req, res) => {
  //Get Campgrounds from db
  Campground.find({}, (err, campgrounds) => {
    if(err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", {campgrounds: campgrounds})
    }
  });
});


//NEW - show form to create new campground
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new")
});


//CREATE - adds new campground to DB
app.post("/campgrounds", (req, res) => {
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
    Campground.create({
      name: name,
      image: image,
      description: desc
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

app.get("/campgrounds/:id", (req, res) => {
  //Find campground with provided ID
  Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
    if(err) {
      console.log(err);
    } else {
      console.log(foundCampground);
      res.render("campgrounds/show", {campground: foundCampground});
    }
  });
});

// =====================
// Comment Routes
// =====================

app.get("/campgrounds/:id/comments/new", (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if(err) {
      console.log(err);
    } else {
      res.render("comments/new", {campground: campground});
    }
  });
});

app.post("/campgrounds/:id/comments", (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    if(err) {
      console.log(err);
      res.redirect("/campgrounds");
    } else {
      Comment.create(req.body.comment, (err, comment) => {
        if(err) {
          console.log(err);
        } else {
          campground.comments.push(comment);
          campground.save();
          res.redirect("/campgrounds/" + campground._id);
        }
      })
    }
  });
})

app.listen(3000, process.env.IP, (req, res) => {
  console.log("Server online");
});

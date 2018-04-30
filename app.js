//////////
// INIT //
//////////
var express        = require("express");
var app            = express();
var bodyParser     = require("body-parser");
var mongoose       = require("mongoose");
var flash          = require("connect-flash");
var Room           = require("./models/room");
var Comment        = require("./models/comment");
var User           = require("./models/user");
var passport       = require("passport");
var LocalStartergy = require("passport-local");
var methodOverride = require("method-override");

app.use(require("express-session")({
    secret: "secret passcode",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStartergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect("mongodb://localhost/yelp_room");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine", "ejs");

app.use(function(req, res, next){
   res.locals.currentUser = req.user; 
   res.locals.error       = req.flash("error");
   res.locals.success     = req.flash("success");
   next();
});


////////////
// ROUTES //
////////////
var commentRoutes = require("./routes/comments");
var roomRoutes = require("./routes/rooms");
var indexRoutes = require("./routes/index");

app.use(indexRoutes);
app.use(commentRoutes);
app.use(roomRoutes);


////////////
// SERVER //
////////////
app.listen(3000, function(){
    console.log("YelpRoom server started");
});

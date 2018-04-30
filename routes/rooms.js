var express = require("express");
var router = express.Router();

var Room       = require("../models/room");
var middleware = require("../middleware/index");

router.get("/rooms", function(req, res){
    Room.find({}, function(err, rooms){
        if(err)
            console.log("ERROR");
        else
            res.render("rooms/index", {rooms: rooms});
    });
});

router.post("/rooms", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.desc;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newRoom = {name: name, description: desc, image: image, author: author};
    Room.create(newRoom, function(err, newlyCreated){
        if(err)
            console.log("ERROR");
        else
            res.redirect("/rooms");
    });
});

router.get("/rooms/new", middleware.isLoggedIn, function(req, res){
    res.render("rooms/new.ejs");
});

router.get("/rooms/:id", function(req, res){
    Room.findById(req.params.id).populate("comments").exec(function(err, foundRoom){
        if(err)
            console.log("ERROR");
        else if(foundRoom === null)
            res.send("404");
        else {
            res.render("rooms/show", {room: foundRoom});
        }
    });
});

router.get("/rooms/:id/edit", middleware.checkRoomOwnership, function(req, res){
    Room.findById(req.params.id, function(err, foundRoom){
        res.render("rooms/edit", {room: foundRoom}); 
    });
});

router.put("/rooms/:id", middleware.checkRoomOwnership, function(req, res){
    Room.findByIdAndUpdate(req.params.id, req.body.room, function(err, updatedRoom){
        if(err)
            res.redirect("/rooms");
        else
            res.redirect("/rooms/" + req.params.id);
    });
});

router.delete("/rooms/:id", middleware.checkRoomOwnership, function(req, res){
    Room.findByIdAndRemove(req.params.id, function(err){
        if(err)
            res.redirect("/rooms");
        else
            res.redirect("/rooms");
    });
});

module.exports = router;

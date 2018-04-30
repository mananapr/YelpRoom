var express = require("express");
var router = express.Router();

var Room = require("../models/room");
var Comment = require("../models/comment");
var middleware = require("../middleware/index");

router.get("/rooms/:id/comments/new", middleware.isLoggedIn, function(req, res) {
    Room.findById(req.params.id, function(err, room){
        if(err)
            console.log(err);
            else {
            res.render("comments/new", {room: room});
        }
    });
});

router.post("/rooms/:id/comments", middleware.isLoggedIn, function(req, res){
    Room.findById(req.params.id, function(err, room){
        if(err)
            console.log(err);
        else
        {
            Comment.create(req.body.comment, function(err, comment){
                if(err)
                    console.log(err);
                else
                {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    room.comments.push(comment);
                    room.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect('/rooms/'+room._id);
                }
            });
        }
    });
});

router.get("/rooms/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err)
            res.redirect("back");
        else
            res.render("comments/edit", {room_id: req.params.id, comment: foundComment});
    });
});

router.put("/rooms/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err)
            res.redirect("back");
        else
        {
            req.flash("success", "Comment Updated Successfully!");
            res.redirect("/rooms/" + req.params.id);
        }       
    });
});

router.delete("/rooms/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err)
            res.redirect("back");
        else
        {
            req.flash("success", "Comment Deleted Successfully!");
            res.redirect("/rooms/" + req.params.id);
        }                           
    });
});

module.exports = router;

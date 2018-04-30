var Room = require("../models/room");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkRoomOwnership = function(req, res, next) {
    if(req.isAuthenticated())
    {
        Room.findById(req.params.id, function(err, foundRoom){
            if(err) {
                req.flash("error", "Room Not Found!");
                res.redirect("back");
            }
            else {
                if(foundRoom.author.id.equals(req.user._id))
                    next();
                else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }   
        });
    }
    else
    {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated())
    {
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err) {
                req.flash("error", "Comment not found");
                res.redirect("back");
            }
            else {
                if(foundComment.author.id.equals(req.user._id))
                    next();
                else
                {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");

                 }   
            }
        });
    }
    else 
    {
        req.flash("error", "You don't have permission to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next)
{
    if(req.isAuthenticated())
    {
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;

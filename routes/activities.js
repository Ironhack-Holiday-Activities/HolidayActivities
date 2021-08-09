const router = require("express").Router();
const mongoose = require("mongoose");
const isLoggedIn = require("../middleware/isLoggedIn");

// Require the User model in order to interact with the database
const User = require("../models/User.model");
const Activity = require("../models/Activity.model");

router.get("/list", (req, res) => {
    Activity.find().populate('author') 
    .then((activitiesFromDB) => {
      console.log("list"+ (activitiesFromDB));
      res.render("activities/list", {activities: activitiesFromDB});
    });
});

// POST route to delete an activity from the database
router.post("/activities/:activityId/delete", isLoggedIn, (req, res, next) => {
  const { activityId } = req.params;
  Activity.findByIdAndDelete(activityId)
    .then(() => res.redirect("activities/list"))
    .catch((error) => next(error));
});

module.exports = router;

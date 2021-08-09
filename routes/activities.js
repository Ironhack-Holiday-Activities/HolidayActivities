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

router.get("/create", (req, res) => {
  res.render("activities/create");
});

router.post("/create", (req, res) => {
  const { title, description, startDate, meetingPoint } = req.body;
  Activity.create({ title, description, startDate, meetingPoint })
    .then(activityFromDB => {
       console.log(`New Activity created: ${activityFromDB.title}.`)
       res.redirect('list');  
    })
    .catch(error => next(error));
});

module.exports = router;

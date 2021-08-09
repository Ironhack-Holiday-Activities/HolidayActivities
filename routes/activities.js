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

router.post("/create", (req, res, next) => {
  let user = req.session.user;
  
  let objectToCreate = {
    title: req.body.title,
    description: req.body.description,
    startDate: req.body.startDate,
    meetingPoint: req.body.meetingPoint,
    //image: req.body.image,
    author: user
  }

  console.log(objectToCreate);
  Activity.create(objectToCreate)
    .then(activityFromDB => {
       console.log(`New Activity created: ${activityFromDB.title}.`)
       res.redirect('/activities/list');
    })
    .catch(error =>
        {
          //Handle Create Error 
          next(error);
        })
});

// POST route to delete an activity from the database
router.post("/:activityId/delete", isLoggedIn, (req, res, next) => {
  const { activityId } = req.params;
  Activity.findByIdAndDelete(activityId)
    .then(() => {
      console.log("Deleted Activity sucessful");
      res.redirect("/");
    })
    .catch((error) => next(error));
});

module.exports = router;

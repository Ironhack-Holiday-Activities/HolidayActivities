const router = require("express").Router();
const mongoose = require("mongoose");
const isLoggedIn = require("../middleware/isLoggedIn");

// Require the User model in order to interact with the database
const User = require("../models/User.model");
const Activity = require("../models/Activity.model");

router.get("/list", (req, res) => {
    Activity.find().populate('author') 
    .then((activitiesFromDB) => {
      res.render("activities/list", {activities: activitiesFromDB});
    });
});

router.get("/:activityId/details", (req, res) => {
  const { activityId } = req.params;
  Activity.findById(activityId).populate('author attendants')
  .then (activityFromDB => {
    console.log("Details for" + activityFromDB);
    res.render("activities/details", { activity: activityFromDB });
  })
});

router.get("/:activityId/book", (req, res, next) => {
  const { activityId } = req.params;
  let user = req.session.user;

  Activity.findById(activityId).then(activityToEdit => {
    if(!activityToEdit.attendants.contains(user)) {
      activityToEdit.attendants.push(user);
      console.log("Activity Booked "+activityToEdit);
      Activity.findByIdAndUpdate(activityId, activityToEdit).then(editedActivity => {
        res.redirect('/activities/list');
      })
    } else {
      console.log("User has allready booked");
    }
  })
    .catch(error => {
      //Handle Create Error 
      //next(error);
    })
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

// POST route to edit an activity from the database
router.get("/:activityId/edit", (req, res) => {
  const { activityId } = req.params;
  Activity.findById(activityId)
  .then (activityToEdit => {
    res.render("activities/edit", { activity: activityToEdit });
  })
});

router.post("/:activityId/edit", (req, res, next) => {
  const { activityId } = req.params;
  let user = req.session.user;

  const {title, description, startDate, meetingPoint} = req.body
  
  Activity.findByIdAndUpdate(activityId, {
    title,
    description,
    startDate,
    meetingPoint,
  })
    .then((activityFromDB) => {
      console.log(activityFromDB.id);
      res.redirect("/activities/list");
    })
    .catch((error) => {
      //Handle Edit Error
      next(error);
    });
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

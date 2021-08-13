const router = require("express").Router();
const mongoose = require("mongoose");
const isLoggedIn = require("../middleware/isLoggedIn");

// Require fileUploader in order to use it
const fileUploader = require("../config/cloudinary.config");

// Require the User model in order to interact with the database
const User = require("../models/User.model");
const Activity = require("../models/Activity.model");

// To list all the activities
router.get("/list", (req, res) => {
  Activity.find()
    .populate("author")
    .then((activitiesFromDB) => {
      res.render("activities/list", { activities: activitiesFromDB });
    });
});

// To show details of single activity
router.get("/:activityId/details", isLoggedIn, (req, res) => {
  let userInSession = req.session.user;
  console.log(userInSession);
  const { activityId } = req.params;
  Activity.findById(activityId)
    .populate("author attendants")
    .then((activityDetails) => {
      let date = new Date(activityDetails.startDate);
      let options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      activityDetails.formattedDate = date.toLocaleString("en-US", options);
      res.render("activities/details", { user: userInSession, activity: activityDetails });
    });
});

// To book activity
router.post("/:activityId/book", isLoggedIn, (req, res, next) => {
  let user = req.session.user;
  const { activityId } = req.params;

  return Activity.findById(activityId).then((activityFromDB) => {
    console.log("Attendants " + activityFromDB.attendants);
    if (!activityFromDB.attendants.includes(user._id)) {
      User.findById(user._id)
        .then((userFromDb) => {
          return Activity.findByIdAndUpdate(activityId, {
            $push: { attendants: userFromDb._id }
          });
        })
        .then(() => res.redirect(`/activities/${activityId}/details`))
        .catch((err) => {
          console.log("error booking activity: ", err);
          next(err);
        });

    }
    return;
  }
  );
});

// To create an activity
router.get("/create", isLoggedIn, (req, res) => {
  let userInSession = req.session.user;
  res.render("activities/create", { user: userInSession });
});

router.post(
  "/create", isLoggedIn, 
  fileUploader.single("activity-image"),
  (req, res, next) => {
    let user = req.session.user;

    if (user != undefined) {
      User.findById(user._id)
        .then((userFromDb) => {
          if (userFromDb) {

            let objectToCreate = {
              title: req.body.title,
              description: req.body.description,
              startDate: req.body.startDate,
              meetingPoint: req.body.meetingPoint,
              author: userFromDb._id,
              imageUrl: req.file?.path || '',
            };
            return Activity.create(objectToCreate)
          }
        })
        .then((activityFromDB) => {
          console.log(`New Activity created: ${activityFromDB.title}.`);
          res.redirect("/");
        })
        .catch((err) => {
          console.log("error booking activity: ", err);
          next(err);
        });
    }
  }
);

// To edit an activity
router.get("/:activityId/edit", isLoggedIn, (req, res) => {
  let userInSession = req.session.user;
  const { activityId } = req.params;
  Activity.findById(activityId).then((activityToEdit) => {
    res.render("activities/edit", { user: userInSession, activity: activityToEdit });
  });
});

router.post(
  "/:activityId/edit", isLoggedIn,
  fileUploader.single("activity-image"),
  (req, res, next) => {
    const { activityId } = req.params;
    let user = req.session.user;

    const { title, description, startDate, meetingPoint } = req.body;

    const objectToEdit = { title, description, startDate, meetingPoint };

    if (req.file) {
      objectToEdit.imageUrl = req.file.path;
    }

    Activity.findByIdAndUpdate(activityId, objectToEdit)
      .then((activityFromDB) => {
        console.log(activityFromDB.id);
        res.redirect("/activities/list");
      })
      .catch((error) => {
        //Handle Edit Error
        next(error);
      });
  }
);

// To delete an activity
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

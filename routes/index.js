const router = require("express").Router();
const isLoggedIn = require("../middleware/isLoggedIn");
const Activity = require("../models/Activity.model");

/* GET home page */
router.get("/", isLoggedIn, (req, res, next) => {
  Activity.find().populate('author') 
  .then((activitiesFromDB) => {
    console.log("list"+ (activitiesFromDB));
    res.render("activities/list", {activities: activitiesFromDB});
  });
});

module.exports = router;

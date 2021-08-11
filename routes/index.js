const router = require("express").Router();
const isLoggedIn = require("../middleware/isLoggedIn");
const Activity = require("../models/Activity.model");

/* GET home page */
router.get("/", (req, res) => {
  let userInSession = req.session.user;
  Activity.find()
    .populate("author")
    .then((activitiesFromDB) => {
      res.render("activities/list", {
        user: userInSession,
        activities: activitiesFromDB,
      });
    });
});

module.exports = router;

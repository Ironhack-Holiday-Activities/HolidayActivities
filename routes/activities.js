const router = require("express").Router();
const mongoose = require("mongoose");
const isLoggedIn = require("../middleware/isLoggedIn");

// Require the User model in order to interact with the database
const User = require("../models/User.model");
const Activity = require("../models/Activity.model");

router.get("/list", isLoggedIn, (req, res) => {
    let activitiesList = Activity.find();
    res.render("activities/list", {activities: activitiesList});
});
const Activity = require("../models/Activity.model");

module.exports = (req, res, next) => {
  // checks if the user is the author of the activity post
  Activity.find()
  .populate('author')
  .then (() => {
  if (req.session.user!==author) {
    res.send("Only the author can edit/delete the activity.");
  }
  req.user = req.session.user;
})
  next();
};

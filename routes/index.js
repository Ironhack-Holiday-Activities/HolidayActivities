const router = require("express").Router();
const isLoggedIn = require("../middleware/isLoggedIn");

router.get("/list", (req, res) => {
  res.render("activities/list");
});

module.exports = router;

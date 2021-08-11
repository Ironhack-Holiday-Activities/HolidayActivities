const router = require("express").Router();

// ℹ️ Handles password encryption
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default [10 - 12 rounds])
const saltRounds = 10;

// Require the models in order to interact with the database
const User = require("../models/User.model");
const Activity = require("../models/Activity.model");

// Require necessary middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

//////////// S I G N U P ///////////

router.get("/signup", isLoggedOut, (req, res) => {
  res.render("auth/login", {specificCss: "login.css"});
});

router.post("/signup", isLoggedOut, (req, res) => {
  const { username, email, password } = req.body;
  // Make sure uer fills all mandatory fields
  if (!username || !email || !password) {
    res.render("auth/login", { specificCss: "login.css", errorMessage: "All fields are mandatory." });
    return;
  }
  // Make sure passwords are strong
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
  if (!regex.test(password)) {
    res.status(500).render("auth/login", {specificCss: "login.css",
      errorMessage:
        "Password needs to have at least 8 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }

  // Search the database for a user with the username submitted in the form
  User.findOne({ username }).then((found) => {
    // If the user is found, send the message username is taken
    if (found) {
      res
        .status(400)
        .render("auth/login", {
          specificCss: "login.css",
          errorMessage: "Username already taken.",
        });
      return;
    }
  });
    // if user is not found, create a new user - start with hashing the password
    bcrypt
      .genSalt(saltRounds)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hashedPassword) => {
        // Create a user and save it in the database
        return User.create({
          username,
          email,
          passwordHash: hashedPassword,
        });
      })
      .then((user) => {
        // Bind the user to the session object
        req.session.user = user;
        res.redirect("/");
      })
      .catch((error) => {
        // Make sure error message becomes visible to user
        if (error instanceof mongoose.Error.ValidationError) {
          res
            .status(500)
            .render("auth/login", {
              specificCss: "login.css",
              errorMessage: error.message,
            });
        }
        // Make sure no duplicated data
        else if (error.code === 11000) {
          res
            .status(500)
            .render("auth/login", {
              specificCss: "login.css",
              errorMessage:
                "Username and email need to be unique. Either username or email is already used.",
            });
        } else {
          next(error);
        }
      });
  });


//////////// L O G I N ///////////

router.get("/login", isLoggedOut, (req, res) => {
  res.render("auth/login", {specificCss: "login.css"});
});

router.post("/login", isLoggedOut, (req, res, next) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("auth/login", {
      specificCss: "login.css",
      errorMessage: "Please enter both, username and password to login.",
    });
    return;
  }

  // Here we use the same logic as above
  // - either length based parameters or we check the strength of a password
  if (password.length < 8) {
    return res
      .status(400)
      .render("auth/login", {
        specificCss: "login.css",
        errorMessage: "Your password needs to be at least 8 characters long.",
      });
  }

  // Search the database for a user with the username submitted in the form
  User.findOne({ username })
    .then((user) => {
      // If the user isn't found, send the message that user provided wrong credentials
      if (!user) {
        return res
          .status(400)
          .render("auth/login", {
            specificCss: "login.css",
            errorMessage: "Username is not registered.",
          });
      }

      // If user is found based on the username, check if the in putted password matches the one saved in the database
      bcrypt.compare(password, user.passwordHash).then((isSamePassword) => {
        if (!isSamePassword) {
          return res
            .status(400)
            .render("auth/login", {
              specificCss: "login.css",
              errorMessage: "Incorrect password.",
            });
        }
        req.session.user = user;
        // req.session.user = user._id; // ! better and safer but in this case we saving the entire user object
        return res.redirect("/");
      });
    })

    .catch((err) => {
      // in this case we are sending the error handling to the error handling middleware that is defined in the error handling file
      // you can just as easily run the res.status that is commented out below
      next(err);
      // return res.status(500).render("login", { errorMessage: err.message });
    });
});

//////////// L O G O U T ///////////

router.get("/logout", isLoggedIn, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      next(err);
    } else {
      res.redirect("/login", { specificCss: "login.css" });
    }
  });
});

module.exports = router;

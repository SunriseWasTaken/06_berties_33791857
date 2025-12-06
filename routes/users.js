// Create a new router
const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const saltRounds = 10;

const { check, validationResult } = require("express-validator");

const redirectLogin = (req, res, next) => {
  if (!req.session.userId) {
    res.redirect("./login"); // redirect to the login page
  } else {
    next(); // move to the next middleware function
  }
};

router.get("/register", function (req, res, next) {
  res.render("register.ejs");
});

router.post(
  "/registered",
  [
    check("email").isEmail(), 
    check("username").isLength({ min: 5, max: 20 })
  ],
  function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("./register");
    }
    const plainPassword = req.body.password;
    bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
      if (err) {
        return next(err);
      }

      let sqlquery =
        "INSERT INTO users (username, first, last, email, hashedPassword) VALUES (?,?,?,?,?)";

      let newrecord = [
        req.body.username,
        req.body.first,
        req.body.last,
        req.body.email,
        hashedPassword,
      ];

      db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
          return next(err);
        } else {
          result =
            "Hello " +
            req.body.first +
            " " +
            req.body.last +
            " you are now registered!  We will send an email to you at " +
            req.body.email;
          result +=
            "Your password is: " +
            req.body.password +
            " and your hashed password is: " +
            hashedPassword;
          res.send(result);
        }
      });
    });
  }
);

router.get("/list", redirectLogin, function (req, res, next) {
  let sqlquery = "SELECT username, first, last, email FROM users";
  db.query(sqlquery, (err, result) => {
    if (err) {
      next(err);
    }
    res.render("listusers.ejs", { users: result });
  });
});

router.get("/login", function (req, res) {
  res.render("login.ejs");
});

router.post("/loggedin", function (req, res, next) {
  let username = req.body.username;
  let password = req.body.password;

  let sqlquery = "SELECT * FROM users WHERE username = ?";

  db.query(sqlquery, [username], (err, result) => {
    if (err) {
      return next(err);
    }

    if (result.length === 0) {
      return res.send("Login failed. Username not found.");
    }

    let hashedPassword = result[0].hashedPassword;

    bcrypt.compare(password, hashedPassword, function (err, same) {
      if (same === true) {
        // Save user session here, when login is successful
        req.session.userId = req.body.username;

        // log successful login
        let logQuery =
          "INSERT INTO audit (username, action, time) VALUES (?, 'success', NOW())";
        db.query(logQuery, [username], (err2, result2) => {
          if (err2) {
            console.error(err2);
          }
        });

        res.send("Login successful.");
      } else {
        // log failed login
        let logQuery =
          "INSERT INTO audit (username, action, time) VALUES (?, 'failed', NOW())";
        db.query(logQuery, [username], (err2, result2) => {
          if (err2) {
            console.error(err2);
          }
        });

        res.send("Login failed. Incorrect password.");
      }
    });
  });
});

router.get("/audit", redirectLogin, function (req, res, next) {
  let sqlquery = "SELECT * FROM audit ORDER BY time DESC";

  db.query(sqlquery, (err, result) => {
    if (err) {
      return next(err);
    }

    res.render("audit.ejs", { entries: result });
  });
});

router.get("/logout", redirectLogin, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("./");
    }
    res.send("you are now logged out. <a href=" + "./" + ">Home</a>");
  });
});

// Export the router object so index.js can access it
module.exports = router;

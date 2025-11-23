// Create a new router
const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const saltRounds = 10;

router.get("/register", function (req, res, next) {
  res.render("register.ejs");
});

router.post("/registered", function (req, res, next) {
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
});

router.get("/list", function (req, res, next) {
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

router.get("/audit", function (req, res, next) {
  let sqlquery = "SELECT * FROM audit ORDER BY time DESC";

  db.query(sqlquery, (err, result) => {
    if (err) {
      return next(err);
    }

    res.render("audit.ejs", { entries: result });
  });
});

// Export the router object so index.js can access it
module.exports = router;

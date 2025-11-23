// Create a new router
const express = require("express")
const router = express.Router()

const bcrypt = require('bcrypt')
const saltRounds = 10

router.get('/register', function (req, res, next) {
    res.render('register.ejs')
})

router.post('/registered', function (req, res, next) {
    const plainPassword = req.body.password
    bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
        if (err) { return next(err) }

        let sqlquery = "INSERT INTO users (username, first, last, email, hashedPassword) VALUES (?,?,?,?,?)"

        let newrecord = [req.body.username, req.body.first, req.body.last, req.body.email, hashedPassword]

        db.query(sqlquery, newrecord, (err, result) => {
            if (err) { return next(err) }
            else {
                result = 'Hello ' + req.body.first + ' ' + req.body.last + ' you are now registered!  We will send an email to you at ' + req.body.email
                result += 'Your password is: ' + req.body.password + ' and your hashed password is: ' + hashedPassword
                res.send(result)
            }
        })
    })
});

router.get('/list', function(req, res, next) {
    let sqlquery = "SELECT username, first, last, email FROM users"
    db.query(sqlquery, (err, result) => {
        if (err) { next(err) }
        res.render("listusers.ejs", {users: result})
    })
})

router.get('/login', function(req, res) {
    res.render("login.ejs")
})

// Export the router object so index.js can access it
module.exports = router

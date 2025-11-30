// Create a new router
const express = require("express")
const router = express.Router()

router.get('/search',function(req, res, next){
    res.render("search.ejs")
});

router.get('/search_result', function (req, res, next) {

    let keyword = req.query.search_text;

    // advanced search. partial match on title
    let sqlquery = "SELECT * FROM books WHERE name LIKE ?";
    let searchValue = ['%' + keyword + '%'];

    db.query(sqlquery, searchValue, (err, result) => {
        if (err) {
            return next(err);
        }
        res.render('searchresults.ejs', {
            books: result,
            keyword: keyword
        });
    });
});

router.get('/list', redirectLogin, function(req, res, next) {
    let sqlquery = "SELECT * FROM books";
    // query database to get all the books
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("list.ejs", {availableBooks:result})
     });
});

// show the add book form
router.get('/addbook', redirectLogin, function(req, res, next) {
    res.render('addbook.ejs');
});

// handle form submission and insert into database
router.post('/bookadded', function (req, res, next) {

    // saving data in database
    let sqlquery = "INSERT INTO books (name, price) VALUES (?, ?)";

    // execute sql query
    let newrecord = [req.body.name, req.body.price];

    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            next(err);
        } else {
            res.send(
                'This book is added to the database. name: ' +
                req.body.name +
                ' price ' +
                req.body.price
            );
        }
    });
});

// bargain books. price < £20
router.get('/bargainbooks', redirectLogin, function (req, res, next) {
    let sqlquery = "SELECT * FROM books WHERE price < 20";

    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err);
        } else {
            res.render('bargainbooks.ejs', { bargainBooks: result });
        }
    });
});

// Export the router object so index.js can access it
module.exports = router

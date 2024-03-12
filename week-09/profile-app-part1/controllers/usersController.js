const userModel = require("../models/userModel");
const express = require("express");
const router = express.Router();

// Route to the registration page (GET /users/register)
router.get("/register", (req, res) => {
    res.render("users/register");
});

// Route to the registration page (POST /users/register)
router.post("/register", (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    // TODO: Validate the information is correct.

    const newUser = new userModel({ firstName, lastName, email, password });

    // TODO: On the assignment, first check if the email already exists for a document.
    // WARNING: Do not throw/show any error if a duplicate email is attempted to be added.
    //          Rather, show a friendly error message in the registration form.

    newUser.save()
        .then(userSaved => {
            console.log(`User ${userSaved.firstName} has been added to the database.`);
            res.redirect("/");
        })
        .catch(err => {
            console.log(`Error adding user to the database ... ${err}`);
            res.render("users/register");
        });

});

module.exports = router;
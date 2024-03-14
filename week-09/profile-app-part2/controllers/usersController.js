const userModel = require("../models/userModel");
const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const path = require("path");

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

            // Create a unique name for the picture, so that it can be safely
            // stored in the static folder.
            const profilePicFile = req.files.profilePic;
            const uniqueName = `profile-pic-${userSaved._id}${path.parse(profilePicFile.name).ext}`;

            // Copy the image data to a file on the web server.
            profilePicFile.mv(`assets/profile-pics/${uniqueName}`)
                .then(() => {
                    // Saved the profile pic, update the document.
                    userModel.updateOne({
                        _id: userSaved._id
                    }, {
                        profilePic: uniqueName
                    })
                        .then(() => {
                            console.log("Updated the user profile pic.");
                            res.redirect("/");
                        })
                        .catch(err => {
                            console.log("Error updating the document.");
                            res.redirect("/");
                        });
                })
                .catch(err => {
                    console.log("Error receiving profile pic.");
                    res.redirect("/");
                });
        })
        .catch(err => {
            console.log(`Error adding user to the database ... ${err}`);
            res.render("users/register");
        });

});

// Route to the login page (GET /users/login)
router.get("/login", (req, res) => {
    res.render("users/login");
});

router.post("/login", (req, res) => {
    const { email, password } = req.body;

    // TODO: Validate that each was specified.

    let errors = [];

    userModel.findOne({
        email
    })
        .then(user => {
            // Completed the search successfully.

            if (user) {
                // Found the user document

                // Compare the password submitted with the document.
                bcryptjs.compare(password, user.password)
                    .then(matched => {
                        // Done comparing the passwords.

                        if (matched) {
                            // Password matches.

                            // Create a new session.
                            req.session.user = user;

                            console.log("Logged in successfully.");
                            res.redirect("/");
                        }
                        else {
                            // Password didn't match.
                            errors.push("Password doesn't match the database");
                            console.log(errors[0]);
                            res.render("users/login", { errors });
                        }
                    })
                    .catch(err => {
                        // Couldn't compare the password
                        errors.push("Couldn't compare the password. " + err);
                        console.log(errors[0]);
                        res.render("users/login", { errors });
                    });
            }
            else {
                // Couldn't find the user document.
                errors.push("Couldn't find the user");
                console.log(errors[0]);
                res.render("users/login", { errors });
            }
        })
        .catch(err => {
            // Couldn't query the database.
            errors.push("Couldn't get the document. " + err);
            res.render("users/login", { errors });
        });
});

// Route to the logout page (GET /users/logout)
router.get("/logout", (req, res) => {

    // Clear the session from memory.
    req.session.destroy();

    // Do NOT do this
    //req.session.user = null;

    res.redirect("/");
});

module.exports = router;
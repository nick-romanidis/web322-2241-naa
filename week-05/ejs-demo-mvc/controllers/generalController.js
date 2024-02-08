const employeeUtil = require("../modules/employee-util");
const express = require("express");

const router = express.Router();

// Setup a home page route
router.get("/", (req, res) => {
    res.render("general/home", {
        employees: employeeUtil.getAllEmployees(),
        title: "Home Page"
    });
});

// Setup a about page route
router.get("/about", (req, res) => {
    res.render("general/about", {
        title: "About Page"
    });
});

module.exports = router;
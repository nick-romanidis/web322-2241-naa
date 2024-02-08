const employeeUtil = require("../modules/employee-util");
const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
    res.render("employees/list", {
        employees: employeeUtil.getAllEmployees(),
        title: "Employees List"
    });
});

router.get("/visible", (req, res) => {
    res.render("employees/list", {
        employees: employeeUtil.getVisibleEmployees(employeeUtil.getAllEmployees()),
        title: "Visible Employees"
    });
});

module.exports = router;
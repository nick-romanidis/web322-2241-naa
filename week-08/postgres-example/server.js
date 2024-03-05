const path = require("path");
const express = require("express");
const expressLayouts = require('express-ejs-layouts');
const sequelizeModule = require("sequelize");

const app = express();

// Set up EJS
app.set('view engine', 'ejs');
app.set('layout', 'layouts/main');
app.use(expressLayouts);

// Set up body-parser.
app.use(express.urlencoded({ extended: true }));

// Define the connection to our Postgres instance.
const sequelize = new sequelizeModule("database", "username", "password", {
    host: "hostname",
    dialect: "postgres",
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    }
});

// Define a model for the "Names" table.
const nameModel = sequelize.define("Names", {
    fName: sequelizeModule.STRING,
    lName: sequelizeModule.STRING
});


app.get("/", (req, res) => {

    // Query all of the names from the database.
    nameModel.findAll({
        order: ["fName"]
    })
        .then(data => {
            // Pull the data (exclusively)
            // This is to ensure that our "data" object contains the returned data (only) and nothing else.
            const names = data.map(value => value.dataValues);

            res.render("nameTable", {
                names
            });
        })
        .catch(() => {
            res.redirect("/");
        });

});

app.post("/addName", (req, res) => {
    // Gather the new name from the form.
    const { fName, lName } = req.body;

    // TODO: Validate

    // Create a record using the "name" model.
    nameModel.create({
        fName, lName
    })
        .then(() => {
            console.log("Successfully created a new name record.");
            res.redirect("/");
        })
        .catch(() => {
            console.log("Failed to create a new name record.");
            res.redirect("/");
        });
});

app.post("/updateName", (req, res) => {
    // Gather the new name from the form.
    const { id, fName, lName } = req.body;

    // TODO: Validate

    if (fName.length === 0 && lName.length === 0) {
        // Delete the record from the database
        nameModel.destroy({
            where: { id }
        })
            .then(() => {
                console.log("Successfully deleted the name record.");
                res.redirect("/");
            })
            .catch(() => {
                console.log("Failed to delete the name record.");
                res.redirect("/");
            });
    }
    else {
        // Delete the record from the database
        nameModel.update(
            { lName, fName },
            { where: { id } }
        )
            .then(() => {
                console.log("Successfully updated the name record.");
                res.redirect("/");
            })
            .catch(() => {
                console.log("Failed to updated the name record.");
                res.redirect("/");
            });
    }
});

// This use() will not allow requests to go beyond it
// so we place it at the end of the file, after the other routes.
// This function will catch all other requests that don't match
// any other route handlers declared before it.
// This means we can use it as a sort of 'catch all' when no route match is found.
// We use this function to handle 404 requests to pages that are not found.
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

// This use() will add an error handler function to
// catch all errors.
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send("Something broke!")
});

// Define a port to listen to requests on.
const HTTP_PORT = process.env.PORT || 8080;

// Call this function after the http server starts listening for requests.
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

sequelize.sync()
    .then(() => {
        app.listen(HTTP_PORT, onHttpStart);
    });
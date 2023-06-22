require("dotenv").config();

var express = require("express");
var app = express();
var cors = require("cors");
var bodyParser = require("body-parser");
var server = require("http").createServer(app);
const methodOverride = require("method-override");

app.all("*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header(
        "Access-Control-Allow-Methods",
        "PUT, GET, POST, DELETE, OPTIONS"
    );
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

app.use(cors());
app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(async function (req, res, next) {
    next();
});

var route = require("./app/router");
require("./db/index.js")(app);
app.use("/api", route);

module.exports = { app, server };

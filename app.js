//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const data = require("/Users/patrickcarter/VisualStudioCodeProjects/HTML-CSS-JS/Complete 2022 Web Development Bootcamp/mongoPassword.json");

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);

mongoose.set("strictQuery", false);
const db = "secretsDB";
const mongoURL = `mongodb+srv://xcarter93:${data.password}@cluster0.jwhx2lt.mongodb.net/${db}?retryWrites=true&w=majority`;
mongoose.connect(mongoURL);

app.get("/", (req, res) => {
	res.render("home");
});

app.get("/login", (req, res) => {
	res.render("login");
});

app.get("/register", (req, res) => {
	res.render("register");
});

app.get("/secrets", (req, res) => {
	res.render("secrets");
});

app.get("/submit", (req, res) => {
	res.render("submit");
});

app.listen(3000, () => {
	console.log("Server is running");
});

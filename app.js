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

const userSchema = new mongoose.Schema({
	email: String,
	password: String,
});

const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
	res.render("home");
});

app.get("/login", (req, res) => {
	res.render("login");
});

app.get("/register", (req, res) => {
	res.render("register");
});

app.post("/register", (req, res) => {
	const user = new User({
		email: req.body.username,
		password: req.body.password,
	});

	user.save((err) => {
		if (err) {
			console.log(err);
		} else {
			res.render("secrets");
		}
	});
});

app.post("/login", (req, res) => {
	User.findOne(
		{ email: req.body.username, password: req.body.password },
		(err, foundUser) => {
			if (!err) {
				if (foundUser) {
					res.render("secrets");
				} else {
					console.log("User not found, please register.");
				}
			} else {
				console.log(err);
			}
		}
	);
});

app.listen(3000, () => {
	console.log("Server is running");
});

//jshint esversion:6

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

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
const mongoURL = `mongodb+srv://xcarter93:${process.env.DB_PASSWORD}@cluster0.jwhx2lt.mongodb.net/${db}?retryWrites=true&w=majority`;
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
		password: md5(req.body.password),
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
	User.findOne({ email: req.body.username }, (err, foundUser) => {
		if (!err) {
			if (foundUser) {
				if (md5(req.body.password) == foundUser.password) {
					res.render("secrets");
				}
			} else {
				console.log("User not found, please register.");
			}
		} else {
			console.log(err);
		}
	});
});

app.listen(3000, () => {
	console.log("Server is running");
});

//jshint esversion:6

require("dotenv").config();
const findOrCreate = require("mongoose-findorcreate");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

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
app.use(
	session({
		secret: "Our little secret.",
		resave: false,
		saveUninitialized: false,
	})
);
app.use(passport.initialize());
app.use(passport.session());
const mongoURL = `mongodb+srv://xcarter93:${process.env.DB_PASSWORD}@cluster0.jwhx2lt.mongodb.net/${db}?retryWrites=true&w=majority`;
mongoose.connect(mongoURL);

const userSchema = new mongoose.Schema({
	email: String,
	password: String,
	googleId: String,
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.findById(id, (err, user) => {
		done(err, user);
	});
});

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			callbackURL: "http://localhost:3000/auth/google/secrets",
		},
		function (accessToken, refreshToken, profile, cb) {
			User.findOrCreate({ googleId: profile.id }, function (err, user) {
				return cb(err, user);
			});
		}
	)
);

app.get("/", (req, res) => {
	res.render("home");
});

app.get(
	"/auth/google",
	passport.authenticate("google", { scope: ["profile"] })
);

app.get(
	"/auth/google/secrets",
	passport.authenticate("google", { failureRedirect: "/login" }),
	function (req, res) {
		// Successful authentication, redirect home.
		res.redirect("/secrets");
	}
);

app.get("/login", (req, res) => {
	res.render("login");
});

app.get("/register", (req, res) => {
	res.render("register");
});

app.get("/secrets", (req, res) => {
	if (req.isAuthenticated()) {
		res.render("secrets");
	} else {
		res.redirect("/login");
	}
});

app.get("/logout", (req, res) => {
	req.logout((err) => {
		if (!err) {
			res.redirect("/");
		}
	});
});

app.post("/register", (req, res) => {
	const email = req.body.username;
	const password = req.body.password;

	User.register({ username: email }, password, (err, user) => {
		if (err) {
			console.log(err);
			res.redirect("/register");
		} else {
			passport.authenticate("local")(req, res, () => {
				res.redirect("/secrets");
			});
		}
	});
});

app.post("/login", (req, res) => {
	const email = req.body.username;
	const password = req.body.password;

	const user = new User({
		username: email,
		password: password,
	});

	req.login(user, (err) => {
		if (err) {
			console.log(err);
		} else {
			passport.authenticate("local")(req, res, () => {
				res.redirect("/secrets");
			});
		}
	});
});

app.listen(3000, () => {
	console.log("Server is running");
});

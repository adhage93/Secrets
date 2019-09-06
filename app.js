//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = "Thisisourlittlesecret.";
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);

app.route("/")
    .get((req, res) => {
        res.render("home");
    });

app.route("/login")
    .get((req, res) => {
        res.render("login");
    })
    .post((req, res) => {

        const queryUser = {
            email: req.body.username,
        };

        User.findOne(queryUser, (err, foundUser) => {
            if (!err) {
                if (foundUser) {
                    console.log("User found successfully!");
                    if (foundUser.password === req.body.password) {
                        console.log("Logged in successfully");
                        res.render("secrets");
                    }
                    else {
                        console.log("Wrong password!!!");
                    }
                }
                else {
                    console.log("Wrong Username!!!");
                }
            }
            else {
                console.log("Error finding in user: " + err);
            }
        });
    });

app.route("/register")
    .get((req, res) => {
        res.render("register");
    })
    .post((req, res) => {
        const newUser = new User({
            email: req.body.username,
            password: req.body.password
        });

        newUser.save((err) => {
            if (!err) {
                console.log("User registerd successfully!");
                res.render("secrets");
            }
            else {
                console.log("Error registering user: " + err);
            }
        });

    });

app.listen(3000, () => {
    console.log('Server Started on port 3000...');
});
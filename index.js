const express = require('express');
const path = require("path"); // Make sure path is required
const bcrypt = require("bcrypt");
const collection = require("./config"); 

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set the view engine to EJS
app.set('view engine', 'ejs');

// THIS IS THE NEW LINE TO FIX THE ERROR
// It tells Express where to find your views folder
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.post("/signup", async (req, res) => {
    try {
        const existingUser = await collection.findOne({ name: req.body.firstname });
        if (existingUser) {
            return res.send("User already exists. Please choose a different username.");
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

        const data = {
            name: req.body.firstname,
            password: hashedPassword
        };

        await collection.insertMany(data);
        res.render("login");
    } catch (error) {
        console.log(error);
        res.send("An error occurred during signup.");
    }
});

app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.firstname });
        if (!check) {
            return res.send("Wrong username or password");
        }
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (!isPasswordMatch) {
            return res.send("Wrong username or password");
        }
        res.render("home");
    } catch (error) {
        console.log(error);
        res.send("An error occurred during login.");
    }
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

module.exports = app;

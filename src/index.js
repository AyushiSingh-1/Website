const express = require ('express');
const path = require("path");
const bcrypt =  require("bcrypt");
const collection = require("./config"); 

const app = express();

app.use(express.json());

app.use(express.urlencoded({extended : false}));
app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get("/", (req,res) =>
{  res.render("home");

});

app.get("/login", (req,res) =>
{  res.render("login");

});

app.get("/signup", (req,res) =>
{  res.render("signup");

});

app.post("/signup", async (req, res) => {
    const existingUser = await collection.findOne({ name: req.body.firstname });
    if (existingUser) {
        return res.send("User already exists. Please choose a different username.");
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const data = {
        name: req.body.firstname,
        password: hashedPassword // Save the HASHED password
    }

    await collection.insertMany(data);
    res.render("login");
});

app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.firstname });
        if (!check) {
            // Use res to send a response
            return res.send("wrong details"); 
        }
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (!isPasswordMatch) {
            // Use res here as well
            return res.send("wrong password");
        }
        // If login is successful, you should probably render a user dashboard or the homepage
        res.render("home"); // Or a different page for logged-in users

    } catch (error) { // It's good practice to catch the specific error
        console.log(error);
        res.send("An error occurred");
    }
});

const port = process.env.PORT || 3000;
app.listen(port,()=> {
    console.log('Server running on port:  ${port}');
})

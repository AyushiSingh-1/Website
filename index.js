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

// NEW: Add to Cart Route
app.get("/cart", (req, res) => {
    // This is a list of all available products on your site.
    // In a real app, this would come from your database.
    const allProducts = [
        { id: "101", name: "Stylish T-Shirt", price: 499.00, image: "/images/tshirt.jpg" },
        { id: "102", name: "Comfortable Jeans", price: 1299.00, image: "/images/jeans.jpg" },
        { id: "103", name: "Classic Sneakers", price: 2499.00, image: "/images/sneakers.jpg" },
        { id: "104", name: "Designer Watch", price: 4999.00, image: "/images/watch.jpg" }
    ];

    // Get the product ID from the URL (e.g., /cart?id=101)
    const productId = req.query.id;
    let itemToShow = null;

    if (productId) {
        // Find the product in our list that matches the ID from the URL
        itemToShow = allProducts.find(p => p.id === productId);
    }

    // Render the cart page.
    // If an item was found, pass it to the page. Otherwise, pass null.
    res.render("cart", { 
        cartItem: itemToShow
    });
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

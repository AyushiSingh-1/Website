const express = require('express');
const path = require("path");
const bcrypt = require("bcrypt");
const collection = require("./config"); 

const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set the view engine to EJS and define the views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (like CSS or images) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// --- Page Routes ---

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

// --- Functional Routes ---

// NEW: Add to Cart Route
app.get("/cart", (req, res) => {
    // UPDATED: This list now matches the products on your home.ejs page
    const allProducts = [
        { id: "101", name: "Oval Brilliant Ring", price: 1999.00, image: "https://media.tiffany.com/is/image/Tiffany/EcomBrowseM/tiffany-novo-oval-brilliant-engagement-ring-with-a-pav-diamond-platinum-band-70912392_1031925_ED.jpg?defaultImage=NoImageAvailableInternal&fmt=webp" },
        { id: "102", name: "Large Link Bracelet", price: 1599.00, image: "https://media.tiffany.com/is/image/Tiffany/EcomItemL2/tiffany-hardwearlarge-link-bracelet-70751046_1069059_ED_M.jpg?&op_usm=1.0,1.0,6.0&$cropN=0.1,0.1,0.8,0.8&defaultImage=NoImageAvailableInternal&&defaultImage=NoImageAvailableInternal&fmt=webp" },
        { id: "103", name: "Olive Leaf Earrings", price: 1499.00, image: "https://media.tiffany.com/is/image/Tiffany/EcomItemL2/paloma-picassoolive-leaf-climber-earrings-60702551_1026018_ED.jpg?&op_usm=2.0,1.0,6.0&$cropN=0.1,0.1,0.8,0.8&defaultImage=NoImageAvailableInternal&&defaultImage=NoImageAvailableInternal&fmt=webp" },
        { id: "104", name: "Link Necklace", price: 2999.00, image: "https://media.tiffany.com/is/image/Tiffany/EcomItemL2/tiffany-hardweargraduated-link-necklace-70606097_1062142_ED.jpg?&op_usm=1.0,1.0,6.0&$cropN=0.1,0.1,0.8,0.8&defaultImage=NoImageAvailableInternal&&defaultImage=NoImageAvailableInternal&fmt=webp" },
        { id: "105", name: "Sixteen Stone Ring", price: 3199.00, image: "https://media.tiffany.com/is/image/Tiffany/EcomItemL2/tiffany-co-schlumbergersixteen-stone-ring-11715966_1031820_ED.jpg?&op_usm=1.75,1.0,6.0&$cropN=0.1,0.1,0.8,0.8&defaultImage=NoImageAvailableInternal&&defaultImage=NoImageAvailableInternal&fmt=webp" },
        { id: "106", name: "Double Hinged Bangle", price: 1999.00, image: "https://media.tiffany.com/is/image/Tiffany/EcomItemL2/tiffany-knotdouble-row-hinged-bangle-68890268_1030923_ED_M.jpg?&op_usm=2.0,1.0,6.0&$cropN=0.1,0.1,0.8,0.8&defaultImage=NoImageAvailableInternal&&defaultImage=NoImageAvailableInternal&fmt=webp" },
        { id: "107", name: "Triple Drop Link Earrings", price: 1699.00, image: "https://media.tiffany.com/is/image/Tiffany/EcomItemL2/tiffany-hardweartriple-drop-link-earrings-70607115_1034747_ED.jpg?&op_usm=2.0,1.0,6.0&$cropN=0.1,0.1,0.8,0.8&defaultImage=NoImageAvailableInternal&&defaultImage=NoImageAvailableInternal&fmt=webp" },
        { id: "108", name: "Pendant", price: 2599.00, image: "https://media.tiffany.com/is/image/Tiffany/EcomItemL2/tiffany-lockpendant-72355776_1060160_ED.jpg?&op_usm=1.0,1.0,6.0&$cropN=0.1,0.1,0.8,0.8&defaultImage=NoImageAvailableInternal&&defaultImage=NoImageAvailableInternal&fmt=webp" }
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

// Signup User Route
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

// Login User Route
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

// Start the server (for local development)
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

// Export the app for Vercel
module.exports = app;

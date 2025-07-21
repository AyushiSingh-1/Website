# Scintilla - A Dynamic E-Commerce Website

Welcome to Scintilla, a full-stack e-commerce web application built with Node.js, Express, and MongoDB. This project features a complete user authentication system and is deployed live on Vercel.

**[View Live](https://website-git-main-ayushisingh-1s-projects.vercel.app/)**



## 🌟 Key Features

* **User Authentication**: Secure user registration and login functionality.
* **Password Hashing**: Passwords are never stored as plain text. We use `bcrypt` to hash and salt passwords before saving them to the database, ensuring a high level of security.
* **Database Integration**: User data is stored and managed in a MongoDB database using Mongoose for elegant data modeling.
* **Dynamic Templating**: The front-end is rendered dynamically using EJS (Embedded JavaScript templates), allowing for efficient and reusable UI components.
* **Serverless Deployment**: Seamlessly deployed on Vercel, demonstrating modern cloud deployment practices for Node.js applications.



## 🛠️ Technologies Used

* **Backend**: Node.js, Express.js
* **Database**: MongoDB, Mongoose
* **View Engine**: EJS (Embedded JavaScript)
* **Authentication**: bcrypt
* **Development Tool**: Nodemon
* **Deployment**: Vercel



## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* **Node.js**: Make sure you have Node.js installed. You can download it [here](https://nodejs.org/).
* **MongoDB**: You'll need a MongoDB database. You can use a local installation or a free cloud instance from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/AyushiSingh-1/Website.git](https://github.com/AyushiSingh-1/Website.git)
    cd Website
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Set up your Environment Variable:**
    * Create a file named `.env` in the root of your project.
    * Add your MongoDB connection string to this file:
        ```
        MONGODB_URI="mongodb+srv://your-user:your-password@your-cluster.mongodb.net/your-database-name"
        ```
    * **Important:** You must update your `config.js` file to use this `.env` file for local development. You can use a package like `dotenv`.
        * Install it: `npm install dotenv`
        * Add this to the top of your `config.js`: `require('dotenv').config();`

4.  **Run the application:**
    This command starts the server with Nodemon, which will automatically restart when you save changes.
    ```sh
    npm run dev
    ```
    Your application should now be running on **[http://localhost:3000](http://localhost:3000)**.

---

## ☁️ Deployment

This project is configured for easy deployment on [Vercel](https://vercel.com). The `vercel.json` file handles the serverless function configuration. For a successful deployment:

1.  Push your code to a GitHub repository.
2.  Import the repository on Vercel.
3.  Add your `MONGODB_URI` as an Environment Variable in the Vercel project settings.

Vercel will automatically build and deploy the application on every push to the `main` branch.

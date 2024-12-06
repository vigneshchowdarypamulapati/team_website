const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(express.json()); // To parse incoming JSON requests

// Server and MongoDB configuration
const PORT = process.env.PORT || 8000; // Server port
const MONGO_URL = "mongodb+srv://Vignesh:Vignesh27@cluster0.cw71i.mongodb.net/myDatabase?retryWrites=true&w=majority"; // MongoDB connection string with retryWrites for safety
const FRONTEND_URL = "https://team-website-frontend.onrender.com"; // Frontend URL for CORS configuration

// CORS Configuration
app.use(
  cors({
    origin: FRONTEND_URL, // Allow only the deployed frontend to access this backend
    methods: ["GET", "POST"], // Specify allowed methods
    credentials: true, // Allow cookies/credentials if needed
  })
);

// MongoDB Connection
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB database");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit process if the database connection fails
  });

// Load Mongoose Models
require("./Userdetails"); // Ensure the `Userdetails` file defines the `user` model
const User = mongoose.model("user");

// Routes

// Signup Route
app.post("/signup", async (req, res) => {
  const { fname, lname, dob, email, pass } = req.body;

  try {
    console.log("Signup request received:", req.body);

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Create a new user
    const newUser = new User({ fname, lname, dob, email, pass });
    await newUser.save();

    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    console.error("Error in signup route:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Signin Route
app.post("/signin", async (req, res) => {
  const { email, pass } = req.body;

  try {
    console.log("Signin request received:", req.body);

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate password
    if (user.pass !== pass) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error in signin route:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Default Route
app.get("/", (req, res) => {
  res.status(200).send("Welcome to the backend API");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8000; // Port for the server
const MONGO_URL = "mongodb+srv://Vignesh:Vignesh27@cluster0.cw71i.mongodb.net/"; // MongoDB connection string
const FRONTEND_URL = "https://team-website-frontend.onrender.com"; // Frontend URL for CORS configuration

// CORS Configuration
app.use(
  cors({
    origin: FRONTEND_URL, // Allow only your deployed frontend to access this backend
    methods: ["GET", "POST"], // Specify allowed methods
    credentials: true, // Allow cookies/credentials if needed
  })
);

// MongoDB Connection
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true, // Recommended for MongoDB connection
  })
  .then(() => {
    console.log("Connected to MongoDB database");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

// Load Mongoose Models
require("./Userdetails"); // Ensure you have the Userdetails model file in the same directory
const User = mongoose.model("user");

// Routes

// Signup Route
app.post("/signup", async (req, res) => {
  const { fname, lname, dob, email, pass } = req.body;
  try {
    console.log("Signup request received:", req.body);

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json("User already exists"); // HTTP 409 Conflict
    }

    // Create a new user
    await User.create({ fname, lname, dob, email, pass });
    res.status(201).json("Registration successful"); // HTTP 201 Created
  } catch (error) {
    console.error("Error in signup route:", error.message);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
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
      return res.status(404).json("User not found"); // HTTP 404 Not Found
    }

    // Validate password
    if (user.pass !== pass) {
      return res.status(401).json("Invalid password"); // HTTP 401 Unauthorized
    }

    res.status(200).json("Login successful"); // HTTP 200 OK
  } catch (error) {
    console.error("Error in signin route:", error.message);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
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

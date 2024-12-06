const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables from .env file

app.use(express.json());

const PORT = process.env.PORT || 8000; // Port from environment variables or fallback to 8000
const MONGO_URL = "mongodb+srv://Vignesh:Vignesh27@cluster0.cw71i.mongodb.net/"; // MongoDB URL from environment variables
const FRONTEND_URL = "https://team-website-frontend.onrender.com"; // Frontend URL for CORS configuration

// CORS Configuration
app.use(
  cors({
    origin: FRONTEND_URL, // Restrict access to the frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    credentials: true, // Allow cookies and credentials if needed
  })
);

// MongoDB Connection
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true, // Recommended option for MongoDB connection
  })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log("Database connection error:", e));

// Load Mongoose Models
require("./Userdetails");
const User = mongoose.model("user");

// Routes
app.post("/signup", async (req, res) => {
  const { fname, lname, dob, email, pass } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json("User already exists");
    }

    await User.create({ fname, lname, dob, email, pass });
    res.json("Registration successful");
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

app.post("/signin", async (req, res) => {
  const { email, pass } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.json("User not found");
    }

    if (user.pass !== pass) {
      return res.json("Invalid password");
    }

    res.json("Login successful");
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
let usersCollection;

async function connectDB() {
  try {
    await client.connect();
    const db = client.db("MedData");
    usersCollection = db.collection("passwords");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}
connectDB();

app.post("/signup", async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  const existingUser = await usersCollection.findOne({ name });

  if (existingUser) {
    return res.status(400).json({ message: "Username already exists." });
  }

  await usersCollection.insertOne({ name, password });
  res.status(201).json({ message: "Account created successfully!" });
});

app.post("/login", async (req, res) => {
  const { name, password } = req.body;
  const user = await usersCollection.findOne({ name });

  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid username or password." });
  }

  console.log("Login successful!");
  res.status(200).json({ redirectUrl: "http://127.0.0.1:5500/Server/Medroutine/Medroutine.html" });
});

app.get("/medicine", async (req, res) => {
  const medicineName = req.query.name;

  if (!medicineName) {
    return res.status(400).json({ message: "Medicine name is required" });
  }

  try {
    const db = client.db("MedData");
    const medicinesCollection = db.collection("medicine");

    // Ensure case-insensitive search
    const medicine = await medicinesCollection.findOne(
      { "Medicine Name": { $regex: `^${medicineName}$`, $options: "i" } },
      { projection: { _id: 0, "Medicine Name": 1, Uses: 1, "When to Take": 1, "Food Considerations": 1 } }
    );

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    res.status(200).json(medicine);
  } catch (error) {
    console.error("Error fetching medicine data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

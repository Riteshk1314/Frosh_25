const mongoose = require("mongoose");

// Replace with exact existing database name in your cluster URI
const DB_URL = "mongodb+srv://rkapoorbe23:La1YcgqAGSHLK7XL@blumi.r2bw9.mongodb.net/Frosh_25?retryWrites=true&w=majority&appName=Blumi";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String },
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
  password: { type: String, required: true },
  dateCreated: { type: Date, default: Date.now },
  role: { type: String, enum: ["user", "admin", "superadmin"], default: "user" }
});

const User = mongoose.model("User", UserSchema);

async function addUser() {
  try {
    await mongoose.connect(DB_URL);
    console.log("Connected to existing database Frosh_25");
    const newUser = new User({
      name: "Raj Kapoor",
      image: "https://example.com/profile.jpg",
      email: "raj@example.com",
      phoneNumber: "+911234567890",
      accessToken: "someAccessToken",
      refreshToken: "someRefreshToken",
      password: "123j45678" // Ensure you have a password field in your schema
    });

    await newUser.save();
    console.log("User added successfully:", newUser);

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error adding user:", error);
  }
}

addUser();

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  // basic identity
  name: {
    type: String,
    required: true,
  },
  applicationId: {
      type:Number,
    },
  password: {
    type: String,
    required: true,
    validate: {
      validator(val) {
        return val.length >= 6; // Password must be at least 6 characters long
      },
      message: "Password must be at least 6 characters long",
    },
    },
  image: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: false,
  },


  //backend
  accessToken: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    enum: ["user", "admin", "superadmin"],
    default: "user",
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;

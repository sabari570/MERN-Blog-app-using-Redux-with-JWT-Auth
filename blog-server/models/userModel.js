const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { isEmail } = require("validator");

// Defining the user schema
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minLength: [6, "Password length must be atleast 6 characters"],
  },
  avatar: {
    type: String,
  },
  posts: {
    type: Number,
    default: 0,
  },
});

// Fire a function before saving the doc to the database
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Fire a function after saving the doc to the database
userSchema.post("save", (doc, next) => {
  console.log("User saved to database: ", doc);
  next();
});

// static method for logging users in
userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("incorrect email");

  const auth = await bcrypt.compare(password, user.password);
  if (!auth) throw new Error("incorrect password");

  return user;
};

const User = mongoose.model("user", userSchema);

module.exports = User;

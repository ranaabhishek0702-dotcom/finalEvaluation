const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;


const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !password || !email)
      return res.status(400).json({ message: "Username, email and password required" });

    // basic email format check
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(String(email).toLowerCase()))
      return res.status(400).json({ message: "Invalid email" });

    // check by username or email
    const userExists = await User.findOne({ $or: [{username}, { email: email.toLowerCase() }] });

    if (userExists) {
      return res.status(400).json({ message: "Username or email already taken" });
    }

    const newUser = await User.create({ username, email: email.toLowerCase(), password, emailVerified: false });

    return res.json({
      message: "Signup successful",
        token: generateToken(newUser),
        username: newUser.username,
        user: { username: newUser.username, id: newUser._id, email: newUser.email, emailVerified: newUser.emailVerified }
    });

  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});


router.post("/signin", async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier can be username or email

    if (!identifier || !password)
      return res.status(400).json({ message: "Identifier and password required" });

    console.log(`Signin attempt for identifier=${identifier}`);
    const query = (identifier.includes("@"))
      ? { email: identifier.toLowerCase() }
      : { username: identifier };

    const user = await User.findOne(query);
    if (!user) console.log(`Signin: no user found for ${identifier}`);
    else console.log(`Signin: found user ${user.username}`);

    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await user.matchPassword(password);
    console.log(`Signin: password match = ${isMatch}`);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    return res.json({
      message: "Signin successful",
      token: generateToken(user),
      username: user.username,
      user: { username: user.username, id: user._id, email: user.email, emailVerified: user.emailVerified }
    });

  } catch (err) {
    console.error("Signin error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;


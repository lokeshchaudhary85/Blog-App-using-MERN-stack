const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");   //  JWT import
const SECRET_KEY = "your_jwt_secret";  //  secret key

const getAllUser = async (req, res, next) => {
  let users;

  try {
    users = await User.find();
  } catch (err) {
    console.log(err);
  }
  if (!users) {
    return res.status(404).json({ message: "users are not found" });
  }

  return res.status(200).json({ users });
};

const signUp = async (req, res, next) => {
  const { name, email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    console.log(err);
  }

  if (existingUser) {
    return res.status(400).json({ message: "User already exists!" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = new User({
    name,
    email,
    password: hashedPassword,
    blogs: [],
  });

  try {
    await user.save();

    // Signup ke sath hi token generate
    const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: "1h" });

    return res.status(201).json({ user, token });
  } catch (e) {
    console.log(e);
  }
};

const logIn = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    console.log(err);
  }

  if (!existingUser) {
    return res.status(404).json({ message: "User not found" });
  }

  const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({ message: "Incorrect Password!" });
  }

  // Login ke baad bhi token generate
  const token = jwt.sign({ id: existingUser._id }, SECRET_KEY, {
    expiresIn: "1h",
  });

  return res.status(200).json({ user: existingUser, token });
};

module.exports = { getAllUser, signUp, logIn };

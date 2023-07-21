// controllers/authController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function register(req, res) {
  const { name, lastname, phone, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ phone }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'This phone number or email is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, lastname, phone, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'internal service error' });
  }
}

async function login(req, res) {
  const { loginIdentifier, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ phone: loginIdentifier }, { email: loginIdentifier }],
    });

    if (!user) {
      return res.status(401).json({ message: 'email , phone or password incorrect' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'email , phone or password incorrect' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    const responseData = {
      name: user.name,
      lastname: user.lastname,
      phone: user.phone,
      email: user.email,
      token,
      createdDate: user.createdAt,
    };

    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'internal service error' });
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'internal service error' });
  }
}

module.exports = {
  register,
  login,
  getAllUsers,
};
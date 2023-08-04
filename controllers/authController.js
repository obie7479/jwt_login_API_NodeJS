
// controllers/authController.js

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const uppercaseRegex = /[A-Z]/;
const lowercaseRegex = /[a-z]/;
const specialRegex = /[!@#$%^&*(),.?":{}|<>]/;

async function register(req, res) {
  const { name, lastname, phone, email, password, confpassword } = req.body;

  try {
    const existingUser = await User.findOne({
      $or: [
        {
          phone,
        },
        {
          email,
        },
      ],
    });
    if (existingUser) {
      return res.status(400).json({
        message: "This phone number or email is already registered.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be 8 characters or more.",
      });
    } else if (!uppercaseRegex.test(password) || !lowercaseRegex.test(password) || !specialRegex.test(password)) {
      return res.status(400).json({
        message: "Password must have uppercase letters, lowercase letters, and special characters.",
      });
    } else if (password !== confpassword) {
      return res.status(400).json({
        message: "Passwords do not match.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      lastname,
      phone,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({
      message: "User created successfully",
      status: 201,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal service error",
    });
  }
}



async function login(req, res) {
  const { loginIdentifier, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [
        {
          phone: loginIdentifier,
        },
        {
          email: loginIdentifier,
        },
      ],
    });

    if (!user) {
      return res.status(401).json({
        message: "Email, phone, or password incorrect",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Email, phone, or password incorrect",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET
    );

    const responseData = {
      id: user._id,
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
    res.status(500).json({
      message: "Internal service error",
    });
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal service error",
    });
  }
}

async function deleteUser(req, res) {
  const userId = req.params.id; // Assuming you pass the user ID as a parameter in the request URL

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // You can add additional checks here to ensure only authorized users can delete an account,
    // for example, check if the user is an admin or if the logged-in user is the same as the user being deleted.

    await User.deleteOne({
      _id: userId,
    }); // Use deleteOne() to remove the user

    res.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal service error",
    });
  }
}

async function updateUser(req, res) {
  const userId = req.params.id; // Assuming you pass the user ID as a parameter in the request URL
  const { name, lastname, phone, email, password } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // You can add additional checks here to ensure only authorized users can update their own information,
    // for example, check if the logged-in user is the same as the user being updated.

    // Update user properties if they are provided in the request body
    if (name) user.name = name;
    if (lastname) user.lastname = lastname;
    if (phone) user.phone = phone;
    if (email) user.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    const responseData = {
      id: user._id,
      name: user.name,
      lastname: user.lastname,
      phone: user.phone,
      email: user.email,
      createdDate: user.createdAt,
    };

    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal service error",
    });
  }
}

module.exports = {
  register,
  login,
  getAllUsers,
  deleteUser,
  updateUser,
};

// // const express = require('express');
// // const mongoose = require('mongoose');
// // const bcrypt = require('bcryptjs');
// // const jwt = require('jsonwebtoken');
// // require('dotenv').config();

// // const app = express();
// // const port = process.env.API_PORT || 3000;

// // const UserSchema = new mongoose.Schema({
// //   name: {
// //     type: String,
// //     required: true
// //   },
// //   lastname: {
// //     type: String,
// //     required: true
// //   },
// //   phone: {
// //     type: String,
// //     required: true,
// //     unique: true
// //   },
// //   email: {
// //     type: String,
// //     required: true,
// //     unique: true
// //   },
// //   password: {
// //     type: String,
// //     required: true
// //   },
// //   createdAt: {
// //     type: Date,
// //     default: Date.now
// //   }
// // });

// // const User = mongoose.model('User', UserSchema);

// // app.use(express.json());

// // app.post('/register', async (req, res) => {
// //   const { name, lastname, phone, email, password } = req.body;

// //   try {
// //     const existingUser = await User.findOne({ $or: [{ phone }, { email }] });
// //     if (existingUser) {
// //       return res.status(400).json({ message: 'หมายเลขโทรศัพท์หรืออีเมลนี้ถูกลงทะเบียนแล้ว' });
// //     }

// //     const hashedPassword = await bcrypt.hash(password, 10);

// //     const newUser = new User({ name, lastname, phone, email, password: hashedPassword });
// //     await newUser.save();

// //     res.status(201).json({ message: 'สร้างผู้ใช้งานเรียบร้อยแล้ว' });
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: 'ข้อผิดพลาดบริการภายใน' });
// //   }
// // });

// // app.post('/login', async (req, res) => {
// //   const { phone, password } = req.body;

// //   try {
// //     const user = await User.findOne({ phone });
// //     if (!user) {
// //       return res.status(401).json({ message: 'หมายเลขโทรศัพท์หรือรหัสผ่านไม่ถูกต้อง' });
// //     }

// //     const isPasswordValid = await bcrypt.compare(password, user.password);
// //     if (!isPasswordValid) {
// //       return res.status(401).json({ message: 'หมายเลขโทรศัพท์หรือรหัสผ่านไม่ถูกต้อง' });
// //     }

// //     const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

// //     const responseData = {
// //       name: user.name,
// //       lastname: user.lastname,
// //       phone: user.phone,
// //       email: user.email,
// //       token,
// //       createdDate: user.createdAt
// //     };

// //     res.json(responseData);
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: 'ข้อผิดพลาดบริการภายใน' });
// //   }
// // });

// // mongoose
// //   .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
// //   .then(() => {
// //     console.log('เชื่อมต่อกับ MongoDB แล้ว');
// //     app.listen(port, () => {
// //       console.log(`เซิร์ฟเวอร์ทำงานบนพอร์ต ${port}`);
// //     });
// //   })
// //   .catch((error) => console.error(error));


// // index.js

// const express = require('express');
// const mongoose = require('mongoose');
// require('dotenv').config();

// const app = express();
// const port = process.env.API_PORT || 3000;

// app.use(express.json());

// // Import routes
// const authRoutes = require('./routes/authRoutes');

// // Register routes
// app.use(authRoutes);

// mongoose
//   .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     console.log('Connected to MongoDB');
//     app.listen(port, () => {
//       console.log(`Server running on port ${port}`);
//     });
//   })
//   .catch((error) => console.error(error));

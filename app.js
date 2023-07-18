// app.js

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.API_PORT || 3000;

app.use(express.json());

// เรียกเส้นทาง
const authRoutes = require('./routes/authRoutes');

// ลงทะเบียนเส้นทาง
app.use(authRoutes);
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true ,})
  .then(() => {
    console.log('connect server successfully');
    app.listen(port, () => {
      console.log(`connect server on port ${port}`);
    });
  })
  .catch((error) => console.error(error));

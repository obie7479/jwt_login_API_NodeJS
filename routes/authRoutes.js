const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/', authController.getAllUsers);
router.delete("/deleteuser/:id", authController.deleteUser);
router.put("/updateuser/:id", authController.updateUser);
module.exports = router;

const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Middleware สำหรับตรวจสอบ JWT Token
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId; // กำหนดค่าผู้ใช้ที่ได้จาก token
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Route สำหรับดึงข้อมูลผู้ใช้
router.get('/me', auth, async (req, res) => {
  try {
    console.log("User ID from token:", req.user); // ตรวจสอบ User ID ที่ได้จาก token
    const user = await User.findById(req.user).select('-password');
    console.log("User found:", user); // ตรวจสอบว่าพบข้อมูลผู้ใช้หรือไม่
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

  
  

module.exports = router;

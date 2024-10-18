const express = require('express');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const router = express.Router();
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    console.log('Received token:', token); // log token
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded); // ดูว่า token ถูกถอดรหัสอย่างไร
      req.user = decoded.userId || decoded.user; // กำหนดค่าผู้ใช้ที่ได้จาก token
      next();
    } catch (err) {
        console.error('Token verification failed:', err.message);
      res.status(401).json({ msg: 'Token is not valid' });
    }
  };
  // ตั้งค่า multer สำหรับการอัปโหลดภาพ
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/original'); // กำหนดโฟลเดอร์สำหรับเก็บรูปภาพ
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname); // ตั้งชื่อไฟล์ให้ไม่ซ้ำ
    }
  });
  const upload = multer({ storage });

  router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        const posts = await Post.find({ user: req.user }); // ค้นหาโพสต์ทั้งหมดที่เป็นของผู้ใช้
        res.status(200).json(posts); // ส่งโพสต์กลับไปยัง frontend
      } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Server error' });
      }
});

module.exports = router;
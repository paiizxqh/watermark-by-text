const express = require('express');
const Post = require('../models/Post'); // สร้างโมเดลโพสต์สำหรับบันทึกลงในฐานข้อมูล
const multer = require('multer'); // ใช้สำหรับจัดการการอัปโหลดไฟล์
const jwt = require('jsonwebtoken'); // นำเข้า jwt
const fs = require('fs');
const path = require('path');

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
    cb(null, 'uploads/watermarked'); // กำหนดโฟลเดอร์สำหรับเก็บรูปภาพ
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // ตั้งชื่อไฟล์ให้ไม่ซ้ำ
  }
});

const upload = multer({ storage });
// เรียก watermark.py ใส่ลายน้ำและเข้ารหัสข้อความลับ

// เส้นทางสำหรับโพสต์ข้อมูลใหม่ (รวมทั้งอัปโหลดรูปภาพ)
router.post('/', auth, upload.single('image'), async (req, res) => {
    console.log('File:', req.file); // Log รายละเอียดของไฟล์ที่อัปโหลด
    console.log('User:', req.user); // Log รายละเอียดผู้ใช้
  try {
    const newPost = new Post({
      user: req.user, // ดึง id ผู้ใช้จาก token
      image: req.file.path, // เก็บ path ของไฟล์ที่อัปโหลด
      description: req.body.description, // เก็บคำอธิบายโพสต์
      createdAt: new Date(), // เพิ่มฟิลด์ createdAt
    });

    await newPost.save(); // บันทึกลงฐานข้อมูล
    res.status(201).json(newPost); // ส่งโพสต์ที่ถูกสร้างกลับไปยัง frontend
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// เส้นทางสำหรับดึงโพสต์ทั้งหมด
router.get('/', auth, async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user }); // ค้นหาโพสต์ทั้งหมดที่เป็นของผู้ใช้
      res.status(200).json(posts); // ส่งโพสต์กลับไปยัง frontend
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // เส้นทางสำหรับดึงโพสต์ทั้งหมด (ไม่ต้องใช้ token)
router.get('/all', async (req, res) => {
    try {
      const posts = await Post.find().populate('user', 'username'); // ดึงโพสต์ทั้งหมดพร้อมข้อมูลผู้ใช้ (เช่นชื่อผู้ใช้)
      res.status(200).json(posts); // ส่งโพสต์ทั้งหมดกลับไปยัง frontend
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

// เส้นทางสำหรับลบโพสต์ตาม ID
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
  
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        //console.log('Post:', post); // ตรวจสอบค่าโพสต์ที่ได้
        //console.log('User from token:', req.user); // ตรวจสอบผู้ใช้จาก token

        // ตรวจสอบว่าผู้ใช้เป็นเจ้าของโพสต์หรือไม่
        if (post.user.toString() !== req.user.toString()) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // ลบภาพจากโฟลเดอร์ uploads/original
        const imagePath = path.join(__dirname, '..', post.image);
        console.log('Trying to delete image at:', imagePath);
        fs.unlink(imagePath, (err) => {
        if (err) {
            console.error('Error deleting image:', err);
        }
        });

        await Post.deleteOne({ _id: req.params.id }); // ใช้ deleteOne แทน remove
        res.status(200).json({ msg: 'Post removed' }); // ส่งข้อความยืนยันการลบ
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
  

module.exports = router;

import React, { useEffect, useState } from "react";
import "../css/Post.css"; // Ensure you have custom styles here if needed
import axios from "axios";

function Post() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [description, setDescription] = useState("");
  const [imageFile, setImage] = useState(null);
  const [user, setUser] = useState(null);

  // Fetch posts from backend
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/posts/all');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('http://localhost:5000/api/user/me', {
            headers: {
              'x-auth-token': token
            }
          });
          const userData = await response.json();
          setUser(userData);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchAllPosts();
    fetchUserData(); // Fetch user data on mount
  }, []);

  // Handle click on a post to show modal
  const handlePostClick = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedPost(null);
    setImagePreview(null);
    setDescription("");
    setImage(null); // Reset image state
  };

  // Handle image upload for new post
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit new post
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
  
    if (!token) {
      console.error('No token found, user not authenticated');
      return;
    }

    console.log('Token:', token); // Log token สำหรับตรวจสอบ
  
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('description', description);
    formData.append("username", user.username);
  
    console.log('FormData for watermark:', formData); // Log ข้อมูลที่กำลังจะส่งไปยัง API Python

    try {
      const Data = new FormData();
      Data.append('image', imageFile);
      Data.append('description', description);
  
      console.log('FormData for original image:', Data); // Log ข้อมูลที่กำลังจะส่งไป backend

      // ขั้นที่สอง: ส่งภาพพร้อมลายน้ำไปที่ /api/posts
      const dataResponse = await fetch('http://localhost:5000/api/watermark', {
        method: 'POST',
        headers: {
          'x-auth-token': token,
        },
        body: Data, // ส่ง FormData พร้อมลายน้ำ
      });

      console.log('Data response status:', dataResponse.status); // Log สถานะ response
      
      // ขั้นแรก: ส่งรูปไปที่ API ของ Python เพื่อใส่ลายน้ำ
      const watermarkResponse = await fetch('http://localhost:4000/watermark', {
        method: 'POST',
        body: formData, // ส่งไฟล์รูปพร้อมข้อมูลไปที่ /watermark
      });
  
      if (!watermarkResponse.ok) {
        const errorData = await watermarkResponse.json();
        console.error('Failed to add watermark:', errorData);
        return;
      }
  
      // รับข้อมูลจาก API (อาจเป็นไฟล์ภาพที่ใส่ลายน้ำแล้ว)
      const watermarkedImageBlob = await watermarkResponse.blob();
      console.log('Watermarked image blob:', watermarkedImageBlob); // Log ไฟล์ภาพที่ใส่ลายน้ำแล้ว
  
      // สร้าง FormData ใหม่เพื่อส่งภาพพร้อมลายน้ำไปที่ /api/posts
      const newFormData = new FormData();
      newFormData.append('image', watermarkedImageBlob, 'watermarked_image.png'); // เพิ่มชื่อไฟล์ตามต้องการ
      newFormData.append('description', description); // ส่งข้อมูลอื่นๆ เช่น description
  
      console.log('FormData with watermarked image:', newFormData);

      // ขั้นที่สอง: ส่งภาพพร้อมลายน้ำไปที่ /api/posts
      const postResponse = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {
          'x-auth-token': token,
        },
        body: newFormData, // ส่ง FormData พร้อมลายน้ำ
      });

      console.log('Post response status:', postResponse.status); // Log สถานะ response
  
      if (postResponse.ok) {
        const postData = await postResponse.json();
        console.log('Post created successfully:', postData); // Log ข้อมูลโพสต์ที่ถูกสร้าง
        setPosts((prevPosts) => [...prevPosts, postData]); // อัปเดตโพสต์ในหน้า
        closeModal(); // ปิด modal ถ้ามี
      } else {
        const errorData = await postResponse.json();
        console.error('Failed to create post:', errorData);
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  // Handle image download
const handleDownload = (imagePath) => {
  const link = document.createElement("a");
  link.href = `http://localhost:5000/${imagePath}`; // Make sure this points to the correct watermarked image
  link.download = "watermarked_image.jpg"; // You can customize the name as needed
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">All Posts</h1>
      <button
        className="btn btn-primary mb-3"
        onClick={() => setShowModal(true)}
      >
        Create New Post
      </button>

      {/* <div className="row">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              className="col-md-4 mb-3"
              key={post._id}
              onClick={() => handlePostClick(post)}
            >
              <div className="card">
                <img
                  src={`http://localhost:5000/${post.image}`} 
                  alt="Post"
                  className="card-img-top"
                />
                <div className="card-body">
                  <h5 className="card-title">{post.description}</h5>
                  <p className="card-text">Posted by: {post.user.username}</p>
                  <p className="text-muted">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </div> */}

      {/* Modal for viewing selected post */}
{showModal && selectedPost && (
  <div className="modal show" style={{ display: "block" }}>
    <div className="modal-dialog">
      <div className="modal-content">
        <span className="close" onClick={closeModal}>&times;</span>
        <div className="modal-header">
          <h5 className="modal-title">{selectedPost.description}</h5>
        </div>
        <div className="modal-body">
          <p>Posted by: {selectedPost.user.username}</p>
          <p className="text-muted">
            {new Date(selectedPost.createdAt).toLocaleString()}
          </p>
          <img
            src={`http://localhost:5000/${selectedPost.image}`} // Use watermarked image for display
            alt="Post"
            className="img-fluid"
          />
        </div>
        <div className="modal-footer">
          <button
            className="btn btn-success"
            onClick={() => handleDownload(selectedPost.image)} // Use original image for download
          >
            Download Image
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      {/* Modal for creating new post */}
      {showModal && !selectedPost && (
        <div className="modal show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <span className="close" onClick={closeModal}>&times;</span>
              <div className="modal-header">
                <h5 className="modal-title">Create a new Post</h5>
              </div>
              <div className="modal-body">
                <input
                  type="file"
                  accept="image/*"
                  className="form-control mb-2"
                  onChange={handleImageUpload}
                />

                {imagePreview && (
                  <div className="mb-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="img-fluid"
                    />
                  </div>
                )}

                <textarea
                  className="form-control mb-2"
                  placeholder="Write a caption..."
                  rows="4"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>

                <button className="btn btn-primary" onClick={handleSubmit}>
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Post;

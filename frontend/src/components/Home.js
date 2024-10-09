import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Post from "./Post"; // Make sure to import the Post component
import "../css/Home.css";
import Header from "./Header";
import Section from "./Section";

function Home() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [user, setUser] = useState(null); // State for user

  useEffect(() => {
    // Fetch all posts and user data on component mount
    const fetchAllPosts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/posts/all");
        if (!response.ok) throw new Error("Failed to fetch posts");
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch("http://localhost:5000/api/user/me", {
            headers: {
              "x-auth-token": token,
            },
          });
          if (!response.ok) throw new Error("Failed to fetch user data");
          const userData = await response.json();
          setUser(userData);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchAllPosts();
    fetchUserData();
  }, []);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    resetModalState();
  };

  const resetModalState = () => {
    setImagePreview(null);
    setDescription("");
    setImageFile(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found, user not authenticated");
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("description", description);

    try {
      const response = await fetch("http://localhost:5000/api/posts", {
        method: "POST",
        headers: {
          "x-auth-token": token,
        },
        body: formData,
      });

      if (response.ok) {
        const postData = await response.json();
        setPosts((prevPosts) => [...prevPosts, postData]);
        closeModal();
      } else {
        const errorData = await response.json();
        console.error("Failed to create post:", errorData);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    openModal();
  };

  const handleDownload = async (imageUrl) => {
    try {
      const response = await fetch(`http://localhost:5000/${imageUrl}`);
      if (!response.ok) throw new Error("Network response was not ok");
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = imageUrl.split("/").pop();
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="container">
    <Header onLogout={handleLogout} />
      <Section />
      <h1 className="text-center my-4">Posts</h1>
      <div className="row">
        {posts.map((post) => (
          <Post
            key={post._id}
            post={post}
            onClick={() => handlePostClick(post)}
          />
        ))}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            {imagePreview && <img src={imagePreview} alt="Preview" />}
            <form onSubmit={handleSubmit}>
              <input type="file" onChange={handleImageUpload} required />
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Post description"
                required
              />
              <button type="submit">Upload Post</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;

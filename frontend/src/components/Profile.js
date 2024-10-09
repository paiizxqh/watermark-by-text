import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Profile.css";
import Header from "./Header";
import Section from "./Section";

function Profile() {
  const [showModal, setShowModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [userData, setUserData] = useState({ username: "", email: "" });
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(""); 
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/user/me", {
          headers: { "x-auth-token": token },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Error fetching user data");
      } finally {
        setLoading(false);
      }
    };

    const fetchUserPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/posts", {
          headers: { "x-auth-token": token },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user posts");
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching user posts:", error);
        setError("Error fetching user posts");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserData();
      fetchUserPosts();
    }
  }, []);

  const openModal = () => {
    setShowModal(true);
    setImagePreview(null);
    setDescription("");
    setImageFile(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setImagePreview(null);
    setDescription("");
    setError(""); 
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
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
        headers: { "x-auth-token": token },
        body: formData,
      });

      if (response.ok) {
        const postData = await response.json();
        setPosts((prevPosts) => [...prevPosts, postData]);
        closeModal();
      } else {
        const errorData = await response.json();
        console.error("Failed to create post:", errorData);
        setError("Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      setError("Error creating post");
    }
  };

  const handleDownload = async (imageUrl) => {
    try {
      const response = await fetch(`http://localhost:5000/${imageUrl}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = imageUrl.split("/").pop();
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Download error:", error);
      setError("Download error");
    }
  };

  const handleDeletePost = async (postId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found, user not authenticated");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/posts/${postId}`, {
        method: "DELETE",
        headers: { "x-auth-token": token },
      });

      if (response.ok) {
        setPosts(posts.filter((post) => post._id !== postId));
      } else {
        const errorData = await response.json();
        console.error("Failed to delete post:", errorData);
        setError("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      setError("Error deleting post");
    }
  };

  return (
    <div className="container profile-container">
      <Header />
      <Section />
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="profile-header">
            <div className="profile-info">
              <h3 className="username">{userData.username}</h3>
              <span className="email">{userData.email}</span>
            </div>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
          <div className="post-input-container">
            <textarea
              className="post-input"
              placeholder="What's on your mind?"
              onChange={(e) => setDescription(e.target.value)}
            />
            <button className="upload-button" onClick={openModal}>
              Upload Post
            </button>
          </div>
          <div className="post-gallery">
            {posts.map((post) => (
              <div className="post-card" key={post._id}>
                <img src={`http://localhost:5000/${post.imageUrl}`} alt="Post" className="post-image" />
                <div className="post-content">
                  <h5 className="post-description">{post.description}</h5>
                  <div className="post-actions">
                    <button onClick={() => handleDownload(post.imageUrl)}>Download</button>
                    <button onClick={() => handleDeletePost(post._id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {showModal && (
            <div className="modal">
              <div className="modal-content">
                <span className="close" onClick={closeModal}>&times;</span>
                <form onSubmit={handleSubmit}>
                  <input type="file" accept="image/*" onChange={handleImageUpload} required />
                  {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add a description"
                    required
                  />
                  <button type="submit">Post</button>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Profile;

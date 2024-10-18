import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../css/Profile.css';

function Profile() {
  const [showModal, setShowModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [userData, setUserData] = useState({ username: "", email: "" });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/user/me', {
          headers: {
            'x-auth-token': token
          }
        });
        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        setError(error.message);
      }
    };

    const fetchUserPosts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/posts', {
          headers: {
            'x-auth-token': token
          }
        });
        if (!response.ok) throw new Error('Failed to fetch user posts');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        setError(error.message);
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
  };

  const closeModal = () => {
    setShowModal(false);
    setImagePreview(null);
    setSelectedPost(null);
    setDescription("");
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
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No token found, user not authenticated');
      return;
    }

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('description', description);

    try {
      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {
          'x-auth-token': token
        },
        body: formData
      });

      if (response.ok) {
        const postData = await response.json();
        setPosts((prevPosts) => [...prevPosts, postData]);
        closeModal();
      } else {
        const errorData = await response.json();
        console.error('Failed to create post:', errorData);
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handlePostClick = (post) => {
    setSelectedPost(post);
    openModal();
  };

  const handleDownload = async (imageUrl) => {
    try {
      const response = await fetch(`http://localhost:5000/${imageUrl}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = imageUrl.split('/').pop();
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const handleDeletePost = async (postId) => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('No token found, user not authenticated');
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this post?");

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token,
        },
      });

      if (response.ok) {
        setPosts(posts.filter((post) => post._id !== postId));
      } else {
        const errorData = await response.json();
        console.error('Failed to delete post:', errorData);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div className="app">
      <div className="content">
        <div className="profile-header">
          <div className="profile-info">
            <div className="profile-details">
              <h1 className="username">{userData.username}</h1>
              <p>Email: {userData.email}</p>
            </div>
          </div>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <div className="post-section">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div className="post" key={post._id} onClick={() => handlePostClick(post)}>
                  <img
                    src={`http://localhost:5000/${post.image}`}
                    alt="Post"
                    className="post-image"
                  />
                  <div className="post-details">
                    <h5 className="card-title">{post.description}</h5>
                    <p className="text-muted">Posted by: {userData.username}</p>
                    <p className="text-muted">
                      {new Date(post.createdAt).toLocaleString()}
                    </p>
                    <button
                      className="btn btn-danger"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent the post click event
                        handleDeletePost(post._id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No posts available.</p>
            )}
          </div>
        )}
      </div>

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
                <p>Posted by: {userData.username}</p>
                <p className="text-muted">
                  {new Date(selectedPost.createdAt).toLocaleString()}
                </p>
                <img
                  src={`http://localhost:5000/${selectedPost.image}`}
                  alt="Post"
                  className="img-fluid"
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-success"
                  onClick={() => handleDownload(selectedPost.image)}
                >
                  Download Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;

import React, { useEffect, useState } from 'react';
import '../css/Home.css';

function Home() {
  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [user, setUser] = useState(null); // New state for user

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

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setImagePreview(null);
    setSelectedPost(null);
    setDescription("");
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

  return (
    <div className="home-content">
      <h1 className="home-title">All Posts</h1>
      <div className="home-post-grid">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div className="home-post-card" key={post._id}>
              <img
                src={`http://localhost:5000/${post.image}`}
                alt="Post"
                className="home-post-image"
              />
              <div className="home-post-info">
                <h3 className="home-post-description">{post.description}</h3>
                <p className="home-post-user">Posted by: {post.user.username}</p>
                <p className="home-post-timestamp">{new Date(post.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="home-no-posts">No posts available.</p>
        )}
      </div>
    </div>
  );
}

export default Home;

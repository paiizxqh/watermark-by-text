import React from 'react';
import PropTypes from 'prop-types';
import '../css/Post.css'; // Make sure to add necessary CSS styles here

const Post = ({ post, onClick }) => {
  return (
    <div className="col-lg-4 col-md-6 mb-4">
      <div className="card h-100 shadow-sm post-card" onClick={onClick} style={{ cursor: 'pointer' }}>
        <img className="card-img-top" src={post.image} alt={post.description} />
        <div className="card-body">
          <h5 className="card-title">{post.description}</h5>
          <p className="card-category">
            Created at: <strong>{new Date(post.createdAt).toLocaleString()}</strong>
          </p>
        </div>
        <div className="card-footer d-flex justify-content-between align-items-center">
          <div className="user">
            User ID: <strong>{post.user.$oid}</strong>
          </div>
          <button className="btn btn-outline-primary">+</button>
        </div>
      </div>
    </div>
  );
};

// Define prop types for Post component
Post.propTypes = {
  post: PropTypes.shape({
    image: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    user: PropTypes.shape({
      $oid: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Post;

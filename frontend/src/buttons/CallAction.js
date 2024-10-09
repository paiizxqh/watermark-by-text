import React from "react";
import "../css/Action.css";
import { useNavigate } from "react-router-dom";

const CallAction = () => {
  const navigate = useNavigate();

  const handleUploadClick = () => {
    navigate("/upload");
  };

  return (
    <div className="d-flex justify-content-center my-4">
      <button className="btn btn-outline-dark btn-hover mx-2">
        Learn More
      </button>
      <button className="btn btn-dark btn-hover mx-2" onClick={handleUploadClick}>Upload File</button>
    </div>
  );
};

export default CallAction;

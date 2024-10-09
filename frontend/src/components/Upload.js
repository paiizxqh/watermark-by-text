import React, { useState, useRef } from "react";
import {
  Container,
  Card,
  Button,
  Form,
  ProgressBar,
  Row,
  Col,
  Spinner,
  Toast,
} from "react-bootstrap";
import {
  Upload as UploadIcon,
  X,
  FileText,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Header from "./Header";
import "../css/Upload.css"; 

const Upload = () => {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const fileInputRef = useRef(null);
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/svg+xml",
    "application/zip",
  ];

  const validateFile = (file) => {
    const maxSize = 10 * 1024 * 1024; // 10 MB
    return allowedTypes.includes(file.type) && file.size <= maxSize;
  };

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    handleFiles(newFiles);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const newFiles = Array.from(event.dataTransfer.files);
    handleFiles(newFiles);
  };

  const handleFiles = (newFiles) => {
    const validFiles = newFiles.filter(validateFile);
    const duplicateFiles = validFiles.filter((file) =>
      files.some((existingFile) => existingFile.name === file.name)
    );

    if (duplicateFiles.length > 0) {
      alert("Some files are duplicates. Please choose different files.");
    }

    if (files.length + validFiles.length > 5) {
      alert("You can only upload up to 5 files.");
      return;
    }

    const updatedFiles = [...files, ...validFiles].slice(0, 5);
    setFiles(updatedFiles);
    validFiles.forEach((file) => simulateFileUpload(updatedFiles.indexOf(file)));
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setUploadProgress((prevProgress) => {
      const newProgress = { ...prevProgress };
      delete newProgress[index];
      return newProgress;
    });
  };

  const simulateFileUpload = (index) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress((prevProgress) => ({
        ...prevProgress,
        [index]: progress,
      }));
      if (progress >= 100) {
        clearInterval(interval);
        setShowToast(true); // Show success toast
        if (index === files.length - 1) {
          setCurrentStep(3); // เปลี่ยนไปที่ Step 3 (Validate)
        }
      }
    }, 500);
  };

  const handleUpload = () => {
    setIsLoading(true);
    files.forEach((file, index) => {
      simulateFileUpload(index);
    });
    setIsLoading(false);
    setCurrentStep(2); // Move to the Preview step
  };

  const handleClearFiles = () => {
    setFiles([]);
    setUploadProgress({});
    if (fileInputRef.current) {
      fileInputRef.current.value = null; // เคลียร์ค่าใน input
    }
  };

  const steps = [
    {
      number: 1,
      title: "Upload",
      subtitle: "Find a file",
      icon: <UploadIcon />,
    },
    {
      number: 2,
      title: "Preview",
      subtitle: "Preview upload",
      icon: <FileText />,
    },
    {
      number: 3,
      title: "Validate",
      subtitle: "Fix errors",
      icon: <AlertCircle />,
    },
    {
      number: 4,
      title: "Receive Confirmation",
      subtitle: "All done",
      icon: <CheckCircle />,
    },
  ];

  return (
    <Container className="mt-5">
      <Header />
      <div className="upload-container">
        <h1 className="upload-header">Upload File</h1>
        <div className="d-flex align-items-center mb-3">
          <span className="bg-success text-white p-1 rounded-circle me-2">
            <i className="bi bi-info-circle"></i>
          </span>
          <p className="mb-0">
            Use this page to upload a file to create rosters.{" "}
            <Button variant="link" className="p-0">
              more info
            </Button>
          </p>
        </div>

        <Row className="mb-4">
          {steps.map((step) => (
            <Col key={step.number} className="text-center">
              <div
                className={`rounded-circle d-inline-flex justify-content-center align-items-center ${
                  currentStep > step.number
                    ? "bg-success"
                    : currentStep === step.number
                    ? "bg-primary"
                    : "bg-secondary"
                }`}
                style={{ width: "40px", height: "40px" }}
              >
                {React.cloneElement(step.icon, { color: "white", size: 20 })}
              </div>
              <p className="mb-0 mt-2">{step.title}</p>
              <small
                className={
                  currentStep >= step.number ? "text-primary" : "text-muted"
                }
              >
                {step.subtitle}
              </small>
            </Col>
          ))}
        </Row>

        <Card className="upload-card">
          <Card.Body>
            <h5>
              Step {currentStep}: {steps[currentStep - 1].title}
            </h5>
            <p>{steps[currentStep - 1].subtitle}</p>
            <div
              className="border border-dashed p-5 text-center mb-3"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <UploadIcon size={48} className="mb-3 text-primary" />
              <p>
                Drag your file(s) or{" "}
                <Button
                  variant="link"
                  onClick={() => fileInputRef.current.click()}
                >
                  browse
                </Button>
              </p>
              <small className="text-muted">Max 10 MB files are allowed</small>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="d-none"
                multiple
              />
            </div>
            <small className="text-muted">
              Only support .jpg, .png, .svg, and .zip files
            </small>

            {files.map((file, index) => (
              <div key={index} className="mt-3 d-flex align-items-center upload-progress">
                <div className="flex-grow-1">
                  <p className="mb-0">{file.name}</p>
                  <ProgressBar
                    now={uploadProgress[index] || 0}
                    label={`${uploadProgress[index] || 0}%`}
                    variant={uploadProgress[index] === 100 ? "success" : "info"}
                    striped={uploadProgress[index] < 100}
                    animated={uploadProgress[index] < 100}
                  />
                </div>
                <Button
                  variant="link"
                  className="text-danger"
                  onClick={() => handleRemoveFile(index)}
                >
                  <X size={20} />
                </Button>
              </div>
            ))}

            <div className="d-flex justify-content-between">
              <Button
                variant="secondary"
                onClick={handleClearFiles}
                className="upload-button"
              >
                Clear Files
              </Button>
              <Button
                variant="primary"
                onClick={handleUpload}
                disabled={isLoading || files.length === 0}
                className="upload-button"
              >
                {isLoading ? (
                  <>
                    <Spinner animation="border" size="sm" />
                    <span className="ms-2">Uploading...</span>
                  </>
                ) : (
                  "Upload Files"
                )}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>

      <Toast
        className="upload-toast"
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
      >
        <Toast.Body>Files uploaded successfully!</Toast.Body>
      </Toast>
    </Container>
  );
};

export default Upload;

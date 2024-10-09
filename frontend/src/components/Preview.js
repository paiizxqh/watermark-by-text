import React from "react";
import { Container, Card, Button, Row, Col } from "react-bootstrap";
import { X } from "lucide-react";

const Preview = ({ files, onRemoveFile, onUploadComplete }) => {
  return (
    <Container className="mt-5">
      <h1 className="mb-3">Preview Uploaded Files</h1>
      <Row>
        {files.map((file, index) => (
          <Col key={index} md={4} className="mb-3">
            <Card>
              <Card.Body>
                <h5>{file.name}</h5>
                <Button
                  variant="link"
                  className="text-danger"
                  onClick={() => onRemoveFile(index)}
                >
                  <X size={20} /> Remove
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Button variant="success" onClick={onUploadComplete}>
        Confirm Upload
      </Button>
    </Container>
  );
};

export default Preview;
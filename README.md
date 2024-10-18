# Watermark By Text : Platform for Creating and Sharing Image Collections

## Overview

This project is a web application that combines image watermarking and steganography techniques. It allows users to upload images, add watermarks, hide encrypted messages within the images, and share these posts with other users. The application is designed with a frontend-backend architecture, utilizing modern web technologies and secure encryption methods.

## Technologies Used

### Frontend
- React: For building the user interface
- Axios: For making HTTP requests to the backend
- Bootstrap: For responsive design and layout

### Backend
- Python: Python: Core language for backend development
- Flask: Web framework for handling HTTP requests and services
- OpenCV (cv2): For image processing tasks
- Pillow (PIL): For image handling and manipulation
- Stegano: For LSB steganography
- PyCryptodome: For AES encryption
- Node.js: Runtime environment for the server
- Express.js: Web application framework for Node.js
- MongoDB: NoSQL database for storing user and post information
- Mongoose: ODM (Object Data Modeling) library for MongoDB and Node.js

### Security
- JWT: For user authentication
- AES Encryption: For securing hidden messages
- LSB (Least Significant Bit) Steganography: For hiding encrypted messages in images

## Key Features

1. User Authentication
2. Image Upload and Post Creation
3. Watermark Application
4. Message Encryption and Hiding (Steganography)
5. Post Viewing and Image Download

## Project Structure

```bash
/watermark-by-text
│
├── /backend
│   ├── /models
│   │   ├── Post.js             # MongoDB schema for posts
│   │   └── User.js             # MongoDB schema for users
│   ├── /routes
│   │   ├── auth.js             # Handles user authentication routes (login, register)
│   │   ├── post.js             # Handles post-related routes (create, fetch posts)
│   │   └── user.js             # Handles user-related routes (user profile, data)
│   ├── /uploads
│   │   ├── /original           # Stores original uploaded images
│   │   └── /watermarked        # Stores watermarked and processed images
│   ├── watermark.py            # Python script for image watermarking and steganography
│   ├── .env                    # Environment variables for backend
│   ├── package-lock.json
│   ├── package.json            # Node.js dependencies for backend
│   └── requirements.txt        # Python dependencies for backend
│
├── /frontend
│   ├── /public                 # Public assets (HTML template, favicons)
│   ├── /src
│   │   ├── /css                # Custom CSS for styling
│   │   ├── /components         # Reusable React components (Navbar, Sidebar, etc.)
│   │   ├── /pages              # Page components for different routes
│   │   │   ├── Register.js     # Registration page
│   │   │   ├── Login.js        # Login page
│   │   │   ├── Home.js         # Home page showing posts
│   │   │   ├── Profile.js      # Profile page (user info and posts)
│   │   │   └── Post.js         # Post creation/view page
│   │   ├── App.js              # Main React app component
│   │   ├── index.js            # React entry point
│   │   └── styles.css          # Custom styles for the application
│   └── package.json            # Node.js dependencies for frontend
└── README.md                  # Project documentation
```

## Frontend Implementation (React)

### Post Component

The `Post` component is the main interface for users to interact with posts. It includes the following features:

1. **Fetching and Displaying Posts**: 
   - Retrieves all posts from the backend on component mount.
   - Displays posts in a grid layout with image, description, and user information.

2. **User Authentication**:
   - Fetches user data on component mount if a token is present in local storage.

3. **Create New Post**:
   - Allows users to upload an image and add a description.
   - Sends the image to the backend for watermarking and steganography.
   - Creates a new post with the processed image.

4. **View Post Details**:
   - Users can click on a post to view it in a modal with full details.

5. **Download Watermarked Image**:
   - Provides a button to download the watermarked image from a post.

### API Interactions

The component interacts with several backend endpoints:

- `GET /api/posts/all`: Fetches all posts
- `GET /api/user/me`: Retrieves current user data
- `POST /watermark`: Sends image for watermarking and steganography (to Python backend)
- `POST /api/posts`: Creates a new post with the watermarked image

## Backend Implementation (Node.js/Express)

The backend server is built using Express.js and provides the following features:

### Server Setup
- Uses Express.js as the web application framework
- Implements CORS for cross-origin resource sharing
- Parses JSON requests
- Serves static files from the 'uploads' directory

### API Routes
- `/api/auth`: Handles authentication-related requests
- `/api/user`: Manages user-related operations
- `/api/posts`: Handles post-related operations (creation, retrieval, etc.)
- `/api/watermark`: Manages watermarking operations (possibly forwarding requests to the Python backend)

### Database Connection
- Uses MongoDB as the database
- Connects to the database using Mongoose ODM
- Connection string is stored in environment variables for security

### Environment Variables
- Uses dotenv for managing environment variables
- Includes configurations for MongoDB URI and server port

## API Endpoints

### Authentication Routes (`/api/auth`)
(Specific endpoints to be detailed based on implementation)

### User Routes (`/api/user`)
(Specific endpoints to be detailed based on implementation)

### Post Routes (`/api/posts`)
- `GET /api/posts/all`: Fetches all posts
- `POST /api/posts`: Creates a new post with a watermarked image

### Watermark Routes (`/api/watermark`)
- `POST /api/watermark`: Handles image watermarking (may forward to Python backend)

## Backend API Endpoints (Python)

### POST /watermark
Handles image upload, watermarking, and steganography.

#### Request
- Method: POST
- Content-Type: multipart/form-data
- Body:
  - image: File (Image to be processed)
  - username: String (Text to be used as watermark and hidden message)

#### Response
- Content-Type: image/png
- Body: Processed image file (watermarked and with hidden encrypted message)

## Setup and Running

### Backend (Node.js/Express)
1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file in the root directory and add:
   ```
   MONGO_URI=mongodb+srv://thanakritphk:f9vsq527gwbcTbSl@watermark.bzmu5.mongodb.net/WaterMark?retryWrites=true&w=majority&appName=WaterMark
   JWT_SECRET=your_jwt_secret_key
   ```

3. Run the server:
   ```
   node server.js
   ```

### Backend (Python)
1. Install required Python packages:
   ```
   pip install flask opencv-python-headless pillow flask-cors pycryptodome stegano
   ```

2. Run the Flask application:
   ```
   python watermark.py
   ```

The server will start on `http://localhost:5000` for the main backend and `http://localhost:4000` for the Python backend.

### Frontend
1. Install dependencies:
   ```
   npm install
   ```

2. Run the React application:
   ```
   npm start
   ```

The frontend will start on `http://localhost:3000`.

## Security Considerations

- JWT is used for user authentication.
- Passwords should be hashed before storing in the database (implementation not shown in the provided code).
- MongoDB connection string is stored in environment variables.
- AES encryption is used for hiding messages, ensuring confidentiality.
- HTTPS should be implemented for secure data transmission in production.

## Future Enhancements

- Implement password hashing for user authentication.
- Add input validation and sanitization on the server-side.
- Implement rate limiting to prevent abuse of the API.
- Add logging for better debugging and monitoring.
- Implement user roles and permissions.
- Add social features like comments and likes.

---

For more information or support, please contact us.
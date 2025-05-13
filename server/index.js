const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// CORS setup
app.use(cors());

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Message data storage (Temporary)
let messages = [];

// API routes
app.get('/api/messages', (req, res) => {
  res.json(messages); // Send all messages
});

app.post('/api/messages', (req, res) => {
  const { sender, content, image } = req.body;
  const message = { sender, content, image };
  messages.push(message);
  io.emit('receiveMessage', message); // Emit message to all clients in real-time
  res.status(201).json(message);
});

// File upload route
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (req.file) {
    res.json({ imageUrl: `/uploads/${req.file.filename}` });
  } else {
    res.status(400).json({ error: 'No file uploaded' });
  }
});

// Static folder for images
app.use('/uploads', express.static('uploads'));

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server
server.listen(5001, () => {
  console.log('Server is running on port 5001');
});

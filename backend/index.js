const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const path = require('path');

const port = process.env.PORT || 5000; // Define the port number
const app = express();
const server = http.createServer(app);

// Initialize WebSocket server with Socket.io
const io = new Server(server, {
  cors: {
    origin: 'https://chat-app-nida.onrender.com', // Adjust with your frontend URL
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Serve static files from React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Serve the React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

const SECRET_KEY = "supersecretkey";

// Middleware
app.use(
  cors({
    origin: "https://chat-app-nida.onrender.com",
    credentials: true
  })
);
app.use(bodyParser.json());
app.use(cookieParser());

// Fake Database
let users = [];
let messages = [];

// Register API
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  res.json({ message: "User registered successfully!" });
});

// Login API
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
  res.cookie("token", token, { httpOnly: true });
  res.json({ message: "Login successful!", token });
});

// Get Messages API
app.get("/api/messages", (req, res) => {
  res.json(messages);
});

// Send Message API
app.post("/api/messages", (req, res) => {
  const { message, sender } = req.body;
  const newMessage = { sender, text: message };
  messages.push(newMessage);
  io.emit("receiveMessage", newMessage); // Broadcast to all clients
  res.json({ message: "Message sent!" });
});

// WebSocket Connection
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
 socket.on('sendMessage', (message) => {
    io.emit('receiveMessage', message); // Broadcast to all clients
  });
  socket.on('error', (error) => {
    console.error('WebSocket error:', error);
  });

});

// Start Server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

import { io } from 'socket.io-client';

// Retrieve token from localStorage
const token = localStorage.getItem('token');

const socket = io('http://localhost:5000', {
  auth: {
    token: token,
  },
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export default socket;

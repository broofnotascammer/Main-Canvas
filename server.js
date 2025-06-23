// whiteboard-backend/server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        // IMPORTANT: In production, change '*' to the specific URL(s) of your frontend(s)
        // For now, '*' allows any origin during development and initial testing.
        // Example for your future GitHub Pages site: "https://yourusername.github.io"
        origin: "*", 
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 10000;

// Listen for new client connections
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Listen for 'drawingData' events from clients (when a user draws a segment)
    socket.on('drawingData', (data) => {
        // Broadcast the drawing data to all *other* connected clients
        // 'broadcast.emit' ensures the sender doesn't receive their own drawing data back,
        // as they've already drawn it locally.
        socket.broadcast.emit('drawingData', data);
    });

    // Listen for 'clearCanvas' events from clients
    socket.on('clearCanvas', () => {
        // Broadcast the 'clearCanvas' event to all *other* connected clients
        socket.broadcast.emit('clearCanvas');
        console.log(`Canvas clear request received from ${socket.id}. Broadcasting.`);
    });

    // Listen for client disconnections
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

// Start the server
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Whiteboard backend server running on http://0.0.0.0:${PORT}`);
});

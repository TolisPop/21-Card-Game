
server.on('upgrade', (req, socket) => {
// Make sure that we only handle WebSocket upgrade requests
if (req.headers['upgrade'] !== 'websocket') {
  socket.end('HTTP/1.1 400 Bad Request');
  return;
}
// More to come…
});
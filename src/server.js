import http from 'http';
import app from './app.js';
import { init } from './socket.js';
import { init2 } from './db/mongodb.js';

const server = http.createServer(app);
const PORT = 8080;
init(server);
await init2();

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}); 

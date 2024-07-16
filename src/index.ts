import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import rateLimit from './middelware/rateLimit';
import concurrencyLimit from './middelware/concurrencyLimit';
import { Server as WebSocketServer } from 'ws';
import zohoService from './service/zohoServices';
import tokenService from './service/zohoServices';
import router from './routes/formRouter';
import { checkConnection } from './dbconfig';
import { createServer } from 'http';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });
const PORT = 3081;

app.use(express.json());

app.get('/', (req, res) => {
  res.send({ message: "successfully connected" });
});

app.use('/api/', rateLimit);
app.use('/api/', concurrencyLimit);
app.use('/api', router);

app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST'], 
}));
wss.on('connection', (ws) => {
  console.log('WebSocket connection established');
  ws.on('message', (message) => {
    console.log('Received message: ', message.toString());
  });
});

app.post('/api/v2/oauth/token', async (req, res) => {
  const { code } = req.body;
  console.log("***", code);
  if (!code) {
    return res.status(400).json({ error: 'Authorization code is required' });
  }

  try {
    const { access_token, refresh_token, expires_in } = await zohoService.getAccessTokenFromCode(code);
    console.log("Token received", { access_token, refresh_token, expires_in });
    await tokenService.saveToken(access_token, refresh_token, expires_in);
    return res.json({ access_token, refresh_token, expires_in });
  } catch (error) {
    console.error('Error generating access token:', error);
    res.status(500).json({ error: 'Failed to generate access token' });
  }
});

// Start the HTTP server
server.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
  checkConnection();
});

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import createPreferenceHandler from './api/create-preference';
import webhookMpHandler from './api/webhook-mp';
import mailTrackingHandler from './api/mail-tracking';
import mailPagoHandler from './api/mail-pago';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON bodies
  app.use(express.json());

  // API routes must be configured first
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Mercado Pago preference creation route
  app.post('/api/create-preference', createPreferenceHandler as any);

  // Mercado Pago Webhook notification route
  app.post('/api/webhook-mp', webhookMpHandler as any);

  // Mail Tracking notification route
  app.post('/api/mail-tracking', mailTrackingHandler as any);

  // Mail Pago notification route
  app.post('/api/mail-pago', mailPagoHandler as any);

  // Vite middleware setup with SPA support
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

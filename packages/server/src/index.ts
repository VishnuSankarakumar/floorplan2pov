import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Reconstruct __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Always load .env from the repo root (src → server → packages → root)
const envPath = path.resolve(__dirname, '../../../.env');
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('⚠️ dotenv error:', result.error);
} else {
  console.log('✅ dotenv loaded keys:', Object.keys(result.parsed || {}));
}

import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { limiter } from './ratelimit.js';
import { api } from './routes.js';

const app = express();

app.use(cors());

app.use(morgan('dev'));
app.use(limiter);
app.use('/api', api);

const port = Number(process.env.PORT || 8787);
app.listen(port, () => {
  console.log(`✅ Server listening on http://localhost:${port}`);
  console.log(`🔑 GEMINI_API_KEY loaded? ${!!process.env.GEMINI_API_KEY}`);
});

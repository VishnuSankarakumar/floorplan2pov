import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../../.env');

console.log("Looking for .env at:", envPath);

const result = dotenv.config({ path: envPath });

console.log("dotenv result:", result);
console.log("process.env.GEMINI_API_KEY =", process.env.GEMINI_API_KEY);
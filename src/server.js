import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import studentsRouter from './routes/students.js';
import attendanceRouter from './routes/attendance.js';
import { pool } from './config/db.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());
app.use('/uploads', express.static(path.resolve('uploads')));
app.get('/api/health', async (_req, res) => {
  try { await pool.query('SELECT 1'); res.json({ status: 'ok', database: 'connected' }); }
  catch { res.status(503).json({ status: 'error', database: 'disconnected' }); }
});
app.use('/api/students', studentsRouter);
app.use('/api/attendance', attendanceRouter);
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal server error.' });
});
app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`));

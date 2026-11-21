import { Router } from 'express';
import { pool } from '../config/db.js';
import { uploadStudentPhoto } from '../middleware/upload.js';
import fs from 'fs';
import path from 'path';

const router = Router();
const removePhoto = (url) => {
  if (!url) return;
  const filename = path.basename(url);
  const file = path.resolve('uploads', filename);
  if (fs.existsSync(file)) fs.unlinkSync(file);
};

router.get('/', async (_req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM students ORDER BY roll_number');
    res.json(rows);
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM students WHERE id=$1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ message: 'Student not found' });
    res.json(rows[0]);
  } catch (e) { next(e); }
});

router.post('/', uploadStudentPhoto.single('photo'), async (req, res, next) => {
  try {
    const { roll_number, full_name, email, phone } = req.body;
    if (!roll_number?.trim() || !full_name?.trim()) return res.status(400).json({ message: 'Roll number and full name are required.' });
    const photo_url = req.file ? `/uploads/${req.file.filename}` : null;
    const { rows } = await pool.query(
      `INSERT INTO students (roll_number, full_name, email, phone, photo_url)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [roll_number.trim(), full_name.trim(), email || null, phone || null, photo_url]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    if (req.file) removePhoto(`/uploads/${req.file.filename}`);
    if (e.code === '23505') return res.status(409).json({ message: 'Roll number already exists.' });
    next(e);
  }
});

router.put('/:id', uploadStudentPhoto.single('photo'), async (req, res, next) => {
  try {
    const { roll_number, full_name, email, phone } = req.body;
    if (!roll_number?.trim() || !full_name?.trim()) return res.status(400).json({ message: 'Roll number and full name are required.' });
    const current = await pool.query('SELECT photo_url FROM students WHERE id=$1', [req.params.id]);
    if (!current.rows[0]) return res.status(404).json({ message: 'Student not found' });
    const photo_url = req.file ? `/uploads/${req.file.filename}` : current.rows[0].photo_url;
    const { rows } = await pool.query(
      `UPDATE students SET roll_number=$1, full_name=$2, email=$3, phone=$4,
       photo_url=$5, updated_at=NOW() WHERE id=$6 RETURNING *`,
      [roll_number.trim(), full_name.trim(), email || null, phone || null, photo_url, req.params.id]
    );
    if (req.file && current.rows[0].photo_url) removePhoto(current.rows[0].photo_url);
    res.json(rows[0]);
  } catch (e) {
    if (req.file) removePhoto(`/uploads/${req.file.filename}`);
    if (e.code === '23505') return res.status(409).json({ message: 'Roll number already exists.' });
    next(e);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const current = await pool.query('SELECT photo_url FROM students WHERE id=$1', [req.params.id]);
    if (!current.rows[0]) return res.status(404).json({ message: 'Student not found' });
    await pool.query('DELETE FROM students WHERE id=$1', [req.params.id]);
    removePhoto(current.rows[0].photo_url);
    res.json({ message: 'Student deleted successfully.' });
  } catch (e) { next(e); }
});
export default router;

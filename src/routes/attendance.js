import { Router } from 'express';
import { pool } from '../config/db.js';
const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const date = req.query.date || new Date().toISOString().slice(0,10);
    const { rows } = await pool.query(
      `SELECT a.*, s.roll_number, s.full_name, s.photo_url
       FROM attendance a JOIN students s ON s.id=a.student_id
       WHERE a.attendance_date=$1 ORDER BY s.roll_number`, [date]
    );
    res.json(rows);
  } catch (e) { next(e); }
});

router.post('/', async (req, res, next) => {
  try {
    const { student_id, attendance_date, status, remarks } = req.body;
    if (!student_id || !attendance_date || !['Present','Absent','Late'].includes(status))
      return res.status(400).json({ message: 'Student, date and valid status are required.' });
    const { rows } = await pool.query(
      `INSERT INTO attendance (student_id, attendance_date, status, remarks)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (student_id, attendance_date) DO UPDATE
       SET status=EXCLUDED.status, remarks=EXCLUDED.remarks, updated_at=NOW()
       RETURNING *`, [student_id, attendance_date, status, remarks || null]
    );
    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { status, remarks, attendance_date } = req.body;
    if (!['Present','Absent','Late'].includes(status)) return res.status(400).json({ message: 'Invalid status.' });
    const { rows } = await pool.query(
      `UPDATE attendance SET status=$1, remarks=$2, attendance_date=COALESCE($3, attendance_date),
       updated_at=NOW() WHERE id=$4 RETURNING *`,
      [status, remarks || null, attendance_date || null, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ message: 'Attendance record not found.' });
    res.json(rows[0]);
  } catch (e) { next(e); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const result = await pool.query('DELETE FROM attendance WHERE id=$1', [req.params.id]);
    if (!result.rowCount) return res.status(404).json({ message: 'Attendance record not found.' });
    res.json({ message: 'Attendance record deleted.' });
  } catch (e) { next(e); }
});

router.get('/summary/daily', async (req, res, next) => {
  try {
    const date = req.query.date || new Date().toISOString().slice(0,10);
    const { rows } = await pool.query(
      `SELECT COUNT(*)::int AS marked,
       COUNT(*) FILTER (WHERE status='Present')::int AS present,
       COUNT(*) FILTER (WHERE status='Absent')::int AS absent,
       COUNT(*) FILTER (WHERE status='Late')::int AS late
       FROM attendance WHERE attendance_date=$1`, [date]
    );
    res.json(rows[0]);
  } catch (e) { next(e); }
});
export default router;

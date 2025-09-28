import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { setAuthCookie } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'name, email and password required' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'email already registered' });
    const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });
  const token = jwt.sign({ id: user._id.toString(), email, name, role: user.role }, process.env.JWT_SECRET || 'dev_secret_change_me', { expiresIn: '7d' });
    setAuthCookie(res, token);
  res.status(201).json({ id: user._id, name, email, role: user.role });
  } catch (e) { res.status(500).json({ error: 'server error' }); }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'invalid credentials' });
  const token = jwt.sign({ id: user._id.toString(), email, name: user.name, role: user.role }, process.env.JWT_SECRET || 'dev_secret_change_me', { expiresIn: '7d' });
    setAuthCookie(res, token);
  res.json({ id: user._id, name: user.name, email, role: user.role });
  } catch (e) { res.status(500).json({ error: 'server error' }); }
});

export default router;

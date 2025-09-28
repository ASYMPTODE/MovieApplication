import jwt from 'jsonwebtoken';

export function authRequired(req, res, next) {
  try {
    const token = req.cookies.token || (req.headers.authorization ? req.headers.authorization.split(' ')[1] : null);
    if (!token) return res.status(401).json({ error: 'not authenticated' });
  const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_change_me');
    req.user = { id: payload.id, email: payload.email, name: payload.name, role: payload.role };
    next();
  } catch (e) {
    return res.status(401).json({ error: 'invalid token' });
  }
}

export function setAuthCookie(res, token) {
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
}

export function adminRequired(req, res, next) {
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({ error: 'forbidden' })
  next()
}

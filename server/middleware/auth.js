import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/** Blocks the request unless a valid Bearer token is present. Attaches req.user. */
export const protect = async (req, res, next) => {
  const header = req.headers.authorization || '';

  if (!header.startsWith('Bearer ')) {
    res.status(401);
    return next(new Error('Not authorised. Sign in to continue.'));
  }

  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401);
      return next(new Error('This account no longer exists.'));
    }

    req.user = user;
    next();
  } catch {
    res.status(401);
    next(new Error('Session expired. Sign in again.'));
  }
};

/** Use after protect on routes only admins may touch. */
export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    res.status(403);
    return next(new Error('Admin access required.'));
  }
  next();
};

import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

/**
 * POST /api/auth/register
 * Body: { name, email, password }
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Name, email and password are all required.');
    }

    if (password.length < 6) {
      res.status(400);
      throw new Error('Password must be at least 6 characters.');
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      res.status(409);
      throw new Error('That email is already registered. Sign in instead.');
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      user: user.toJSON(),
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Enter your email and password.');
    }

    // password is select:false on the schema, so ask for it explicitly
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    // Same message for both cases so nobody can probe which emails exist.
    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error('Email or password is incorrect.');
    }

    res.json({
      user: user.toJSON(),
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me   (protected)
 * The client calls this on page load to restore the session from a stored token.
 */
export const getMe = async (req, res) => {
  res.json({ user: req.user.toJSON() });
};

/**
 * PUT /api/auth/me   (protected)
 * Body: { name?, avatar?, password? }
 */
export const updateMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (req.body.name) user.name = req.body.name;
    if (req.body.avatar !== undefined) user.avatar = req.body.avatar;
    if (req.body.password) user.password = req.body.password; // pre-save hook re-hashes

    const updated = await user.save();
    res.json({ user: updated.toJSON() });
  } catch (error) {
    next(error);
  }
};

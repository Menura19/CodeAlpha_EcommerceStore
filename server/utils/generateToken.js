import jwt from 'jsonwebtoken';

/** Signs a JWT carrying only the user id. Never put the password or email in here. */
const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });

export default generateToken;

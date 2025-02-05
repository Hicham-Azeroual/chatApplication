import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {
  try {
    // Generate token
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN, // e.g., "15d" for 15 days
    });

    // Set cookie options
    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000 // Convert days to milliseconds
      ),
      httpOnly: true, // Prevent client-side JS from accessing the cookie
      sameSite: 'strict', // Prevent CSRF attacks
      secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
    };

    // Send token to client as a cookie
    res.cookie('jwt', token, cookieOptions);

    // Return the token (optional, in case you need it for other purposes)
    return token;
  } catch (error) {
    console.error('Error generating token:', error);
    throw new Error('Failed to generate token');
  }
};
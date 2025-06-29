// app/api/middleware/auth.js
import jwt from 'jsonwebtoken';

export function verifyToken(request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { success: false, error: 'No token provided' };
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET not configured');
      return { success: false, error: 'Authentication configuration error' };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    return { 
      success: true, 
      user: {
        id: decoded.userId,
        email: decoded.email,
        name: decoded.name
      }
    };
  } catch (error) {
    console.error('Token verification error:', error.message);
    return { success: false, error: 'Invalid token' };
  }
}
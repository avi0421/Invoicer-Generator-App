// app/api/auth/verify/route.js
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET not configured');
      return NextResponse.json(
        { error: 'Authentication configuration error' },
        { status: 500 }
      );
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    return NextResponse.json({
      message: 'Token valid',
      user: {
        id: decoded.userId,
        email: decoded.email,
        name: decoded.name
      }
    });

  } catch (error) {
    console.error('Token verification error:', error.message);
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
}
// app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Mock user database - replace with your actual database
const users = [
  {
    id: 'user123',
    email: 'demo@example.com',
    password: 'password123', // In real app, this should be hashed
    name: 'Demo User'
  },
  {
    id: 'user456',
    email: 'test@example.com',
    password: 'test123',
    name: 'Test User'
  }
];

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET not configured');
      return NextResponse.json(
        { error: 'Authentication configuration error' },
        { status: 500 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        name: user.name 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return success response
    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
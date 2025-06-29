// app/api/invoices/route.js
import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';

const uri = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// Authentication middleware function
const authenticateUser = (request) => {
  try {
    const authHeader = request.headers.get('authorization');
    console.log('Auth header:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Invalid auth header format');
      return null;
    }

    const token = authHeader.substring(7);
    console.log('Token length:', token.length);
    
    if (!JWT_SECRET) {
      console.error('JWT_SECRET not configured in environment');
      return null;
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token decoded successfully for user:', decoded.userId);
    return decoded;
  } catch (error) {
    console.error('Authentication error:', error.message);
    return null;
  }
};

export async function GET(request) {
  try {
    console.log('GET /api/invoices - Starting request');
    
    // Authenticate user
    const user = authenticateUser(request);
    if (!user) {
      console.log('Authentication failed');
      return NextResponse.json(
        { error: 'Unauthorized - Invalid or missing token' },
        { status: 401 }
      );
    }

    console.log('User authenticated:', user.userId);

    if (!uri) {
      console.error('MONGODB_URI not configured');
      return NextResponse.json(
        { error: 'Database configuration error' },
        { status: 500 }
      );
    }

    const client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('invoice-database');
    const collection = db.collection('invoices');

    // Get only invoices for the authenticated user
    const invoices = await collection.find({ userId: user.userId }).sort({ createdAt: -1 }).toArray();
    console.log(`Found ${invoices.length} invoices for user ${user.userId}`);
    
    // Convert ObjectId to string for each invoice
    const formattedInvoices = invoices.map(invoice => ({
      ...invoice,
      _id: invoice._id.toString()
    }));

    await client.close();
    console.log('Database connection closed');

    return NextResponse.json(formattedInvoices);
  } catch (error) {
    console.error('Error in GET /api/invoices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    console.log('POST /api/invoices - Starting request');
    
    // Authenticate user
    const user = authenticateUser(request);
    if (!user) {
      console.log('Authentication failed');
      return NextResponse.json(
        { error: 'Unauthorized - Invalid or missing token' },
        { status: 401 }
      );
    }

    const data = await request.json();

    if (!uri) {
      console.error('MONGODB_URI not configured');
      return NextResponse.json(
        { error: 'Database configuration error' },
        { status: 500 }
      );
    }

    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('invoice-database');
    const collection = db.collection('invoices');

    const result = await collection.insertOne({
      ...data,
      userId: user.userId, // Associate invoice with authenticated user
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    await client.close();

    return NextResponse.json({ insertedId: result.insertedId.toString() });
  } catch (error) {
    console.error('Error in POST /api/invoices:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice', details: error.message },
      { status: 500 }
    );
  }
}
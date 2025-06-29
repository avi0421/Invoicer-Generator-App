import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

const uri = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// Authentication middleware function
const authenticateUser = (request) => {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
};

// Helper to extract ID from the URL (avoids "await params" warning)
const getIdFromUrl = (url) => url.pathname.split('/').at(-1);

// ✅ GET /api/invoices/:id
export async function GET(request) {
  const id = getIdFromUrl(request.nextUrl);

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid invoice ID' }, { status: 400 });
  }

  try {
    // Authenticate user
    const user = authenticateUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const client = new MongoClient(uri);
    await client.connect();
    const invoice = await client
      .db('invoice-database')
      .collection('invoices')
      .findOne({ 
        _id: new ObjectId(id),
        userId: user.userId // Ensure user can only access their own invoices
      });
    await client.close();

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    invoice._id = invoice._id.toString(); // Convert ObjectId for frontend
    return NextResponse.json(invoice);
  } catch (error) {
    console.error('GET /api/invoices/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch invoice' }, { status: 500 });
  }
}

// ✅ PUT /api/invoices/:id
export async function PUT(request) {
  const id = getIdFromUrl(request.nextUrl);

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid invoice ID' }, { status: 400 });
  }

  try {
    // Authenticate user
    const user = authenticateUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const client = new MongoClient(uri);
    await client.connect();
    
    // First check if the invoice exists and belongs to the user
    const existingInvoice = await client
      .db('invoice-database')
      .collection('invoices')
      .findOne({ 
        _id: new ObjectId(id),
        userId: user.userId 
      });

    if (!existingInvoice) {
      await client.close();
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    const result = await client
      .db('invoice-database')
      .collection('invoices')
      .updateOne(
        { _id: new ObjectId(id), userId: user.userId },
        { $set: { ...data, updatedAt: new Date().toISOString() } }
      );
    await client.close();

    return NextResponse.json({ message: 'Invoice updated successfully' });
  } catch (error) {
    console.error('PUT /api/invoices/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update invoice' }, { status: 500 });
  }
}

// ✅ DELETE /api/invoices/:id
export async function DELETE(request) {
  const id = getIdFromUrl(request.nextUrl);

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid invoice ID' }, { status: 400 });
  }

  try {
    // Authenticate user
    const user = authenticateUser(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const client = new MongoClient(uri);
    await client.connect();
    const result = await client
      .db('invoice-database')
      .collection('invoices')
      .deleteOne({ 
        _id: new ObjectId(id),
        userId: user.userId // Ensure user can only delete their own invoices
      });
    await client.close();

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('DELETE /api/invoices/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete invoice' }, { status: 500 });
  }
}

import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getAllInvoices() {
  try {
    const client = await clientPromise;
    const db = client.db('invoice-database');
    const collection = db.collection('invoices');
    
    const invoices = await collection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    return invoices;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw error;
  }
}

export async function getInvoiceById(id) {
  try {
    const client = await clientPromise;
    const db = client.db('invoice-database');
    const collection = db.collection('invoices');
    
    const { ObjectId } = require('mongodb');
    const invoice = await collection.findOne({ _id: new ObjectId(id) });
    
    return invoice;
  } catch (error) {
    console.error('Error fetching invoice:', error);
    throw error;
  }
}

export async function updateInvoice(id, data) {
  try {
    const client = await clientPromise;
    const db = client.db('invoice-database');
    const collection = db.collection('invoices');
    
    const { ObjectId } = require('mongodb');
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          ...data, 
          updatedAt: new Date().toISOString() 
        } 
      }
    );
    
    return result;
  } catch (error) {
    console.error('Error updating invoice:', error);
    throw error;
  }
}

export async function deleteInvoice(id) {
  try {
    const client = await clientPromise;
    const db = client.db('invoice-database');
    const collection = db.collection('invoices');
    
    const { ObjectId } = require('mongodb');
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    
    return result;
  } catch (error) {
    console.error('Error deleting invoice:', error);
    throw error;
  }
}
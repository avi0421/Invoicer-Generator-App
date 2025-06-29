// create-test-user.js
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function createTestUser() {
  const uri = process.env.MONGODB_URI || 'your-mongodb-connection-string';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('your-database-name'); // Replace with your actual database name
    const usersCollection = db.collection('users');

    // Test user credentials
    const testUser = {
      email: 'test@example.com',
      password: 'password123',
      username: 'testuser',
      createdAt: new Date()
    };

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email: testUser.email });
    if (existingUser) {
      console.log('❌ User already exists with email:', testUser.email);
      return;
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(testUser.password, saltRounds);
    
    console.log('🔐 Original password:', testUser.password);
    console.log('🔐 Hashed password:', hashedPassword);

    // Insert user with hashed password
    const result = await usersCollection.insertOne({
      ...testUser,
      password: hashedPassword
    });

    console.log('✅ Test user created successfully!');
    console.log('📧 Email:', testUser.email);
    console.log('🔑 Password:', testUser.password);
    console.log('🆔 User ID:', result.insertedId);

    // Verify the user was created
    const createdUser = await usersCollection.findOne({ email: testUser.email });
    console.log('✅ Verification - User found:', createdUser ? 'YES' : 'NO');

  } catch (error) {
    console.error('❌ Error creating test user:', error);
  } finally {
    await client.close();
  }
}

createTestUser();
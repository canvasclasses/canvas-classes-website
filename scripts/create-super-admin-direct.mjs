/**
 * Direct MongoDB Bootstrap Script
 * Creates super admin role directly in MongoDB without Next.js dependencies
 */

import { MongoClient } from 'mongodb';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;
const EMAIL = process.argv[2] || 'paaras.thakur07@gmail.com';

if (!MONGODB_URI) {
  console.error('❌ Error: MONGODB_URI not found in .env.local');
  process.exit(1);
}

if (!EMAIL.includes('@')) {
  console.error('❌ Error: Invalid email address');
  console.log('Usage: node scripts/create-super-admin-direct.mjs your-email@example.com');
  process.exit(1);
}

async function createSuperAdmin() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('📡 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('crucible');
    const collection = db.collection('user_roles');
    
    // Check if role already exists
    const existing = await collection.findOne({ email: EMAIL.toLowerCase() });
    
    if (existing) {
      console.log(`⚠️  Role already exists for ${EMAIL}`);
      console.log(`   Current role: ${existing.role}`);
      console.log(`   Subjects: ${existing.subjects?.join(', ') || 'All (super admin)'}`);
      console.log(`   Active: ${existing.is_active}`);
      
      // Update to super admin
      await collection.updateOne(
        { email: EMAIL.toLowerCase() },
        {
          $set: {
            role: 'super_admin',
            subjects: [],
            granted_by: 'bootstrap-script',
            granted_at: new Date(),
            is_active: true,
            updatedAt: new Date(),
          }
        }
      );
      console.log('✅ Updated to super admin successfully');
    } else {
      // Create new super admin role
      const role = {
        email: EMAIL.toLowerCase(),
        role: 'super_admin',
        subjects: [],
        granted_by: 'bootstrap-script',
        granted_at: new Date(),
        is_active: true,
        notes: 'Initial super admin created via bootstrap script',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await collection.insertOne(role);
      
      console.log('✅ Super admin role created successfully!');
      console.log(`   Email: ${role.email}`);
      console.log(`   Role: ${role.role}`);
      console.log(`   Access: All subjects (Chemistry, Physics, Mathematics)`);
    }
    
    console.log('\n📝 Next steps:');
    console.log('   1. Log in to http://localhost:3000/crucible/admin with this email');
    console.log('   2. Look for the Shield icon (🛡️) in the toolbar');
    console.log('   3. Click it to access Role Management');
    console.log('   4. Grant access to other faculty members');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\n🔌 MongoDB connection closed');
  }
}

createSuperAdmin();

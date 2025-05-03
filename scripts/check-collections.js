// Script to check if all required collections exist in Firebase and create them if they don't
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc } from 'firebase/firestore';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.VITE_FIREBASE_DATABASE_URL,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

// List of required collections
const requiredCollections = [
  'users',
  'restaurants',
  'shopMembers',
  'products',
  'categories',
  'inventory',
  'orders',
  'notifications',
  'settings'
];

// Function to check if a collection exists
async function checkCollection(collectionName) {
  try {
    const collectionRef = collection(firestore, collectionName);
    const snapshot = await getDocs(collectionRef);
    console.log(`Collection '${collectionName}' exists with ${snapshot.docs.length} documents`);
    return true;
  } catch (error) {
    console.error(`Error checking collection '${collectionName}':`, error);
    return false;
  }
}

// Function to create a collection with a sample document
async function createCollection(collectionName) {
  try {
    // Create a sample document in the collection
    const docRef = doc(firestore, collectionName, 'sample');
    await setDoc(docRef, {
      createdAt: new Date().toISOString(),
      isSystemGenerated: true,
      description: `Sample document for ${collectionName} collection`
    });
    console.log(`Created collection '${collectionName}' with a sample document`);
    return true;
  } catch (error) {
    console.error(`Error creating collection '${collectionName}':`, error);
    return false;
  }
}

// Main function to check and create collections
async function checkAndCreateCollections() {
  console.log('Checking Firebase collections...');

  for (const collectionName of requiredCollections) {
    const exists = await checkCollection(collectionName);

    if (!exists) {
      console.log(`Collection '${collectionName}' does not exist. Creating...`);
      await createCollection(collectionName);
    }
  }

  console.log('Collection check complete!');
}

// Run the script
checkAndCreateCollections()
  .then(() => {
    console.log('Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });

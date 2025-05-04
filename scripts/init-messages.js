// Script to initialize the messages collection in Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
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
const db = getFirestore(app);

// Function to check if a collection exists and has documents
async function collectionExists(collectionName) {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    return !querySnapshot.empty;
  } catch (error) {
    console.error(`Error checking if collection ${collectionName} exists:`, error);
    return false;
  }
}

// Function to create a chat
async function createChat(chatData) {
  try {
    const chatId = Date.now().toString();
    await setDoc(doc(db, 'chats', chatId), {
      ...chatData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      unreadCount: 0
    });
    return chatId;
  } catch (error) {
    console.error('Error creating chat:', error);
    throw error;
  }
}

// Function to create a message
async function createMessage(messageData) {
  try {
    const messageId = Date.now().toString() + Math.floor(Math.random() * 1000);
    await setDoc(doc(db, 'messages', messageId), {
      ...messageData,
      timestamp: new Date().toISOString(),
      isRead: false
    });
    return messageId;
  } catch (error) {
    console.error('Error creating message:', error);
    throw error;
  }
}

// Function to update chat with last message info
async function updateChatWithLastMessage(chatId, messageData) {
  try {
    await setDoc(doc(db, 'chats', chatId), {
      lastMessage: messageData.text,
      lastMessageTimestamp: new Date().toISOString(),
      lastMessageSender: messageData.sender,
      updatedAt: new Date().toISOString(),
      unreadCount: messageData.sender === 'vendor' ? 0 : 1
    }, { merge: true });
  } catch (error) {
    console.error('Error updating chat with last message:', error);
    throw error;
  }
}

// Main function to initialize messages
async function initializeMessages() {
  console.log('Checking if messages collection exists...');
  
  const chatsExist = await collectionExists('chats');
  const messagesExist = await collectionExists('messages');
  
  if (chatsExist && messagesExist) {
    console.log('Messages and chats collections already exist and have data.');
    return;
  }
  
  console.log('Initializing messages collection...');
  
  // Get all restaurants
  const restaurantsSnapshot = await getDocs(collection(db, 'restaurants'));
  const restaurants = restaurantsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  if (restaurants.length === 0) {
    console.log('No restaurants found. Please create restaurants first.');
    return;
  }
  
  // For each restaurant, create sample chats and messages
  for (const restaurant of restaurants) {
    console.log(`Creating sample chats for restaurant: ${restaurant.name} (${restaurant.id})`);
    
    // Sample customer names
    const customers = [
      { name: 'John Smith', orderId: '1042' },
      { name: 'Maria Garcia', orderId: '1039' },
      { name: 'David Lee', orderId: null },
      { name: 'BiziShop Support', orderId: null }
    ];
    
    // Create chats for each customer
    for (const customer of customers) {
      // Create chat
      const chatId = await createChat({
        participants: [restaurant.id],
        restaurantId: restaurant.id,
        customerName: customer.name,
        orderId: customer.orderId
      });
      
      console.log(`Created chat ${chatId} for ${customer.name}`);
      
      // Create sample messages
      if (customer.name === 'John Smith') {
        // First message from customer
        const msg1 = await createMessage({
          chatId,
          sender: 'customer',
          senderId: 'customer-id',
          text: `Hi, I just placed an order #${customer.orderId} but I'd like to modify it.`
        });
        
        // Update chat with last message
        await updateChatWithLastMessage(chatId, {
          sender: 'customer',
          text: `Hi, I just placed an order #${customer.orderId} but I'd like to modify it.`
        });
        
        // Second message from customer
        const msg2 = await createMessage({
          chatId,
          sender: 'customer',
          senderId: 'customer-id',
          text: "I'd like to remove the onions from my tacos and add extra cheese if possible."
        });
        
        // Update chat with last message
        await updateChatWithLastMessage(chatId, {
          sender: 'customer',
          text: "I'd like to remove the onions from my tacos and add extra cheese if possible."
        });
      } 
      else if (customer.name === 'Maria Garcia') {
        // First message from customer
        const msg1 = await createMessage({
          chatId,
          sender: 'customer',
          senderId: 'customer-id',
          text: `Hello, I placed order #${customer.orderId} about 20 minutes ago.`
        });
        
        // Update chat with last message
        await updateChatWithLastMessage(chatId, {
          sender: 'customer',
          text: `Hello, I placed order #${customer.orderId} about 20 minutes ago.`
        });
        
        // Response from vendor
        const msg2 = await createMessage({
          chatId,
          sender: 'vendor',
          senderId: restaurant.id,
          text: "Hi Maria, we're working on your order now. It should be ready in about 10 minutes."
        });
        
        // Update chat with last message
        await updateChatWithLastMessage(chatId, {
          sender: 'vendor',
          text: "Hi Maria, we're working on your order now. It should be ready in about 10 minutes."
        });
        
        // Follow-up from customer
        const msg3 = await createMessage({
          chatId,
          sender: 'customer',
          senderId: 'customer-id',
          text: "What time will my order be ready?"
        });
        
        // Update chat with last message
        await updateChatWithLastMessage(chatId, {
          sender: 'customer',
          text: "What time will my order be ready?"
        });
      }
      else if (customer.name === 'David Lee') {
        // First message from customer
        const msg1 = await createMessage({
          chatId,
          sender: 'customer',
          senderId: 'customer-id',
          text: "Just picked up my order. Everything looks great!"
        });
        
        // Update chat with last message
        await updateChatWithLastMessage(chatId, {
          sender: 'customer',
          text: "Just picked up my order. Everything looks great!"
        });
        
        // Second message from customer
        const msg2 = await createMessage({
          chatId,
          sender: 'customer',
          senderId: 'customer-id',
          text: "Thanks for the quick service!"
        });
        
        // Update chat with last message
        await updateChatWithLastMessage(chatId, {
          sender: 'customer',
          text: "Thanks for the quick service!"
        });
        
        // Response from vendor
        const msg3 = await createMessage({
          chatId,
          sender: 'vendor',
          senderId: restaurant.id,
          text: "You're welcome, David! Enjoy your meal and please visit us again soon."
        });
        
        // Update chat with last message
        await updateChatWithLastMessage(chatId, {
          sender: 'vendor',
          text: "You're welcome, David! Enjoy your meal and please visit us again soon."
        });
      }
      else if (customer.name === 'BiziShop Support') {
        // Message from support
        const msg1 = await createMessage({
          chatId,
          sender: 'support',
          senderId: 'support-id',
          text: "Hello! This is BiziShop Support. How can we help you today?"
        });
        
        // Update chat with last message
        await updateChatWithLastMessage(chatId, {
          sender: 'support',
          text: "Hello! This is BiziShop Support. How can we help you today?"
        });
      }
    }
  }
  
  console.log('Messages collection initialized successfully!');
}

// Run the initialization
initializeMessages()
  .then(() => {
    console.log('Script completed successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error running script:', error);
    process.exit(1);
  });

const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = {
  "type": "service_account",
  "project_id": "bizibase",
  "private_key_id": "3625b3bf493f264f309b8882aea92b986686b83c",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCrl8mQZzmsZpM1\namgznSNVJM8I7/b9ytwEilI1A+ZODdgqXUjlbDC/W2A+b62eav/AUBjurfqgZ9eq\n0xZL0L1NfgCOQIanLkcJsTBUfGu5RhifrEWB3H0UBn+ic2ANMKkoiERw38KAGARD\nMbuTayYhGJ3ihisep9CAWa5zFY5uQ34MH4LyL92g/uVoT87LnaFVpic2n90u2xv8\nBGdycHzTYU+wZltFNCmGvt2tNPPjTUu9UEiPuBsFnCXBLJ9u3JlTLZKX5tUEuhRv\n/1sWUt0Zb1rY+CgSunsPuDD+TLlYadWZeRObaVaBsGyDhW3oJjg5a1i9vLaRZ9ve\nSCLbcRcxAgMBAAECggEALl+RnkB/ciuwigWNTrGffGG7wBcWAaXCy0lUiTZaFesg\n6eYXDsWr8PMxcf49hiw1nRQogMytCI+31ddBVdD+cARnAwrGOUVE9oYX4SVU+ZfL\njM+CY2Oiu/g7ozwaD8aAWM9m67hVOMgE0uIMZv1UqyobdT48RgclTqKuBjUjroGG\nkcin82TLzFV7I79EyoyVigV5HINZqR5H7oPn6AT9c29JVBwKB1GFP7FaH+S9DDm5\nVYY9tRcs0DTZQuawOjC6CkUKHxWKhKzszmWZ6HVuCfz2Z68yOkMwCBmREKsP/Iuu\nf3wFPnv0oEmHCHY9EmESBHDe1bNIvzbxhtqF4LoQhwKBgQDcGPCFdS8ivL5raGdr\nt451syMmEjN5KpcILVd7lxmtJbiZuIppv+Cr06XcamD1puqfMZ3kklYiBQVTtVnO\nJabR6W/MLnI/ou3oYFXINjeCl644Ga62+L7MJpwGpyHoUxdxtDapX0yJp+XWg0aZ\nrzKWV0oVsY1AKJoM4Mvln1epWwKBgQDHlVh9usv/3vNSdS5BrZVAKj99CotVfa/H\nn7PjpA3zGx1oXeX1Pqc0+qDlUXFlkw+8m4tgTnTM3KH8kN9L7c/Eb4O1SERVwL0c\nhpyrUsO/oniFXSwlIemNxzMlCi1Bx/3XcdokLxni2nCGwJRQ5mVxmZZmQZkXoMf1\nXkDb+mobYwKBgEWedeYhDQnV3f2nhp8h7qP4R/Pw6es3t5JUlUl4oByOw/eL0exl\nTzHKvrobxBOv+qLkVOdKCoi0Qd0ajg+RBVV8m2pgfq72YH6Sik/MJn7eb7M7HHKv\n99onlE7eavFL5yyGLowgotsgCqlx2NEgA8ZeUgbOpLlYnnHYYWZ+ooHlAoGBAJRC\nkRX1KY3N5RsgCVioxfKAb+FHb/H2CBpWvJ8iQ2qQfewFtMnV3QgyFkvDkGVQNaR6\nN7M3FPUKARtJ01boNitKW6DTKlA5eUIzjTaHqPo2iykm6aA77O9xRsEBKlVvZ1Yg\nMVgn1Sb79hNkA8mFHV6iJWOY30z6FxBjD/NZtnDZAoGAIlIWP5mmdghmE/drTgpQ\nLZTogpnu5SOr+ofyTohVywni4jgtJMbX5CN/iLkm+8arLAJqrtwMglV3VSzRo0fp\n8WPxF01v2kIx4iF8E0AzzaPY2PwmN5IVFPwyFd51oTKXV8TiT0SseuvyeM7PiMsj\nSFlk87W091qMJMpnG/+vNps=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@bizibase.iam.gserviceaccount.com",
  "client_id": "108234230243857405202",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40bizibase.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Firestore Schema Definition
const firestoreSchema = {
  users: {
    fields: {
      name:           { type: 'string' },
      email:          { type: 'string' },
      role:           { type: 'string', allowed: ['owner','manager','cashier','driver','admin','customer'] },
      restaurant_ids: { type: 'array',  items: 'string' },
      createdAt:      { type: 'timestamp' },
    }
  },

  user_settings: {
    fields: {
      appearance:    { type: 'map' },
      notifications: { type: 'map' },
      privacy:       { type: 'map' },
      timezone:      { type: 'string' },
    }
  },

  restaurants: {
    fields: {
      name:         { type: 'string' },
      address:      { type: 'map',  schema: ['street','city','state','country','zipCode'] },
      contact:      { type: 'map' },
      cuisine:      { type: 'array', items: 'string' },
      working_hours:{ type: 'array', items: 'map' },
      owner_id:     { type: 'string' },
      status:       { type: 'string' },
      updated_at:   { type: 'timestamp' },
    }
  },

  shopMembers: {
    fields: {
      shopId: { type: 'string' },
      userId: { type: 'string' },
      role:   { type: 'string', allowed: ['manager','cashier'] },
    }
  },

  products: {
    fields: {
      name:          { type: 'string' },
      description:   { type: 'string' },
      price:         { type: 'number' },
      isAvailable:   { type: 'boolean' },
      category:      { type: 'string' },
      imageUrl:      { type: 'string' },
      restaurant_id: { type: 'string' },
    }
  },

  inventory: {
    fields: {
      productId: { type: 'string' },
      quantity:  { type: 'number' },
      unit:      { type: 'string' },
      status:    { type: 'string', allowed: ['ok','low','out'] },
    }
  },

  suppliers: {
    fields: {
      name:          { type: 'string' },
      contactPerson: { type: 'string' },
      email:         { type: 'string' },
      phone:         { type: 'string' },
      address:       { type: 'string' },
      itemsSupplied: { type: 'array', items: 'string' },
      lastOrder:     { type: 'string' },
    }
  },

  deliveries: {
    fields: {
      supplierId:           { type: 'string' },
      supplierName:         { type: 'string' },
      orderDate:            { type: 'timestamp' },
      expectedDeliveryDate: { type: 'timestamp' },
      status:               { type: 'string' },
      items:                { type: 'array', items: 'map' },
      totalCost:            { type: 'number' },
      notes:                { type: 'string' },
    }
  },

  orders: {
    fields: {
      user_id:       { type: 'string' },
      restaurant_id: { type: 'string' },
      driver_id:     { type: 'string' },
      createdAt:     { type: 'timestamp' },
      updatedAt:     { type: 'timestamp' },
      status:        { type: 'string' },
      customer:      { type: 'map' },
      items:         { type: 'array', items: 'map' },
      total:         { type: 'number' },
    }
  },

  categories: {
    fields: {
      name:        { type: 'string' },
      description: { type: 'string' },
      order:       { type: 'number' },
    }
  },

  settings: {
    fields: {
      currency: { type: 'string' },
      taxRate:  { type: 'number' },
      name:     { type: 'string' },
    }
  },

  // Chats & Messages
  chats: {
    fields: {
      participants:       { type: 'array',  items: 'string' }, // list of user UIDs
      createdAt:          { type: 'timestamp' },
      lastMessageText:    { type: 'string' },
      lastMessageTimestamp: { type: 'timestamp' },
    },
    subcollections: {
      messages: {
        fields: {
          userId:    { type: 'string' },
          text:      { type: 'string' },
          timestamp: { type: 'timestamp' },
        }
      }
    }
  }
};

async function migrateSchema() {
  for (const collectionName in firestoreSchema) {
    console.log(`Processing collection: ${collectionName}`);

    // 1. Ensure root collection exists and 2. Write schema stub document
    const collectionRef = db.collection(collectionName);
    const schemaDocRef = collectionRef.doc('_schema');

    // Check if the schema document already exists
    const schemaDoc = await schemaDocRef.get();
    if (!schemaDoc.exists) {
      console.log(`Creating schema document for ${collectionName}`);
      await schemaDocRef.set({
        fields: firestoreSchema[collectionName].fields,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    } else {
      console.log(`Schema document already exists for ${collectionName}`);
    }

    // 3. Handle subcollections (e.g., messages in chats)
    if (firestoreSchema[collectionName].subcollections) {
      for (const subcollectionName in firestoreSchema[collectionName].subcollections) {
        const subcollectionSchema = firestoreSchema[collectionName].subcollections[subcollectionName];
        const subcollectionRef = collectionRef.doc('dummy').collection(subcollectionName); // Need a dummy doc to create subcollection
        const subcollectionSchemaDocRef = subcollectionRef.doc('_schema');

        // Check if the subcollection schema document already exists
        const subcollectionSchemaDoc = await subcollectionSchemaDocRef.get();
        if (!subcollectionSchemaDoc.exists) {
          console.log(`Creating subcollection schema document for ${collectionName}/${subcollectionName}`);
          await subcollectionSchemaDocRef.set({
            fields: subcollectionSchema.fields,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          });
        } else {
          console.log(`Subcollection schema document already exists for ${collectionName}/${subcollectionName}`);
        }
      }
    }

    // 4. Migrate or update existing documents
    console.log(`Migrating existing documents for ${collectionName}`);
    await migrateDocuments(collectionName, firestoreSchema[collectionName].fields);
  }

  // 5. Verify and create composite indexes
  console.log('Creating composite indexes...');
  try {
    await createCompositeIndex('orders', [{ fieldPath: 'restaurant_id', order: 'ASCENDING' }, { fieldPath: 'createdAt', order: 'DESCENDING' }]);
    await createCompositeIndex('products', [{ fieldPath: 'isAvailable', order: 'ASCENDING' }, { fieldPath: 'restaurant_id', order: 'ASCENDING' }, { fieldPath: 'name', order: 'ASCENDING' }]);
  } catch (error) {
    console.error('Error creating composite indexes:', error);
  }

  // 6. Apply security rules (implementation needed)
  console.log('Applying security rules needs implementation. Please update firestore.rules manually.');
}

// Helper function to create composite indexes
async function createCompositeIndex(collectionName, fields) {
  const indexName = `composite_index_${collectionName}_${fields.map(f => f.fieldPath).join('_')}`;
  try {
    // Composite indexes can only be created via the Firebase console or CLI
    console.log(`Please create composite index ${indexName} manually via the Firebase console or CLI`);
  } catch (error) {
    console.error(`Error creating composite index ${indexName}:`, error);
  }
}

async function migrateDocuments(collectionName, schemaFields) {
  const collectionRef = db.collection(collectionName);
  const snapshot = await collectionRef.get();

  snapshot.forEach(async doc => {
    const docData = doc.data();
    let updated = false;
    const updates = {};

    // Remove extra fields
    for (const field in docData) {
      if (!schemaFields[field]) {
        console.log(`Removing extra field ${field} from document ${doc.id}`);
        updates[field] = admin.firestore.FieldValue.delete();
        updated = true;
      }
    }

    // Add missing fields
    for (const field in schemaFields) {
      if (docData[field] === undefined) {
        console.log(`Adding missing field ${field} to document ${doc.id}`);
        updates[field] = null;
        updated = true;
      }
    }

    if (updated) {
      await collectionRef.doc(doc.id).update(updates);
      console.log(`Updated document ${doc.id} in collection ${collectionName}`);
    }
  });
}

migrateSchema()
  .then(() => {
    console.log('Schema migration completed!');
  })
  .catch(error => {
    console.error('Schema migration failed:', error);
  });

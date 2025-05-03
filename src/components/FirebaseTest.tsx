import React, { useState, useEffect } from 'react';
import { firebaseAuth } from '../lib/firebase';
import { userDB, menuDB, inventoryDB, shopDB } from '../lib/firebase-db';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';

const FirebaseTest = () => {
  const [status, setStatus] = useState<string>('Checking Firebase connection...');
  const [user, setUser] = useState<any>(null);
  const [testData, setTestData] = useState<any>(null);

  useEffect(() => {
    // Check if Firebase is initialized correctly
    try {
      // Set up auth state listener
      const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
        if (user) {
          setUser(user);
          setStatus('Firebase connected and user authenticated');
        } else {
          setUser(null);
          setStatus('Firebase connected but no user authenticated');
        }
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Firebase initialization error:', error);
      setStatus(`Firebase connection error: ${error}`);
    }
  }, []);

  const handleTestFirestore = async () => {
    try {
      setStatus('Testing Firestore...');

      // Create a test document
      const testId = 'test-' + Date.now();
      await userDB.setUserProfile(testId, {
        name: 'Test User',
        email: 'test@example.com',
        role: 'cashier',
        createdAt: new Date().toISOString()
      });

      // Retrieve the test document
      const testUser = await userDB.getUserProfile(testId);
      setTestData(testUser);
      setStatus('Firestore test successful!');
    } catch (error) {
      console.error('Firestore test error:', error);
      setStatus(`Firestore test failed: ${error}`);
    }
  };

  const handleTestAuth = async () => {
    try {
      setStatus('Testing Firebase Auth...');

      // Create a test user with a random email
      const email = `test${Date.now()}@example.com`;
      const password = 'Test123!';

      // Sign up
      await firebaseAuth.signUp({
        email,
        password,
        metadata: {
          name: 'Test User',
          role: 'cashier'
        }
      });

      setStatus(`Firebase Auth test successful! Test user created with email: ${email} and password: ${password}`);

      // Store the test credentials for easy access
      localStorage.setItem('testEmail', email);
      localStorage.setItem('testPassword', password);
    } catch (error) {
      console.error('Firebase Auth test error:', error);
      setStatus(`Firebase Auth test failed: ${error}`);
    }
  };

  const handleTestSignIn = async () => {
    try {
      // Get the stored test credentials
      const testEmail = localStorage.getItem('testEmail');
      const testPassword = localStorage.getItem('testPassword');

      if (!testEmail || !testPassword) {
        setStatus('No test credentials found. Please create a test user first.');
        return;
      }

      setStatus(`Attempting to sign in with test user: ${testEmail}...`);

      // Sign in with the test user
      await firebaseAuth.signInWithEmailAndPassword(testEmail, testPassword);

      setStatus('Test sign-in successful!');
    } catch (error) {
      console.error('Test sign-in error:', error);
      setStatus(`Test sign-in failed: ${error}`);
    }
  };

  const handleSignOut = async () => {
    try {
      setStatus('Signing out...');
      await firebaseAuth.signOut();
      setStatus('Sign out successful!');
    } catch (error) {
      console.error('Sign out error:', error);
      setStatus(`Sign out failed: ${error}`);
    }
  };

  const handleCreateTestShop = async () => {
    try {
      setStatus('Creating test shop...');

      // Create a test shop
      const shopId = `shop-test-${Date.now()}`;
      const shopData = {
        name: `Test Shop ${Date.now()}`,
        address: '123 Test Street, Test City',
        ownerId: user ? user.uid : 'test-owner',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await shopDB.setShop(shopId, shopData);

      setStatus(`Test shop created successfully! Shop ID: ${shopId}`);
      setTestData(shopData);
    } catch (error) {
      console.error('Error creating test shop:', error);
      setStatus(`Failed to create test shop: ${error}`);
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4 text-center">
        <a href="/auth" className="text-blue-500 hover:underline">Go to Authentication Screen</a>
      </div>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Firebase Connection Test</CardTitle>
          <CardDescription>
            Testing connection to your Firebase project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-md">
              <h3 className="font-medium mb-2">Status:</h3>
              <p className={status.includes('error') ? 'text-red-500' : 'text-green-500'}>
                {status}
              </p>
            </div>

            {user && (
              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-2">Current User:</h3>
                <p>UID: {user.uid}</p>
                <p>Email: {user.email}</p>
              </div>
            )}

            {testData && (
              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-2">Test Data:</h3>
                <pre className="text-xs overflow-auto p-2 bg-gray-100 rounded">
                  {JSON.stringify(testData, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleTestFirestore}>
            Test Firestore
          </Button>
          <Button variant="outline" onClick={handleTestAuth}>
            Create Test User
          </Button>
          <Button variant="outline" onClick={handleTestSignIn}>
            Test Sign In
          </Button>
          {user && (
            <Button variant="outline" onClick={handleSignOut} className="bg-red-50 hover:bg-red-100">
              Sign Out
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default FirebaseTest;

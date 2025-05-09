import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { firestoreDB, shopDB } from '../lib/firebase-db';
import { UserRole, firebaseAuth } from '../lib/firebase';
import { User } from '../types/models';
import { getFirestore, collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { getFirebaseErrorMessage, logError } from '../lib/error-handler';

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Progress } from './ui/progress';

// Step 1: Basic Info
interface Step1Props {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (confirmPassword: string) => void;
  name: string;
  setName: (name: string) => void;
  onNext: () => void;
}

const Step1: React.FC<Step1Props> = ({
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  name,
  setName,
  onNext,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';

    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (!name) newErrors.name = 'Name is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      onNext();
    }
  };

  return (
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="john@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
      </div>

      <Button className="w-full" onClick={handleNext}>
        Next
      </Button>
    </CardContent>
  );
};

// Step 2: Role Selection
interface Step2Props {
  role: UserRole;
  setRole: (role: UserRole) => void;
  onNext: () => void;
  onBack: () => void;
}

const Step2: React.FC<Step2Props> = ({ role, setRole, onNext, onBack }) => {
  return (
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label>Select Your Role</Label>
        <RadioGroup value={role} onValueChange={(value) => setRole(value as UserRole)}>
          <div className="flex items-center space-x-2 p-2 border rounded-md">
            <RadioGroupItem value="owner" id="owner" />
            <Label htmlFor="owner" className="flex-1 cursor-pointer">
              <div className="font-medium">Owner</div>
              <div className="text-sm text-gray-500">
                You own the business and have full access to all features
              </div>
            </Label>
          </div>

          <div className="flex items-center space-x-2 p-2 border rounded-md">
            <RadioGroupItem value="manager" id="manager" />
            <Label htmlFor="manager" className="flex-1 cursor-pointer">
              <div className="font-medium">Manager</div>
              <div className="text-sm text-gray-500">
                You manage the business and have access to most features
              </div>
            </Label>
          </div>

          <div className="flex items-center space-x-2 p-2 border rounded-md">
            <RadioGroupItem value="cashier" id="cashier" />
            <Label htmlFor="cashier" className="flex-1 cursor-pointer">
              <div className="font-medium">Cashier</div>
              <div className="text-sm text-gray-500">
                You handle orders and have limited access to features
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex space-x-2">
        <Button variant="outline" className="w-full" onClick={onBack}>
          Back
        </Button>
        <Button className="w-full" onClick={onNext}>
          Next
        </Button>
      </div>
    </CardContent>
  );
};

// Step 3: Profile Details
interface Step3Props {
  profilePicture: string;
  setProfilePicture: (profilePicture: string) => void;
  phone: string;
  setPhone: (phone: string) => void;
  address: string;
  setAddress: (address: string) => void;
  bio: string;
  setBio: (bio: string) => void;
  onNext: () => void;
  onBack: () => void;
  name: string;
}

const Step3: React.FC<Step3Props> = ({
  profilePicture,
  setProfilePicture,
  phone,
  setPhone,
  address,
  setAddress,
  bio,
  setBio,
  onNext,
  onBack,
  name,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Function to handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};

    if (!phone) newErrors.phone = 'Phone number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep3()) {
      onNext();
    }
  };

  return (
    <CardContent className="space-y-4">
      <div className="flex flex-col items-center space-y-2">
        <Avatar className="h-24 w-24">
          <AvatarImage src={profilePicture} alt={name} />
          <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <Label htmlFor="profilePicture" className="cursor-pointer text-sm text-blue-500">
          Upload Profile Picture
        </Label>
        <Input
          id="profilePicture"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileUpload}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          placeholder="+1 (555) 123-4567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          placeholder="123 Main St, City, Country"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          placeholder="Tell us about yourself..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
        />
      </div>

      <div className="flex space-x-2">
        <Button variant="outline" className="w-full" onClick={onBack}>
          Back
        </Button>
        <Button className="w-full" onClick={handleNext}>
          Next
        </Button>
      </div>
    </CardContent>
  );
};

// Step 4: Shop Selection/Creation
interface Shop {
  id: string;
  name: string;
  address: string;
  ownerId: string;
}

interface Step4Props {
  role: UserRole;
  shopId: string;
  setShopId: (shopId: string) => void;
  shopName: string;
  setShopName: (shopName: string) => void;
  shopAddress: string;
  setShopAddress: (shopAddress: string) => void;
  onComplete: () => void;
  onBack: () => void;
}

const Step4: React.FC<Step4Props> = ({
  role,
  shopId,
  setShopId,
  shopName,
  setShopName,
  shopAddress,
  setShopAddress,
  onComplete,
  onBack,
}) => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Load all restaurants from Firestore
  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        setLoading(true);
        setFetchError(null);

        // Check if user is already authenticated
        const currentUser = firebaseAuth.getCurrentUser();

        if (!currentUser) {
          // If not authenticated, we need to create a temporary account
          setFetchError("Creating temporary access to view restaurants...");

          try {
            // Create a temporary email that won't conflict with real users
            const tempEmail = `temp_${Date.now()}@example.com`;
            const tempPassword = "TemporaryPassword123!";

            // Create temporary account
            await firebaseAuth.signUp({
              email: tempEmail,
              password: tempPassword,
              metadata: { role: 'temp' }
            });

            // Now we should be authenticated and can fetch restaurants
            console.log("Temporary authentication created for restaurant fetching");
          } catch (authError) {
            console.error("Error creating temporary authentication:", authError);
            // Continue anyway - the user might already be authenticated
          }
        }

        // Now try to get restaurants from Firestore
        const firestore = getFirestore();
        const restaurantsRef = collection(firestore, 'restaurants');
        const querySnapshot = await getDocs(restaurantsRef);

        // Map the Firestore data to our Shop interface
        const restaurantsData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data
          };
        });

        // Format the restaurant data
        const formattedRestaurants = restaurantsData.map(restaurant => {
          // Extract restaurant data with proper type handling
          const restaurantData = restaurant as any;

          // Get the name
          let name = 'Unnamed Restaurant';
          if (restaurantData.name) {
            name = restaurantData.name;
          } else if (restaurantData.restaurant_name) {
            name = restaurantData.restaurant_name;
          }

          // Get the address
          let address = 'No address provided';
          if (typeof restaurantData.address === 'string') {
            address = restaurantData.address;
          } else if (restaurantData.address && typeof restaurantData.address === 'object') {
            const addr = restaurantData.address;
            const addressParts = [];

            if (addr.street) addressParts.push(addr.street);
            if (addr.city) addressParts.push(addr.city);
            if (addr.state) addressParts.push(addr.state);

            if (addressParts.length > 0) {
              address = addressParts.join(', ');
            }
          }

          // Get the owner ID
          let ownerId = '';
          if (restaurantData.ownerId) {
            ownerId = restaurantData.ownerId;
          } else if (restaurantData.owner_id) {
            ownerId = restaurantData.owner_id;
          }

          return {
            id: restaurant.id,
            name,
            address,
            ownerId
          };
        });

        setShops(formattedRestaurants);

        // If no restaurants found, set error message
        if (formattedRestaurants.length === 0) {
          setFetchError("No restaurants found in the database.");
        }
      } catch (error) {
        console.error('Error loading restaurants:', error);
        setFetchError('Failed to load restaurants due to permission issues. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadRestaurants();
  }, []);

  const validateStep4 = () => {
    const newErrors: Record<string, string> = {};

    if (role === 'owner') {
      if (!shopName) newErrors.shopName = 'Shop name is required';
      if (!shopAddress) newErrors.shopAddress = 'Shop address is required';
    } else {
      if (!shopId) newErrors.shopId = 'Please select a shop';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleComplete = () => {
    if (validateStep4()) {
      onComplete();
    }
  };

  const filteredShops = shops.filter(shop =>
    shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shop.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <CardContent className="space-y-4">
      {role === 'owner' ? (
        // Shop creation form for owners
        <>
          <div className="space-y-2">
            <Label htmlFor="shopName">Shop Name</Label>
            <Input
              id="shopName"
              placeholder="My Coffee Shop"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
            />
            {errors.shopName && <p className="text-sm text-red-500">{errors.shopName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="shopAddress">Shop Address</Label>
            <Input
              id="shopAddress"
              placeholder="123 Main St, City, Country"
              value={shopAddress}
              onChange={(e) => setShopAddress(e.target.value)}
            />
            {errors.shopAddress && <p className="text-sm text-red-500">{errors.shopAddress}</p>}
          </div>
        </>
      ) : (
        // Shop selection for managers and cashiers
        <>
          <div className="space-y-2">
            <Label htmlFor="shopSearch">Search Shops</Label>
            <Input
              id="shopSearch"
              placeholder="Search by name or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            <Label>Select a Shop</Label>

            {loading ? (
              <div className="text-center py-4">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-orange-400 border-r-transparent"></div>
                <p className="mt-2 text-sm text-gray-500">Loading restaurants...</p>
              </div>
            ) : fetchError ? (
              <div className="text-center py-4 text-red-500">
                <p>No restaurants found. Please try again.</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={async () => {
                    setLoading(true);
                    setFetchError(null);

                    try {
                      // Get all restaurants from Firestore
                      const firestore = getFirestore();
                      const restaurantsRef = collection(firestore, 'restaurants');
                      const querySnapshot = await getDocs(restaurantsRef);

                      // Map the Firestore data to our Shop interface
                      const restaurantsData = querySnapshot.docs.map(doc => {
                        const data = doc.data();
                        return {
                          id: doc.id,
                          ...data
                        };
                      });

                      // Format the restaurant data
                      const formattedRestaurants = restaurantsData.map(restaurant => {
                        const restaurantData = restaurant as any;

                        // Get the name
                        let name = 'Unnamed Restaurant';
                        if (restaurantData.name) {
                          name = restaurantData.name;
                        } else if (restaurantData.restaurant_name) {
                          name = restaurantData.restaurant_name;
                        }

                        // Get the address
                        let address = 'No address provided';
                        if (typeof restaurantData.address === 'string') {
                          address = restaurantData.address;
                        } else if (restaurantData.address && typeof restaurantData.address === 'object') {
                          const addr = restaurantData.address;
                          const addressParts = [];

                          if (addr.street) addressParts.push(addr.street);
                          if (addr.city) addressParts.push(addr.city);
                          if (addr.state) addressParts.push(addr.state);

                          if (addressParts.length > 0) {
                            address = addressParts.join(', ');
                          }
                        }

                        // Get the owner ID
                        let ownerId = '';
                        if (restaurantData.ownerId) {
                          ownerId = restaurantData.ownerId;
                        } else if (restaurantData.owner_id) {
                          ownerId = restaurantData.owner_id;
                        }

                        return {
                          id: restaurant.id,
                          name,
                          address,
                          ownerId
                        };
                      });

                      setShops(formattedRestaurants);

                      // If no restaurants found, set error message
                      if (formattedRestaurants.length === 0) {
                        setFetchError("No restaurants found. Please try again.");
                      }
                    } catch (error) {
                      console.error('Error loading restaurants:', error);
                      setFetchError('Failed to load restaurants. Please try again.');
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  Retry
                </Button>
              </div>
            ) : (
              <RadioGroup value={shopId} onValueChange={setShopId}>
                {filteredShops.length > 0 ? (
                  filteredShops.map(shop => (
                    <div key={shop.id} className="flex items-center space-x-2 p-2 border rounded-md">
                      <RadioGroupItem value={shop.id} id={`shop-${shop.id}`} />
                      <Label htmlFor={`shop-${shop.id}`} className="flex-1 cursor-pointer">
                        <div className="font-medium">{shop.name}</div>
                        <div className="text-sm text-gray-500">{shop.address}</div>
                      </Label>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    {shops.length === 0 ? (
                      <div>
                        <p>No restaurants available.</p>
                      </div>
                    ) : (
                      "No restaurants found matching your search"
                    )}
                  </div>
                )}
              </RadioGroup>
            )}

            {errors.shopId && <p className="text-sm text-red-500">{errors.shopId}</p>}
          </div>
        </>
      )}

      <div className="flex space-x-2">
        <Button variant="outline" className="w-full" onClick={onBack}>
          Back
        </Button>
        <Button className="w-full" onClick={handleComplete}>
          Complete
        </Button>
      </div>
    </CardContent>
  );
};

// Main SignUpFlow Component
const SignUpFlow: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  // State for all steps
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Basic Info
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');

  // Step 2: Role Selection
  const [role, setRole] = useState<UserRole>('cashier');

  // Step 3: Profile Details
  const [profilePicture, setProfilePicture] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [bio, setBio] = useState('');

  // Step 4: Shop Selection/Creation
  const [shopId, setShopId] = useState('');
  const [shopName, setShopName] = useState('');
  const [shopAddress, setShopAddress] = useState('');

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  // State for success message
  const [successMessage, setSuccessMessage] = useState('');

  const handleComplete = async () => {
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      // 1. Create user account
      await signUp(email, password, name, role);

      // Get the current user after signup
      const user = firebaseAuth.getCurrentUser();

      if (!user) {
        throw new Error('Failed to create user account');
      }

      // 2. Create user profile
      const userProfile: User = {
        id: user.uid,
        name,
        email,
        role,
        createdAt: new Date().toISOString(),
        phone,
        address,
        profileImage: profilePicture || undefined,
      };

      await firestoreDB.setDocument('users', user.uid, userProfile);

      // 3. Handle shop creation or association
      if (role === 'owner') {
        // Create a new shop/restaurant
        const shopData = {
          name: shopName,
          address: shopAddress,
          ownerId: user.uid,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Use the shopDB helper to create a new restaurant
        const shopId = `restaurant-${Date.now()}`;
        console.log("Creating new restaurant with ID:", shopId);
        await shopDB.setShop(shopId, shopData);

        // Also associate the owner with their shop
        await firestoreDB.setDocument('shopMembers', `${shopId}_${user.uid}`, {
          shopId,
          userId: user.uid,
          role,
          joinedAt: new Date().toISOString(),
          isOwner: true
        });

        console.log("Restaurant created and owner associated successfully");
      } else {
        // Associate user with existing shop
        console.log("Associating user with existing restaurant:", shopId);
        await firestoreDB.setDocument('shopMembers', `${shopId}_${user.uid}`, {
          shopId,
          userId: user.uid,
          role,
          joinedAt: new Date().toISOString(),
          isOwner: false
        });
        console.log("User associated with restaurant successfully");
      }

      // Show success message
      setSuccessMessage('Account created successfully! Redirecting...');

      // Wait a moment to show the success message before redirecting
      setTimeout(() => {
        // 4. Redirect based on role
        if (role === 'cashier') {
          navigate('/orders');
        } else {
          navigate('/dashboard');
        }
      }, 2000);

    } catch (error: any) {
      logError(error, 'Sign-up flow');
      setError(getFirebaseErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  // Calculate progress percentage
  const progressPercentage = (currentStep / 4) * 100;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Your Account</CardTitle>
          <CardDescription>
            Step {currentStep} of 4: {
              currentStep === 1 ? 'Basic Information' :
              currentStep === 2 ? 'Select Your Role' :
              currentStep === 3 ? 'Profile Details' :
              'Shop Setup'
            }
          </CardDescription>
          <Progress value={progressPercentage} className="h-2" />
        </CardHeader>

        {error && (
          <div className="mx-6 mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mx-6 mb-4 p-2 bg-green-100 border border-green-400 text-green-700 rounded">
            {successMessage}
          </div>
        )}

        {currentStep === 1 && (
          <Step1
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            name={name}
            setName={setName}
            onNext={handleNext}
          />
        )}

        {currentStep === 2 && (
          <Step2
            role={role}
            setRole={setRole}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {currentStep === 3 && (
          <Step3
            profilePicture={profilePicture}
            setProfilePicture={setProfilePicture}
            phone={phone}
            setPhone={setPhone}
            address={address}
            setAddress={setAddress}
            bio={bio}
            setBio={setBio}
            onNext={handleNext}
            onBack={handleBack}
            name={name}
          />
        )}

        {currentStep === 4 && (
          <Step4
            role={role}
            shopId={shopId}
            setShopId={setShopId}
            shopName={shopName}
            setShopName={setShopName}
            shopAddress={shopAddress}
            setShopAddress={setShopAddress}
            onComplete={handleComplete}
            onBack={handleBack}
          />
        )}

        <CardFooter className="flex justify-between text-sm text-gray-500">
          {loading ? 'Processing...' : 'Your information is secure and encrypted'}
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUpFlow;

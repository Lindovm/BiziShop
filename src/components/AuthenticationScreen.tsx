import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useAuth } from "../contexts/AuthContext";
import SignUpFlow from "./SignUpFlow";
import { getFirebaseErrorMessage, logError } from "../lib/error-handler";

const AuthenticationScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showSignUpFlow, setShowSignUpFlow] = useState(false);
  const navigate = useNavigate();
  const { signIn, isLoading: loading } = useAuth();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      await signIn(email, password);

      // Manually navigate to dashboard after successful sign-in
      // This helps in case the automatic navigation isn't working
      navigate("/dashboard");
    } catch (error: any) {
      logError(error, "Authentication - Sign In");
      setError(getFirebaseErrorMessage(error));
    }
  };

  const handleStartSignUp = () => {
    setShowSignUpFlow(true);
  };

  if (showSignUpFlow) {
    return <SignUpFlow />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xl mr-2">
              b
            </div>
            <span className="text-2xl flex items-center">
              <span className="font-light">.izi</span>
              <span className="font-bold">Shop</span>
            </span>
          </div>
          <CardTitle className="text-2xl text-center">
            Welcome to .iziShop
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin" className="space-y-4">
              {error && (
                <div className="p-3 bg-red-100 border border-red-200 text-red-600 rounded-md text-sm">
                  {error}
                </div>
              )}
              <form onSubmit={handleSignIn}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="signup" className="space-y-4">
              <div className="space-y-4">
                <div className="p-4 bg-orange-50 border border-orange-100 rounded-md">
                  <h3 className="font-medium text-orange-800 mb-2">Complete Sign-Up Process</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Create a new account to get started with BiziShop. You'll be able to:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                    <li>Set up your profile with all your details</li>
                    <li>Choose your role (owner, manager, or cashier)</li>
                    <li>Create or join a shop</li>
                    <li>Access features based on your role</li>
                  </ul>
                </div>
                <Button
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  onClick={handleStartSignUp}
                >
                  Get Started
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

      </Card>
    </div>
  );
};

export default AuthenticationScreen;

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
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { supabase } from "../lib/supabase";

const AuthenticationScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [selectedRole, setSelectedRole] = useState("cashier");
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Redirect based on role
      const role = data.user?.user_metadata?.role || "cashier";
      if (role === "cashier") {
        navigate("/orders");
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      setError(error.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: "cashier", // Default role for new sign-ups
          },
        },
      });

      if (error) throw error;

      // Show success message or redirect
      alert(
        "Account created successfully! Please check your email for verification.",
      );
      navigate("/orders"); // Redirect cashiers to orders page
    } catch (error: any) {
      setError(error.message || "An error occurred during sign up");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setShowRoleSelection(true);
  };

  const handleRoleSelection = async () => {
    try {
      // For demo purposes, we'll use a mock login with the selected role
      // Clear any previous role first
      localStorage.removeItem("userRole");

      // Store the new role in localStorage for persistence
      localStorage.setItem("userRole", selectedRole);

      // Redirect based on role
      if (selectedRole === "cashier") {
        navigate("/orders"); // Cashiers go to orders page
      } else {
        navigate("/dashboard"); // Managers and owners go to dashboard
      }
    } catch (error: any) {
      console.error("Demo login error:", error);
      // For demo, we'll just redirect anyway
      localStorage.setItem("userRole", selectedRole);

      if (selectedRole === "cashier") {
        navigate("/orders");
      } else {
        navigate("/dashboard");
      }
    }
  };

  if (showRoleSelection) {
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
              Select Demo Role
            </CardTitle>
            <CardDescription className="text-center">
              Choose a role to try out the demo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup
              value={selectedRole}
              onValueChange={setSelectedRole}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="cashier" id="cashier" />
                <Label htmlFor="cashier" className="flex-1 cursor-pointer">
                  <div className="font-medium">Cashier</div>
                  <div className="text-sm text-gray-500">
                    Process orders and manage menu
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="manager" id="manager" />
                <Label htmlFor="manager" className="flex-1 cursor-pointer">
                  <div className="font-medium">Shop Manager</div>
                  <div className="text-sm text-gray-500">
                    Manage inventory and daily reviews
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="owner" id="owner" />
                <Label htmlFor="owner" className="flex-1 cursor-pointer">
                  <div className="font-medium">Shop Owner</div>
                  <div className="text-sm text-gray-500">
                    Full access to all features
                  </div>
                </Label>
              </div>
            </RadioGroup>
            <Button
              onClick={handleRoleSelection}
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              Continue as{" "}
              {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowRoleSelection(false)}
              className="w-full"
            >
              Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
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
              {error && (
                <div className="p-3 bg-red-100 border border-red-200 text-red-600 rounded-md text-sm">
                  {error}
                </div>
              )}
              <form onSubmit={handleSignUp}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
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
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or</span>
            </div>
          </div>
          <Button
            onClick={handleDemoLogin}
            variant="outline"
            className="w-full border-orange-500 text-orange-500 hover:bg-orange-50"
          >
            Try Demo
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthenticationScreen;

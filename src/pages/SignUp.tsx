
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlassmorphicCard from "@/components/ui-custom/GlassmorphicCard";
import { cn } from "@/lib/utils";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    agreedToTerms?: string;
  }>({});
  
  const { signup } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const validateForm = () => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      agreedToTerms?: string;
    } = {};
    
    if (!name) {
      newErrors.name = "Name is required";
    }
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }
    
    if (!agreedToTerms) {
      newErrors.agreedToTerms = "You must agree to the terms";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      await signup(email, password, name);
      toast({
        title: "Account created!",
        description: "Welcome to EcoTracker. Your journey towards sustainability starts now.",
      });
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Sign up failed",
        description: error.message || "There was an error creating your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-16">
        <div className="container max-w-lg px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <GlassmorphicCard className="w-full">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold">Create an Account</h1>
                <p className="text-muted-foreground mt-2">
                  Join the community and start tracking your environmental impact
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className={cn(
                      "input-transition",
                      errors.name && "border-destructive"
                    )}
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive">{errors.name}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className={cn(
                      "input-transition",
                      errors.email && "border-destructive"
                    )}
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive">{errors.email}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={cn(
                      "input-transition",
                      errors.password && "border-destructive"
                    )}
                  />
                  {errors.password && (
                    <p className="text-xs text-destructive">{errors.password}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm Password
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={cn(
                      "input-transition",
                      errors.confirmPassword && "border-destructive"
                    )}
                  />
                  {errors.confirmPassword && (
                    <p className="text-xs text-destructive">{errors.confirmPassword}</p>
                  )}
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => 
                      setAgreedToTerms(checked as boolean)
                    }
                    className={errors.agreedToTerms ? "border-destructive" : ""}
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the{" "}
                      <Link to="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link to="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </label>
                    {errors.agreedToTerms && (
                      <p className="text-xs text-destructive">
                        {errors.agreedToTerms}
                      </p>
                    )}
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full shine-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating account..." : "Create Account"}
                </Button>
                
                <div className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary hover:underline">
                    Log in
                  </Link>
                </div>
              </form>
            </GlassmorphicCard>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SignUp;

import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react"; 
const SignupPage = () => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        
        // Validation check
        if (!formData.name || !formData.email || !formData.password) {
            toast.error("Please fill all fields");
            return;
        }

        setLoading(true);
        console.log("Submitting to backend:", formData);

        try {
            const res = await axios.post("http://127.0.0.1:5000/api/signup", formData);
            
            console.log("Success Response:", res.data);
            toast.success("Account created successfully!");
            navigate("/login");
        } catch (err) {
            console.error("Axios Error Details:", err.response || err);
            const errorMsg = err.response?.data?.error || "Connection failed to server";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
                    <CardDescription>Enter your details to register</CardDescription>
                </CardHeader>
                <form onSubmit={handleSignup}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Input 
                                placeholder="Full Name" 
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Input 
                                type="email" 
                                placeholder="Email Address" 
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Input 
                                type="password" 
                                placeholder="Password" 
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                                required
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button 
                            type="submit" 
                            className="w-full" 
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign Up"}
                        </Button>
                        <div className="text-sm text-center text-muted-foreground">
                            Already have an account?{" "}
                            <Link to="/login" className="text-primary hover:underline font-medium">
                                Login here
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default SignupPage;
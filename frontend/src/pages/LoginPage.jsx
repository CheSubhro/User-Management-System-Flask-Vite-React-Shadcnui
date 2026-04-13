import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { LogIn, Mail, Lock, Loader2 } from "lucide-react";

const LOGIN_URL = "http://127.0.0.1:5000/api/login";

const LoginPage = () => {

    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({ email: "", password: "" });

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await axios.post(LOGIN_URL, loginData);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            toast.success(`Welcome back, ${res.data.user.name}!`);
            navigate("/dashboard"); 
        } catch (err) {
            toast.error(err.response?.data?.error || "Login failed!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <Card className="w-full max-w-md shadow-2xl">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
                        <CardDescription>Enter your credentials to continue</CardDescription>
                    </CardHeader>
                    <form onSubmit={handleLogin}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input 
                                    type="email" 
                                    value={loginData.email}
                                    onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                                    required 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Password</Label>
                                <Input 
                                    type="password" 
                                    value={loginData.password}
                                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                                    required 
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? <Loader2 className="animate-spin" /> : "Login"}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </>
    )
}

export default LoginPage
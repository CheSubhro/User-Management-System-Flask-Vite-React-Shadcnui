import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle,CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Trash2, Edit3, XCircle, LogOut, User  } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox"; 
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast, Toaster } from "sonner";
import { Skeleton } from "@/components/ui/skeleton"; // skeleton import
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

// Validation Imports
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const API_URL = "http://127.0.0.1:5000/api/items";

//  Zod Schema Definition
const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().optional().refine((val) => !val || val.length >= 6, "Min 6 chars"),
    phone: z.string().regex(/^[0-9+]{10,14}$/, "Invalid phone (10-14 digits)"),
    age: z.coerce.number().min(18, "Must be 18+").max(100, "Too old"),
    gender: z.enum(["male", "female"]),
    skills: z.array(z.string()).min(1, "Select at least one skill"),
    userRole: z.string().min(1, "Role is required"),
    country: z.string().min(1),
    isPublic: z.boolean().default(true),
	dob: z.string().min(1, "Date of birth is required"),
    address: z.string().optional(),
    bio: z.string().optional(),
    isTermsAccepted: z.literal(true, {
        errorMap: () => ({ message: "You must accept terms" }),
    }),
});


const Dashboard = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [emailAvailability, setEmailAvailability] = useState({ loading: false, exists: false });
    
    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem("user") || "{}");

	const userName = userData.name || "User"; 
	const userEmail = userData.email || "user@example.com";
	const isAdmin = userData.role === "Admin";
	const isEditor = userData.role === "Editor";

	//  React Hook Form Setup
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            gender: "male",
            skills: [],
            country: "India",
            isPublic: true,
            userRole: "Viewer",
            isTermsAccepted: false,
        },
    });

	const watchSkills = watch("skills");
    const watchIsPublic = watch("isPublic");
    const watchGender = watch("gender");

	//  Real-time Email Check Logic
    const checkEmail = async (email) => {
        if (!email || !email.includes("@") || isEdit) return;
        setEmailAvailability({ loading: true, exists: false });
        try {
            const res = await axios.get(`${API_URL}/check-email?email=${email}`);
            setEmailAvailability({ loading: false, exists: res.data.exists });
        } catch (err) {
            setEmailAvailability({ loading: false, exists: false });
        }
    };

	const fetchItems = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(API_URL);
            setItems(res.data);
        } catch (err) {
            toast.error("Failed to fetch users");
        } finally {
            setIsLoading(false);
        }
    };

	useEffect(() => { fetchItems(); }, []);

	// 4. Form Submit Handler
    const onSubmit = async (data) => {
        if (emailAvailability.exists && !isEdit) {
            toast.error("Email already exists!");
            return;
        }

        try {
            if (isEdit) {
                await axios.put(`${API_URL}/${currentId}`, data);
                toast.success("User updated successfully!");
            } else {
                await axios.post(API_URL, data);
                toast.success("User created successfully!");
            }
            resetForm();
            fetchItems();
        } catch (err) {
            toast.error("Submission failed");
        }
    };

	const startEdit = (item) => {
        setIsEdit(true);
        setCurrentId(item._id);
        reset({ ...item, password: "" }); // Fill form with existing data
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

	const resetForm = () => {
        reset({
            name: "", email: "", password: "", phone: "", age: "", 
            gender: "male", skills: [], country: "India", isPublic: true,
            userRole: "Viewer", isTermsAccepted: false
        });
        setIsEdit(false);
        setCurrentId(null);
        setEmailAvailability({ loading: false, exists: false });
    };

	const deleteItem = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            toast.success("Deleted!");
            fetchItems();
        } catch (err) { toast.error("Failed"); }
    };
	

	// Name to initials function (e.g., "Demo" -> "DM")
	const getInitials = (name) => {
		return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
	};


	// Logout Setup
	const handleLogout = () => {
        // LocalStorage clear 
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Success message 
        toast.info("Logged out successfully");

        // 3. Login page redirect
        navigate("/login");
    };

    return (
        <>
            <div className="min-h-screen bg-slate-50/50 p-4 md:p-10">
				<div className="max-w-5xl mx-auto space-y-8">
				
				<nav className="flex justify-between items-center p-4 bg-white shadow-sm border-b px-8">
					<div className="flex items-center gap-3">
						<h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
							Member Admin
						</h1>
					</div>

					<div className="flex items-center gap-6">
						{/* User Info Section */}
						<div className="flex items-center gap-3 border-r pr-6">
							<div className="text-right hidden sm:block">
								<p className="text-sm font-semibold text-slate-900 leading-none">{userName}</p>
								<p className="text-xs text-slate-500 mt-1">{userEmail}</p>
							</div>
							
							{/* Shadcn Avatar */}
							<Avatar className="h-9 w-9 border-2 border-indigo-100">
								<AvatarFallback className="bg-indigo-600 text-white font-medium">
									{getInitials(userName)}
								</AvatarFallback>
							</Avatar>
							<Badge variant="secondary" className="ml-2 text-[10px] uppercase tracking-wider">
								{userData.role}
							</Badge>
						</div>

						{/* Logout Button */}
						<Button 
							variant="ghost" 
							size="sm" 
							onClick={handleLogout}
							className="text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
						>
							<LogOut className="w-4 h-4 mr-2" />
							Logout
						</Button>
					</div>
				</nav>

				<Toaster richColors position="top-right" /> {/* Toast Container */}

				{/* Modern Form Card */}
				<Card className="max-w-5xl mx-auto shadow-lg border-t-4 border-t-primary">
					<CardHeader>
						<CardTitle>{isEdit ? "Update Member" : "Add New Member"}</CardTitle>
					</CardHeader>
					<CardContent>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
						{/* Main Form Grid */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							
							{/* Row 1: Name, Email, Password */}
							<div className="space-y-2">
								<Label className="text-sm font-semibold">Full Name</Label>
								<Input {...register("name")} placeholder="Enter name" />
								{errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
							</div>

							<div className="space-y-2">
								<Label className="text-sm font-semibold">Email</Label>
								<Input type="email" {...register("email")} placeholder="email@example.com" />
								{errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
							</div>

							<div className="space-y-2">
								<Label className="text-sm font-semibold">Password</Label>
								<Input type="password" {...register("password")} placeholder="••••••••" />
								{errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
							</div>

							{/* Row 2: Phone, Age, DOB */}
							<div className="space-y-2">
								<Label className="text-sm font-semibold">Phone</Label>
								<Input type="tel" {...register("phone")} placeholder="+91..." />
								{errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
							</div>

							<div className="space-y-2">
								<Label className="text-sm font-semibold">Age</Label>
								<Input type="number" {...register("age")} placeholder="25" />
								{errors.age && <p className="text-red-500 text-xs mt-1">{errors.age.message}</p>}
							</div>

							<div className="space-y-2">
								<Label className="text-sm font-semibold">Date of Birth</Label>
								<Input type="date" {...register("dob")} />
								{errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob.message}</p>}
							</div>

							{/* Row 3: Gender, Country, Visibility */}
							<div className="space-y-3">
								<Label className="text-sm font-semibold">Gender</Label>
								<RadioGroup
									value={watchGender}
									onValueChange={(val) => setValue("gender", val)}
									className="flex gap-4 pt-1"
								>
									<div className="flex items-center space-x-2">
										<RadioGroupItem value="male" id="male" />
										<Label htmlFor="male" className="font-normal cursor-pointer">Male</Label>
									</div>
									<div className="flex items-center space-x-2">
										<RadioGroupItem value="female" id="female" />
										<Label htmlFor="female" className="font-normal cursor-pointer">Female</Label>
									</div>
								</RadioGroup>
							</div>

							<div className="space-y-2">
								<Label className="text-sm font-semibold">Country</Label>
								<Select value={watch("country")} onValueChange={(val) => setValue("country", val)}>
									<SelectTrigger className="w-full bg-white">
										<SelectValue placeholder="Select Country" />
									</SelectTrigger>
									<SelectContent className="bg-white border shadow-xl">
										<SelectItem value="India">India</SelectItem>
										<SelectItem value="Bangladesh">Bangladesh</SelectItem>
										<SelectItem value="USA">USA</SelectItem>
										<SelectItem value="UK">UK</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div
								className={`flex items-center justify-between space-x-4 border px-4 py-2.5 rounded-md cursor-pointer transition-all ${watchIsPublic ? 'bg-green-50 border-green-200' : 'bg-slate-100 border-slate-300'}`}
								onClick={() => setValue("isPublic", !watchIsPublic)}
							>
								<div className="space-y-0.5 pointer-events-none">
									<Label className="text-sm font-semibold">Profile Visibility</Label>
									<div className="flex items-center gap-1.5">
										<span className={`h-2 w-2 rounded-full ${watchIsPublic ? 'bg-green-500' : 'bg-slate-400'}`}></span>
										<span className={`text-[10px] font-bold uppercase ${watchIsPublic ? 'text-green-600' : 'text-slate-500'}`}>
											{watchIsPublic ? "Public" : "Private"}
										</span>
									</div>
								</div>
								<Switch
									checked={watchIsPublic}
									onCheckedChange={(checked) => setValue("isPublic", checked)}
									className="data-[state=checked]:bg-green-500"
									onClick={(e) => e.stopPropagation()}
								/>
							</div>

							{/* Full Width Sections: Skills, Address, Role, GitHub, Bio */}
							
							<div className="md:col-span-2 lg:col-span-3 space-y-3">
								<Label className="text-sm font-semibold">Professional Skills</Label>
								<div className="flex flex-wrap gap-6 p-4 border rounded-md bg-white shadow-sm">
									{["React", "Python", "Node.js", "MongoDB", "UI Design"].map((skill) => (
										<div key={skill} className="flex items-center space-x-2">
											<Checkbox
												id={skill}
												checked={(watchSkills || []).includes(skill)}
												onCheckedChange={(checked) => {
													const next = checked 
														? [...watchSkills, skill] 
														: watchSkills.filter(s => s !== skill);
													setValue("skills", next);
												}}
											/>
											<label htmlFor={skill} className="text-sm font-medium cursor-pointer">{skill}</label>
										</div>
									))}
								</div>
								{errors.skills && <p className="text-red-500 text-xs mt-1">{errors.skills.message}</p>}
							</div>

							<div className="md:col-span-2 lg:col-span-3 space-y-2">
								<Label className="text-sm font-semibold">Full Address</Label>
								<Input {...register("address")} placeholder="123 Street, City, Country" />
							</div>

							<div className="lg:col-span-1 space-y-2">
								<Label className="text-sm font-semibold">User Role</Label>
								<Select value={watch("userRole")} onValueChange={(val) => setValue("userRole", val)}>
									<SelectTrigger className="w-full bg-white">
										<SelectValue placeholder="Select Role" />
									</SelectTrigger>
									<SelectContent className="bg-white border shadow-xl">
										<SelectItem value="Admin">Admin</SelectItem>
										<SelectItem value="Editor">Editor</SelectItem>
										<SelectItem value="Viewer">Viewer</SelectItem>
									</SelectContent>
								</Select>
							</div>

							<div className="md:col-span-2 lg:col-span-2 space-y-2">
								<Label className="text-sm font-semibold">GitHub Profile URL</Label>
								<Input type="url" {...register("githubUrl")} placeholder="https://github.com/username" />
							</div>

							<div className="md:col-span-2 lg:col-span-3 space-y-2">
								<Label className="text-sm font-semibold">Short Bio</Label>
								<Textarea {...register("bio")} placeholder="Tell us a little bit about yourself..." className="resize-none" />
							</div>

							{/* Terms and Conditions */}
							<div className="md:col-span-2 lg:col-span-3 flex items-start space-x-3 p-4 border rounded-md bg-slate-50">
								<Checkbox
									id="terms"
									checked={watch("isTermsAccepted")}
									onCheckedChange={(checked) => setValue("isTermsAccepted", checked)}
								/>
								<div className="grid gap-1.5 leading-none">
									<label htmlFor="terms" className="text-sm font-medium cursor-pointer">Accept terms and conditions</label>
									<p className="text-xs text-muted-foreground">You agree to our Terms of Service and Privacy Policy.</p>
									{errors.isTermsAccepted && <p className="text-red-500 text-xs mt-1">{errors.isTermsAccepted.message}</p>}
								</div>
							</div>
						</div>

						{/* Footer Actions */}
						<div className="flex justify-end gap-3 border-t pt-6">
							{isEdit && (
								<Button type="button" variant="ghost" onClick={resetForm} className="hover:bg-red-50 hover:text-red-600">
									Cancel Edit
								</Button>
							)}
							<Button type="submit">
								{isEdit ? "Update Changes" : "Create Account"}
							</Button>
						</div>
					</form>
					</CardContent>
            	</Card>	

				{/* Table Section */}
				<div className="rounded-xl border bg-white shadow-lg overflow-hidden border-slate-200">
					<Table>
					<TableHeader className="bg-slate-50">
						<TableRow>
						<TableHead className="font-bold py-4">User Info</TableHead>
						<TableHead className="font-bold py-4 text-center">Identity</TableHead>
						<TableHead className="font-bold py-4">Skills & Access</TableHead>
						<TableHead className="text-right font-bold py-4 pr-6">Management</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading ? (
							/* --- 1. SKELETON LOADING STATE --- */
							[1, 2, 3, 4].map((n) => (
							<TableRow key={n}>
								<TableCell><Skeleton className="h-16 w-full rounded-md" /></TableCell>
								<TableCell><Skeleton className="h-16 w-full rounded-md" /></TableCell>
								<TableCell><Skeleton className="h-16 w-full rounded-md" /></TableCell>
								<TableCell><Skeleton className="h-16 w-full rounded-md" /></TableCell>
								<TableCell className="text-right"><Skeleton className="h-10 w-24 ml-auto rounded-md" /></TableCell>
							</TableRow>
							))
						) : items.length > 0 ? (
							items.map((item) => (
							<TableRow key={item._id} className="hover:bg-slate-50/50 transition-colors">
								<TableCell className="py-4">
								<div className="font-bold text-slate-800">{item.name}</div>
								<div className="text-xs text-muted-foreground">{item.email}</div>
								<div className="text-[10px] text-slate-400 mt-1 italic">{item.address || "No address"}</div>
								</TableCell>
								
								<TableCell className="text-center">
								<div className="capitalize text-sm font-medium">{item.gender}</div>
								<div className="text-xs text-muted-foreground">{item.dob || "N/A"}</div>
								<div className="text-[10px] font-semibold text-blue-600 mt-1 uppercase tracking-wider">{item.country}</div>
								</TableCell>
								
								<TableCell>
								<div className="flex flex-wrap gap-1.5 max-w-[200px]">
									{item.skills?.map(s => (
									<span key={s} className="px-2 py-0.5 bg-primary/10 text-primary rounded text-[10px] font-bold border border-primary/20">{s}</span>
									))}
								</div>
								<div className={`mt-2 text-[10px] font-bold ${item.isPublic ? 'text-green-600' : 'text-amber-600'}`}>
									{item.isPublic ? "● PUBLIC" : "● PRIVATE"}
								</div>
								</TableCell>
								
								<TableCell className="text-center">
								<div className="text-[10px] font-bold mt-1 inline-block px-2 py-0.5 bg-slate-100 rounded text-slate-600 border">
									{item.userRole || "Viewer"}
								</div>
								</TableCell>

								<TableCell className="text-right space-x-2 pr-6">
								{/* --- 2. EDIT DIALOG --- */}
								
								{/* If Admin then show Edit button */}
								{(isAdmin || isEditor) && (
									<Button variant="outline" size="sm" onClick={() => startEdit(item)} 
									className={`h-8 ${isEdit && currentId === item._id ? 'border-primary bg-primary/5' : ''}`}>
									<Edit3 className="w-4 h-4 mr-1" /> Edit
									</Button>
								)}

								{/* If Admin then show Delete button */}
								{isAdmin && (
									<Button variant="ghost" size="sm" className="h-8 text-red-600 hover:bg-red-50"
									onClick={() => setDeleteTarget(item)}>
									<Trash2 className="w-4 h-4" />
									</Button>
								)}

								{/* Viewer For only "View" button */}
								{(!isAdmin && !isEditor) && (
									<span className="text-xs text-muted-foreground italic">Read Only</span>
								)}

								</TableCell>
							</TableRow>
							))
						) : (
							/* --- 4. EMPTY STATE --- */
							<TableRow>
							<TableCell colSpan={5} className="h-32 text-center text-muted-foreground font-medium">
								<div className="flex flex-col items-center gap-2">
								<XCircle className="w-8 h-8 text-slate-300" />
								No registered users found in database.
								</div>
							</TableCell>
							</TableRow>
						)}
					</TableBody>
					</Table>
				</div>

				{/* Custom Modal */}
                {deleteTarget && (
                    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                        <div 
                            className="absolute inset-0 bg-slate-900/60" 
                            onClick={() => setDeleteTarget(null)} 
                        />

                        {/* Modal Box: Tailwind card logic */}
                        <div className="relative bg-white rounded-lg shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200 border border-slate-200">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-red-600">
                                    <div className="p-2 bg-red-50 rounded-full">
                                        <Trash2 className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold italic">Confirm Delete</h3>
                                </div>

                                <p className="text-slate-600 leading-relaxed">
                                    Are you sure you want to delete <b>{deleteTarget.name}</b>? 
                                    This action is permanent and cannot be undone.
                                </p>

                                <div className="flex gap-3 justify-end mt-6">
                                    <Button 
                                        variant="outline" 
                                        className="flex-1 border-slate-200 hover:bg-slate-50"
                                        onClick={() => setDeleteTarget(null)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        variant="destructive" 
                                        className="flex-1 bg-red-600 hover:bg-red-700 font-bold"
                                        onClick={() => {
                                            deleteItem(deleteTarget._id);
                                            setDeleteTarget(null);
                                        }}
                                    >
                                        Yes, Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

				</div>
			</div>
        </>
    )
}

export default Dashboard
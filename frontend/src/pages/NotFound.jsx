
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-center p-4">
            <h1 className="text-9xl font-extrabold text-slate-200">404</h1>
            <h2 className="text-2xl font-bold text-slate-800 mt-4">Oops! Page not found</h2>
            <p className="text-slate-500 mt-2 mb-6">
                The page you are looking for doesn't exist or has been moved.
            </p>
            <Button asChild>
                <Link to="/">Go Back Home</Link>
            </Button>
        </div>
    );
};

export default NotFound;
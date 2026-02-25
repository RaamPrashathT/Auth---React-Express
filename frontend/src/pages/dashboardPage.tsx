import { Navbar } from "@/components/navbar/navbar";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/axios";
import { useState } from "react";

// Simple explanation: Define what a User looks like so TypeScript doesn't complain
interface User {
    id: string;
    email: string;
    name?: string; // Optional field
}

export default function DashboardPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get(
                "http://localhost:5000/users/allUsers",
                { withCredentials: true }
            );
            setUsers(response.data);
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <main className="max-w-6xl mx-auto p-8">
                {/* Header Section */}
                <div className="flex justify-between items-center mb-8 border-b pb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                        <p className="text-gray-500">View and manage all registered users.</p>
                    </div>
                    <Button 
                        onClick={handleClick} 
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        {loading ? "Loading..." : "Refresh User List"}
                    </Button>
                </div>

                {/* Users Display Section */}
                {users.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {users.map((user) => (
                            <div 
                                key={user.id} 
                                className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                        {user.email.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{user.name || "Anonymous"}</p>
                                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <span className="text-xs font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-full">
                                        ID: {user.id.slice(0, 8)}...
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-400">No users found. Click the button above to load data.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
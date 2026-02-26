import { Navbar } from "@/components/navbar/navbar";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/axios";
import { useState } from "react";

interface User {
    id: string;
    email: string;
    name?: string; 
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
        <div className="min-h-screen bg-white">
            <Navbar />
            
            <main className="max-w-5xl mx-auto p-6">
                <div className="flex justify-between items-center mb-6 pb-4">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">User Management</h1>
                    </div>
                    <Button 
                        onClick={handleClick} 
                        disabled={loading}
                        className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 shadow-none"
                    >
                        {loading ? "Loading..." : "Refresh User List"}
                    </Button>
                </div>

                {users.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {users.map((user) => (
                            <div 
                                key={user.id} 
                                className="bg-white p-4 rounded-md border border-gray-200"
                            >
                                <div className="flex items-center space-x-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{user.name || "Anonymous"}</p>
                                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-sm text-gray-400">No users found. Click refresh to load data.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
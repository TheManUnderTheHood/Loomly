import { Navigate } from 'react-router-dom';

const AdminDashboard = () => {
    return (
        <div className="min-h-screen bg-black text-white pt-40 pb-20 px-4">
            <div className="container mx-auto">
                <h1 className="text-5xl font-primary tracking-widest text-center uppercase mb-12">Admin Dashboard</h1>
                <div className="bg-gray-900/50 p-8 rounded-lg border border-gray-800 text-center">
                    <p className="text-gray-400 text-xl mb-4">Welcome to the Admin Command Center.</p>
                    <p className="text-gray-500">More management features (Products, Orders, Users) coming soon.</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

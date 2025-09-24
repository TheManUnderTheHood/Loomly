import { useState } from 'react';
import AccountDetails from '../components/profile/AccountDetails';
import AddressManager from '../components/profile/AddressManager';
import ChangePassword from '../components/profile/ChangePassword';

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState('details');

    const renderContent = () => {
        switch (activeTab) {
            case 'addresses': return <AddressManager />;
            case 'password': return <ChangePassword />;
            case 'details':
            default:
                return <AccountDetails />;
        }
    };
    
    const getTabClass = (tabName) => `py-2 px-4 cursor-pointer text-sm font-bold rounded-md transition-colors ${activeTab === tabName ? 'bg-brand-accent text-white' : 'text-gray-400 hover:bg-gray-800'}`;

    return (
        <div className="min-h-screen bg-black text-white pt-40 pb-20 px-4">
            <div className="container mx-auto max-w-4xl">
                <h1 className="text-5xl font-primary tracking-widest text-center uppercase mb-12">My Profile</h1>
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden">
                    <div className="flex p-2 md:p-4 border-b border-gray-800 space-x-1 md:space-x-2 bg-gray-900">
                        <button onClick={() => setActiveTab('details')} className={getTabClass('details')}>Account Details</button>
                        <button onClick={() => setActiveTab('addresses')} className={getTabClass('addresses')}>My Addresses</button>
                        <button onClick={() => setActiveTab('password')} className={getTabClass('password')}>Change Password</button>
                    </div>
                    <div>
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
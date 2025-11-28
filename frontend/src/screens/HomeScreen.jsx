import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import useAuthStore from '../store/useAuthStore';
import useChatStore from '../store/useChatStore';
import VaporwaveBackground from '../components/VaporwaveBackground';

const HomeScreen = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const { setInQueue } = useChatStore();

    const startChat = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/queue/enqueue', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setInQueue(true);
            toast.success('Searching for a match...');
            navigate('/matchmaking');
        } catch (error) {
            console.error('Queue error:', error);
            toast.error('Failed to join queue');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <VaporwaveBackground />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-dark p-8 rounded-2xl max-w-2xl w-full border border-neon-purple/50 z-10"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-neon-pink">Welcome, {user?.username}!</h2>
                        <p className="text-gray-400 mt-1">Ready to meet someone new?</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 glass rounded-lg hover:bg-red-500/20 transition-colors"
                    >
                        Logout
                    </button>
                </div>

                {/* Profile Info */}
                <div className="glass p-6 rounded-xl mb-6">
                    <h3 className="text-xl font-bold text-white mb-4">Your Profile</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-400 text-sm">Gender</p>
                            <p className="text-white font-medium">{user?.gender}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">Looking For</p>
                            <p className="text-white font-medium">{user?.preference}</p>
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">NSFW Mode</p>
                            <p className={`font-medium ${user?.nsfwEnabled ? 'text-neon-pink' : 'text-neon-cyan'}`}>
                                {user?.nsfwEnabled ? 'ON' : 'OFF'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Start Chat Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={startChat}
                    className="w-full py-6 bg-neon-gradient rounded-xl text-white text-2xl font-bold shadow-neon-pink hover:shadow-neon-cyan transition-all"
                >
                    🚀 Start Chat
                </motion.button>

                {/* Info */}
                <div className="mt-6 text-center text-gray-400 text-sm">
                    <p>You'll be matched with someone based on your preferences</p>
                </div>
            </motion.div>
        </div>
    );
};

export default HomeScreen;

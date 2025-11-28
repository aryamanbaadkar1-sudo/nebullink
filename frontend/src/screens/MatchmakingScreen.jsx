import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import useChatStore from '../store/useChatStore';
import VaporwaveBackground from '../components/VaporwaveBackground';

const MatchmakingScreen = () => {
    const navigate = useNavigate();
    const { currentRoom, setInQueue } = useChatStore();

    useEffect(() => {
        // If match found, navigate to chat
        if (currentRoom) {
            navigate('/chat');
        }
    }, [currentRoom, navigate]);

    const cancelSearch = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/queue/cancel', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setInQueue(false);
            toast.success('Search cancelled');
            navigate('/home');
        } catch (error) {
            console.error('Cancel error:', error);
            toast.error('Failed to cancel search');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <VaporwaveBackground />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center z-10"
            >
                {/* Animated rings */}
                <div className="relative w-64 h-64 mx-auto mb-8">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }}
                        className="absolute inset-0 rounded-full border-4 border-neon-pink"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: 0.3
                        }}
                        className="absolute inset-0 rounded-full border-4 border-neon-cyan"
                    />
                    <motion.div
                        animate={{
                            scale: [1, 1.4, 1],
                            opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: 0.6
                        }}
                        className="absolute inset-0 rounded-full border-4 border-neon-purple"
                    />

                    {/* Center icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                            className="text-6xl"
                        >
                            🔍
                        </motion.div>
                    </div>
                </div>

                {/* Text */}
                <motion.h2
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-3xl font-bold text-neon-pink mb-4"
                >
                    Searching for a stranger...
                </motion.h2>

                <p className="text-gray-400 mb-8">
                    Finding someone who matches your preferences
                </p>

                {/* Cancel button */}
                <button
                    onClick={cancelSearch}
                    className="px-8 py-3 glass rounded-lg hover:bg-red-500/20 transition-colors"
                >
                    Cancel Search
                </button>
            </motion.div>
        </div>
    );
};

export default MatchmakingScreen;

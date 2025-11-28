import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import VaporwaveBackground from '../components/VaporwaveBackground';

const LandingScreen = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <VaporwaveBackground />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center z-10"
            >
                {/* Logo */}
                <motion.h1
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="text-7xl md:text-9xl font-bold mb-6 text-neon-glow"
                    style={{
                        background: 'linear-gradient(135deg, #ff1bcb 0%, #a855f7 50%, #00f5ff 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}
                >
                    NebulaLink
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-2xl md:text-3xl text-neon-cyan mb-4 font-light"
                >
                    The Neon Stranger Universe
                </motion.p>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="text-gray-400 mb-12 max-w-md mx-auto"
                >
                    Connect with strangers across the digital cosmos. Chat, share, and explore in a neon-lit universe.
                </motion.p>

                {/* Enter button */}
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/auth')}
                    className="btn-glow px-12 py-4 bg-neon-gradient rounded-full text-white text-xl font-bold shadow-neon-pink hover:shadow-neon-cyan transition-all"
                >
                    Enter Universe
                </motion.button>

                {/* Features */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                    className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
                >
                    <div className="glass p-6 rounded-xl">
                        <div className="text-neon-pink text-4xl mb-3">💬</div>
                        <h3 className="text-lg font-bold text-white mb-2">Real-Time Chat</h3>
                        <p className="text-gray-400 text-sm">Instant messaging with text, emojis, GIFs, and more</p>
                    </div>

                    <div className="glass p-6 rounded-xl">
                        <div className="text-neon-cyan text-4xl mb-3">📹</div>
                        <h3 className="text-lg font-bold text-white mb-2">Video Calls</h3>
                        <p className="text-gray-400 text-sm">Face-to-face conversations with WebRTC technology</p>
                    </div>

                    <div className="glass p-6 rounded-xl">
                        <div className="text-neon-purple text-4xl mb-3">🎯</div>
                        <h3 className="text-lg font-bold text-white mb-2">Smart Matching</h3>
                        <p className="text-gray-400 text-sm">Gender-based preferences and NSFW filtering</p>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default LandingScreen;

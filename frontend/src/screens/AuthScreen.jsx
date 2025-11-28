import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import useAuthStore from '../store/useAuthStore';
import VaporwaveBackground from '../components/VaporwaveBackground';

const AuthScreen = () => {
    const navigate = useNavigate();
    const { register, login } = useAuthStore();
    const [isLogin, setIsLogin] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        gender: 'Male',
        preference: 'Female',
        nsfwEnabled: false
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted', formData);

        if (!formData.username || !formData.password) {
            console.log('Validation failed');
            toast.error('Please fill in all fields');
            return;
        }

        console.log('Calling auth function...');
        const result = isLogin
            ? await login({ username: formData.username, password: formData.password })
            : await register(formData);

        console.log('Auth result:', result);

        if (result.success) {
            toast.success(isLogin ? 'Welcome back!' : 'Account created!');
            navigate('/home');
        } else {
            toast.error(result.error || 'Authentication failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <VaporwaveBackground />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-dark p-8 rounded-2xl max-w-md w-full border border-neon-purple/50 z-10"
            >
                <h2 className="text-3xl font-bold text-neon-pink mb-6 text-center">
                    {isLogin ? 'Welcome Back' : 'Join NebulaLink'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Username */}
                    <div>
                        <label className="block text-sm text-gray-300 mb-2">Username</label>
                        <input
                            type="text"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            className="w-full px-4 py-3 bg-neon-darker border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors"
                            placeholder="Enter username"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm text-gray-300 mb-2">Password</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-4 py-3 bg-neon-darker border border-neon-cyan/30 rounded-lg text-white focus:outline-none focus:border-neon-cyan transition-colors"
                            placeholder="Enter password"
                        />
                    </div>

                    {!isLogin && (
                        <>
                            {/* Gender */}
                            <div>
                                <label className="block text-sm text-gray-300 mb-2">Your Gender</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Male', 'Female', 'Other'].map((gender) => (
                                        <button
                                            key={gender}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, gender })}
                                            className={`py-2 rounded-lg transition-all ${formData.gender === gender
                                                    ? 'bg-neon-gradient shadow-neon-pink'
                                                    : 'glass hover:bg-neon-purple/20'
                                                }`}
                                        >
                                            {gender}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Preference */}
                            <div>
                                <label className="block text-sm text-gray-300 mb-2">Looking For</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Male', 'Female', 'All'].map((pref) => (
                                        <button
                                            key={pref}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, preference: pref })}
                                            className={`py-2 rounded-lg transition-all ${formData.preference === pref
                                                    ? 'bg-neon-gradient shadow-neon-cyan'
                                                    : 'glass hover:bg-neon-purple/20'
                                                }`}
                                        >
                                            {pref}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* NSFW Toggle */}
                            <div className="flex items-center justify-between glass p-4 rounded-lg">
                                <div>
                                    <p className="text-white font-medium">NSFW Mode</p>
                                    <p className="text-xs text-gray-400">Match with NSFW users only</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, nsfwEnabled: !formData.nsfwEnabled })}
                                    className={`w-14 h-8 rounded-full transition-all ${formData.nsfwEnabled ? 'bg-neon-pink' : 'bg-gray-600'
                                        }`}
                                >
                                    <div
                                        className={`w-6 h-6 bg-white rounded-full transition-transform ${formData.nsfwEnabled ? 'translate-x-7' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        </>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full py-3 bg-neon-gradient rounded-lg text-white font-bold hover:shadow-neon-pink transition-all"
                    >
                        {isLogin ? 'Login' : 'Create Account'}
                    </button>
                </form>

                {/* Toggle */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-neon-cyan hover:text-neon-pink transition-colors"
                    >
                        {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Login'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthScreen;

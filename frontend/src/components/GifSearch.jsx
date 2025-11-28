import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchGifs, getTrendingGifs, getGifCategories } from '../services/tenorService';

const GifSearch = ({ onGifSelect, onClose }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [gifs, setGifs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeCategory, setActiveCategory] = useState('Trending');
    const categories = getGifCategories();

    useEffect(() => {
        loadTrending();
    }, []);

    const loadTrending = async () => {
        setLoading(true);
        const results = await getTrendingGifs(30);
        setGifs(results);
        setLoading(false);
    };

    const handleSearch = async (query) => {
        if (!query.trim()) {
            loadTrending();
            return;
        }

        setLoading(true);
        const results = await searchGifs(query, 30);
        setGifs(results);
        setLoading(false);
    };

    const handleCategoryClick = async (category) => {
        setActiveCategory(category);
        if (category === 'Trending') {
            loadTrending();
        } else {
            setSearchQuery(category);
            handleSearch(category);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="glass-dark rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-hidden border border-neon-purple/50"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-neon-pink">Search GIFs</h2>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 bg-neon-pink rounded-full flex items-center justify-center text-white hover:bg-neon-purple transition-colors"
                    >
                        ×
                    </button>
                </div>

                {/* Search bar */}
                <div className="mb-4">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            handleSearch(e.target.value);
                        }}
                        placeholder="Search for GIFs..."
                        className="w-full px-4 py-3 bg-neon-darker border border-neon-cyan/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-cyan transition-colors"
                    />
                </div>

                {/* Categories */}
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => handleCategoryClick(category)}
                            className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${activeCategory === category
                                    ? 'bg-neon-gradient text-white shadow-neon-pink'
                                    : 'glass text-gray-300 hover:text-white'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* GIF Grid */}
                <div className="overflow-y-auto max-h-96">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-neon-pink border-t-transparent"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-3">
                            {gifs.map((gif) => (
                                <motion.div
                                    key={gif.id}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="relative aspect-square cursor-pointer rounded-lg overflow-hidden border border-transparent hover:border-neon-cyan transition-all"
                                    onClick={() => {
                                        onGifSelect(gif.url);
                                        onClose();
                                    }}
                                >
                                    <img
                                        src={gif.preview}
                                        alt={gif.title}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default GifSearch;

import React from 'react';

const TypingIndicator = () => {
    return (
        <div className="flex items-center gap-2 px-4 py-3 glass-dark rounded-2xl w-fit border border-neon-cyan/30">
            <span className="text-sm text-gray-300">Stranger is typing</span>
            <div className="flex gap-1">
                <div className="w-2 h-2 bg-neon-cyan rounded-full typing-dot"></div>
                <div className="w-2 h-2 bg-neon-cyan rounded-full typing-dot"></div>
                <div className="w-2 h-2 bg-neon-cyan rounded-full typing-dot"></div>
            </div>
        </div>
    );
};

export default TypingIndicator;

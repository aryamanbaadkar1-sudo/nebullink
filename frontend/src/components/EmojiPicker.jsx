import React, { useState } from 'react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

const EmojiPicker = ({ onEmojiSelect, onClose }) => {
    return (
        <div className="absolute bottom-20 left-4 z-50">
            <div className="glass-dark rounded-lg p-2 border border-neon-purple/50">
                <Picker
                    data={data}
                    onEmojiSelect={(emoji) => onEmojiSelect(emoji.native)}
                    theme="dark"
                    previewPosition="none"
                    skinTonePosition="none"
                />
            </div>
            <button
                onClick={onClose}
                className="absolute -top-2 -right-2 w-6 h-6 bg-neon-pink rounded-full flex items-center justify-center text-white text-sm hover:bg-neon-purple transition-colors"
            >
                ×
            </button>
        </div>
    );
};

export default EmojiPicker;

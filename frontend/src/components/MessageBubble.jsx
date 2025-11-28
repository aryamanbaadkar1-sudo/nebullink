import React from 'react';
import { motion } from 'framer-motion';

const MessageBubble = ({ message, isOwn }) => {
    const renderContent = () => {
        switch (message.type) {
            case 'text':
            case 'emoji':
                return <p className="text-white break-words">{message.content}</p>;

            case 'image':
                return (
                    <img
                        src={message.fileUrl}
                        alt="Shared image"
                        className="max-w-sm rounded-lg"
                        loading="lazy"
                    />
                );

            case 'gif':
                return (
                    <img
                        src={message.content}
                        alt="GIF"
                        className="max-w-sm rounded-lg"
                        loading="lazy"
                    />
                );

            case 'voice':
                return (
                    <audio controls className="max-w-xs">
                        <source src={message.fileUrl} type="audio/webm" />
                        <source src={message.fileUrl} type="audio/ogg" />
                        Your browser does not support audio.
                    </audio>
                );

            case 'system':
                return (
                    <p className="text-gray-400 text-sm italic text-center">
                        {message.content}
                    </p>
                );

            default:
                return <p className="text-white">{message.content}</p>;
        }
    };

    if (message.type === 'system') {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center my-4"
            >
                <div className="glass px-4 py-2 rounded-full">
                    {renderContent()}
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4 message-bubble`}
        >
            <div
                className={`max-w-md px-4 py-3 rounded-2xl ${isOwn
                        ? 'bg-gradient-to-r from-neon-pink to-neon-purple shadow-neon-pink'
                        : 'glass-dark border border-neon-cyan/30 shadow-neon-cyan'
                    }`}
            >
                {renderContent()}
                <div className="flex items-center justify-end gap-2 mt-1">
                    <span className="text-xs text-gray-400">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </span>
                    {isOwn && message.seen && (
                        <span className="text-xs text-neon-cyan">✓✓</span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default MessageBubble;

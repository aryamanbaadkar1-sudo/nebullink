import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import useChatStore from '../store/useChatStore';
import useAuthStore from '../store/useAuthStore';
import socketService from '../services/socketService';
import webrtcService from '../services/webrtcService';
import MessageBubble from '../components/MessageBubble';
import TypingIndicator from '../components/TypingIndicator';
import EmojiPicker from '../components/EmojiPicker';
import GifSearch from '../components/GifSearch';
import ImageUpload from '../components/ImageUpload';
import VoiceRecorder from '../components/VoiceRecorder';
import VideoCall from '../components/VideoCall';

const ChatScreen = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const {
        currentRoom,
        messages,
        partner,
        isTyping,
        isVideoCallActive,
        setVideoCallActive,
        resetChat
    } = useChatStore();

    const [messageInput, setMessageInput] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showGifSearch, setShowGifSearch] = useState(false);
    const messagesEndRef = useRef(null);
    const typingTimeoutRef = useRef(null);

    useEffect(() => {
        if (!currentRoom) {
            navigate('/home');
        }
    }, [currentRoom, navigate]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleTyping = () => {
        socketService.sendTyping(currentRoom, true);

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            socketService.sendTyping(currentRoom, false);
        }, 1000);
    };

    const sendMessage = (type, content, fileUrl = null) => {
        if (!currentRoom) return;

        socketService.sendMessage(currentRoom, type, content, fileUrl);
        setMessageInput('');
    };

    const handleSendText = (e) => {
        e.preventDefault();
        if (!messageInput.trim()) return;

        sendMessage('text', messageInput);
    };

    const handleEmojiSelect = (emoji) => {
        setMessageInput(messageInput + emoji);
        setShowEmojiPicker(false);
    };

    const handleGifSelect = (gifUrl) => {
        sendMessage('gif', gifUrl);
    };

    const handleImageSend = (imageUrl) => {
        sendMessage('image', null, imageUrl);
    };

    const handleVoiceSend = (voiceUrl) => {
        sendMessage('voice', null, voiceUrl);
    };

    const startVideoCall = async () => {
        const result = await webrtcService.initCall(currentRoom, true);
        if (result.success) {
            setVideoCallActive(true);
            toast.success('Starting video call...');
        } else {
            toast.error('Failed to start video call');
        }
    };

    const handleNext = () => {
        socketService.nextChat();
        resetChat();
        navigate('/home');
        toast.success('Disconnected. Ready for next chat!');
    };

    if (isVideoCallActive) {
        return <VideoCall roomId={currentRoom} onClose={() => setVideoCallActive(false)} />;
    }

    return (
        <div className="h-screen flex flex-col bg-neon-dark">
            {/* Header */}
            <div className="glass-dark border-b border-neon-purple/30 p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-neon-gradient flex items-center justify-center text-white font-bold">
                            {partner?.username?.[0]?.toUpperCase() || 'S'}
                        </div>
                        <div>
                            <h2 className="text-white font-bold">
                                {partner?.username || 'Stranger'}
                            </h2>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-xs text-gray-400">Online</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={startVideoCall}
                            className="p-2 glass rounded-lg hover:bg-neon-purple/20 transition-colors"
                            title="Start video call"
                        >
                            <svg className="w-6 h-6 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </button>

                        <button
                            onClick={handleNext}
                            className="px-4 py-2 bg-neon-gradient rounded-lg hover:shadow-neon-pink transition-all"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.map((message, index) => (
                    <MessageBubble
                        key={message.id || index}
                        message={message}
                        isOwn={message.senderId === user?.id}
                    />
                ))}

                {isTyping && <TypingIndicator />}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="glass-dark border-t border-neon-purple/30 p-4">
                <form onSubmit={handleSendText} className="flex items-center gap-2">
                    {/* Emoji Picker Button */}
                    <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        className="p-2 rounded-lg glass hover:bg-neon-purple/20 transition-colors"
                        title="Emoji"
                    >
                        <svg className="w-6 h-6 text-neon-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>

                    {/* GIF Button */}
                    <button
                        type="button"
                        onClick={() => setShowGifSearch(true)}
                        className="p-2 rounded-lg glass hover:bg-neon-purple/20 transition-colors"
                        title="GIF"
                    >
                        <span className="text-neon-cyan font-bold">GIF</span>
                    </button>

                    {/* Image Upload */}
                    <ImageUpload onImageSend={handleImageSend} />

                    {/* Voice Recorder */}
                    <VoiceRecorder onVoiceSend={handleVoiceSend} />

                    {/* Text Input */}
                    <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => {
                            setMessageInput(e.target.value);
                            handleTyping();
                        }}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-3 bg-neon-darker border border-neon-cyan/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-neon-cyan transition-colors"
                    />

                    {/* Send Button */}
                    <button
                        type="submit"
                        disabled={!messageInput.trim()}
                        className="p-3 bg-neon-gradient rounded-lg hover:shadow-neon-pink transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </form>
            </div>

            {/* Emoji Picker */}
            {showEmojiPicker && (
                <EmojiPicker
                    onEmojiSelect={handleEmojiSelect}
                    onClose={() => setShowEmojiPicker(false)}
                />
            )}

            {/* GIF Search */}
            <AnimatePresence>
                {showGifSearch && (
                    <GifSearch
                        onGifSelect={handleGifSelect}
                        onClose={() => setShowGifSearch(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChatScreen;

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

const VoiceRecorder = ({ onVoiceSend }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioURL, setAudioURL] = useState(null);
    const [uploading, setUploading] = useState(false);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(blob);
                setAudioURL(url);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Recording error:', error);
            toast.error('Failed to access microphone');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const sendVoice = async () => {
        if (!audioURL) return;

        setUploading(true);
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('voice', blob, 'voice-message.webm');

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('/api/chat/upload/voice', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            onVoiceSend(response.data.fileUrl);
            setAudioURL(null);
            chunksRef.current = [];
            toast.success('Voice message sent!');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to send voice message');
        } finally {
            setUploading(false);
        }
    };

    const cancelRecording = () => {
        setAudioURL(null);
        chunksRef.current = [];
    };

    return (
        <>
            <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-2 rounded-lg transition-all ${isRecording
                        ? 'bg-red-500 shadow-neon-pink animate-pulse'
                        : 'glass hover:bg-neon-purple/20'
                    }`}
                title={isRecording ? 'Stop recording' : 'Record voice message'}
            >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
            </button>

            <AnimatePresence>
                {audioURL && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                    >
                        <div className="glass-dark rounded-2xl p-6 max-w-md w-full border border-neon-purple/50">
                            <h3 className="text-xl font-bold text-neon-pink mb-4">Voice Message</h3>
                            <audio src={audioURL} controls className="w-full mb-4" />
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={cancelRecording}
                                    disabled={uploading}
                                    className="px-6 py-2 rounded-lg glass hover:bg-red-500/20 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={sendVoice}
                                    disabled={uploading}
                                    className="px-6 py-2 rounded-lg bg-neon-gradient hover:shadow-neon-pink transition-all disabled:opacity-50"
                                >
                                    {uploading ? 'Sending...' : 'Send'}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default VoiceRecorder;

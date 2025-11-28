import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import webrtcService from '../services/webrtcService';
import useChatStore from '../store/useChatStore';

const VideoCall = ({ roomId, onClose }) => {
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const [micEnabled, setMicEnabled] = useState(true);
    const [cameraEnabled, setCameraEnabled] = useState(true);
    const { localStream, remoteStream } = useChatStore();

    useEffect(() => {
        if (localStream && localVideoRef.current) {
            localVideoRef.current.srcObject = localStream;
        }
    }, [localStream]);

    useEffect(() => {
        if (remoteStream && remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
        }
    }, [remoteStream]);

    const toggleMic = () => {
        const enabled = webrtcService.toggleMic();
        setMicEnabled(enabled);
    };

    const toggleCamera = () => {
        const enabled = webrtcService.toggleCamera();
        setCameraEnabled(enabled);
    };

    const endCall = () => {
        webrtcService.endCall();
        onClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex flex-col"
        >
            {/* Remote video (main) */}
            <div className="flex-1 relative bg-neon-darker">
                {remoteStream ? (
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-neon-pink border-t-transparent mx-auto mb-4"></div>
                            <p className="text-white text-lg">Connecting...</p>
                        </div>
                    </div>
                )}

                {/* Local video (small preview) */}
                <div className="absolute top-4 right-4 w-48 h-36 rounded-lg overflow-hidden border-2 border-neon-cyan shadow-neon-cyan">
                    <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Connection status */}
                <div className="absolute top-4 left-4 glass px-4 py-2 rounded-full">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-white text-sm">Connected</span>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-neon-darker border-t border-neon-purple/30 p-6">
                <div className="flex items-center justify-center gap-4">
                    {/* Mic toggle */}
                    <button
                        onClick={toggleMic}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${micEnabled
                                ? 'glass hover:bg-neon-purple/20'
                                : 'bg-red-500 shadow-neon-pink'
                            }`}
                        title={micEnabled ? 'Mute microphone' : 'Unmute microphone'}
                    >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {micEnabled ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            )}
                        </svg>
                    </button>

                    {/* Camera toggle */}
                    <button
                        onClick={toggleCamera}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${cameraEnabled
                                ? 'glass hover:bg-neon-purple/20'
                                : 'bg-red-500 shadow-neon-pink'
                            }`}
                        title={cameraEnabled ? 'Turn off camera' : 'Turn on camera'}
                    >
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {cameraEnabled ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            )}
                        </svg>
                    </button>

                    {/* End call */}
                    <button
                        onClick={endCall}
                        className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-neon-pink transition-all"
                        title="End call"
                    >
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
                        </svg>
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default VideoCall;

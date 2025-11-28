import SimplePeer from 'simple-peer';
import socketService from './socketService';
import useChatStore from '../store/useChatStore';

class WebRTCService {
    constructor() {
        this.peer = null;
        this.localStream = null;
        this.roomId = null;
    }

    // Initialize video call
    async initCall(roomId, initiator = false) {
        this.roomId = roomId;

        try {
            // Get user media
            this.localStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            useChatStore.getState().setLocalStream(this.localStream);

            // Create peer connection
            this.peer = new SimplePeer({
                initiator,
                stream: this.localStream,
                trickle: true,
                config: {
                    iceServers: [
                        { urls: 'stun:stun.l.google.com:19302' },
                        { urls: 'stun:stun1.l.google.com:19302' }
                    ]
                }
            });

            // Setup peer event listeners
            this.setupPeerListeners();

            // Setup socket listeners for WebRTC
            this.setupSocketListeners();

            return { success: true };
        } catch (error) {
            console.error('Failed to init call:', error);
            return { success: false, error: error.message };
        }
    }

    setupPeerListeners() {
        if (!this.peer) return;

        // Signal event - send to other peer via socket
        this.peer.on('signal', (data) => {
            if (data.type === 'offer') {
                socketService.sendOffer(this.roomId, data);
            } else if (data.type === 'answer') {
                socketService.sendAnswer(this.roomId, data);
            } else {
                // ICE candidate
                socketService.sendIceCandidate(this.roomId, data);
            }
        });

        // Stream event - remote stream received
        this.peer.on('stream', (stream) => {
            console.log('📹 Remote stream received');
            useChatStore.getState().setRemoteStream(stream);
        });

        // Error event
        this.peer.on('error', (err) => {
            console.error('Peer error:', err);
        });

        // Close event
        this.peer.on('close', () => {
            console.log('Peer connection closed');
            this.cleanup();
        });
    }

    setupSocketListeners() {
        const socket = socketService.getSocket();
        if (!socket) return;

        // Receive offer
        socket.on('offer', (data) => {
            if (this.peer) {
                this.peer.signal(data.offer);
            }
        });

        // Receive answer
        socket.on('answer', (data) => {
            if (this.peer) {
                this.peer.signal(data.answer);
            }
        });

        // Receive ICE candidate
        socket.on('iceCandidate', (data) => {
            if (this.peer) {
                this.peer.signal(data.candidate);
            }
        });

        // Call ended by partner
        socket.on('callEnded', () => {
            this.endCall();
        });
    }

    // Toggle microphone
    toggleMic() {
        if (this.localStream) {
            const audioTrack = this.localStream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                return audioTrack.enabled;
            }
        }
        return false;
    }

    // Toggle camera
    toggleCamera() {
        if (this.localStream) {
            const videoTrack = this.localStream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                return videoTrack.enabled;
            }
        }
        return false;
    }

    // End call
    endCall() {
        if (this.roomId) {
            socketService.endCall(this.roomId);
        }

        this.cleanup();
    }

    // Cleanup
    cleanup() {
        if (this.peer) {
            this.peer.destroy();
            this.peer = null;
        }

        if (this.localStream) {
            this.localStream.getTracks().forEach(track => track.stop());
            this.localStream = null;
        }

        useChatStore.getState().setLocalStream(null);
        useChatStore.getState().setRemoteStream(null);
        useChatStore.getState().setVideoCallActive(false);

        this.roomId = null;
    }
}

export default new WebRTCService();

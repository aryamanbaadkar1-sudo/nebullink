import { io } from 'socket.io-client';
import useChatStore from '../store/useChatStore';

class SocketService {
    constructor() {
        this.socket = null;
    }

    connect(token) {
        if (this.socket?.connected) {
            return;
        }

        const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        this.socket = io(SOCKET_URL, {
            auth: { token }
        });

        this.setupListeners();
    }

    setupListeners() {
        const { setCurrentRoom, addMessage, setPartner, setTyping, setConnected, setInQueue, resetChat } = useChatStore.getState();

        // Connection events
        this.socket.on('connect', () => {
            console.log('✅ Connected to server');
            setConnected(true);
        });

        this.socket.on('disconnect', () => {
            console.log('❌ Disconnected from server');
            setConnected(false);
        });

        // Match found
        this.socket.on('matchFound', async (data) => {
            console.log('🎯 Match found:', data);
            setCurrentRoom(data.roomId);
            setInQueue(false);

            // Fetch partner info
            const token = localStorage.getItem('token');
            try {
                const response = await fetch(`/api/chat/partner/${data.roomId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const partnerData = await response.json();
                setPartner(partnerData.partner);
            } catch (error) {
                console.error('Failed to fetch partner info:', error);
            }

            // Fetch chat history
            try {
                const response = await fetch(`/api/chat/history/${data.roomId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const historyData = await response.json();
                useChatStore.getState().setMessages(historyData.messages);
            } catch (error) {
                console.error('Failed to fetch history:', error);
            }
        });

        // New message
        this.socket.on('newMessage', (message) => {
            addMessage(message);
        });

        // Partner typing
        this.socket.on('partnerTyping', (data) => {
            setTyping(data.isTyping);
        });

        // Message seen
        this.socket.on('messageSeen', (data) => {
            // Update message seen status in store if needed
            console.log('Message seen:', data.messageId);
        });

        // Partner disconnected
        this.socket.on('partnerDisconnected', () => {
            addMessage({
                type: 'system',
                content: 'Stranger has disconnected',
                timestamp: new Date()
            });
        });

        // Ready for queue
        this.socket.on('readyForQueue', () => {
            resetChat();
            setInQueue(false);
        });
    }

    // Send message
    sendMessage(roomId, type, content, fileUrl = null) {
        if (!this.socket) return;

        this.socket.emit('sendMessage', {
            roomId,
            type,
            content,
            fileUrl
        });
    }

    // Send typing indicator
    sendTyping(roomId, isTyping) {
        if (!this.socket) return;

        this.socket.emit('typing', {
            roomId,
            isTyping
        });
    }

    // Mark message as seen
    markSeen(messageId, roomId) {
        if (!this.socket) return;

        this.socket.emit('seenMessage', {
            messageId,
            roomId
        });
    }

    // WebRTC signaling
    sendOffer(roomId, offer) {
        if (!this.socket) return;
        this.socket.emit('offer', { roomId, offer });
    }

    sendAnswer(roomId, answer) {
        if (!this.socket) return;
        this.socket.emit('answer', { roomId, answer });
    }

    sendIceCandidate(roomId, candidate) {
        if (!this.socket) return;
        this.socket.emit('iceCandidate', { roomId, candidate });
    }

    endCall(roomId) {
        if (!this.socket) return;
        this.socket.emit('endCall', { roomId });
    }

    // Next chat
    nextChat() {
        if (!this.socket) return;
        this.socket.emit('nextChat');
    }

    // Disconnect
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    // Get socket instance for WebRTC
    getSocket() {
        return this.socket;
    }
}

export default new SocketService();

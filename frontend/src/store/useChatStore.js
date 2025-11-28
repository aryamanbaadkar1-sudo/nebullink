import { create } from 'zustand';

const useChatStore = create((set) => ({
    currentRoom: null,
    messages: [],
    partner: null,
    isTyping: false,
    isConnected: false,
    inQueue: false,
    isVideoCallActive: false,
    localStream: null,
    remoteStream: null,

    // Set current room
    setCurrentRoom: (roomId) => set({ currentRoom: roomId }),

    // Add message
    addMessage: (message) => set((state) => ({
        messages: [...state.messages, message]
    })),

    // Set messages
    setMessages: (messages) => set({ messages }),

    // Clear messages
    clearMessages: () => set({ messages: [] }),

    // Set partner
    setPartner: (partner) => set({ partner }),

    // Set typing status
    setTyping: (isTyping) => set({ isTyping }),

    // Set connection status
    setConnected: (isConnected) => set({ isConnected }),

    // Set queue status
    setInQueue: (inQueue) => set({ inQueue }),

    // Set video call status
    setVideoCallActive: (isActive) => set({ isVideoCallActive: isActive }),

    // Set local stream
    setLocalStream: (stream) => set({ localStream: stream }),

    // Set remote stream
    setRemoteStream: (stream) => set({ remoteStream: stream }),

    // Reset chat state
    resetChat: () => set({
        currentRoom: null,
        messages: [],
        partner: null,
        isTyping: false,
        isConnected: false,
        isVideoCallActive: false,
        localStream: null,
        remoteStream: null
    })
}));

export default useChatStore;

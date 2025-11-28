import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/useAuthStore';
import socketService from './services/socketService';
import LandingScreen from './screens/LandingScreen';
import AuthScreen from './screens/AuthScreen';
import HomeScreen from './screens/HomeScreen';
import MatchmakingScreen from './screens/MatchmakingScreen';
import ChatScreen from './screens/ChatScreen';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuthStore();
    return isAuthenticated ? children : <Navigate to="/auth" />;
};

function App() {
    const { isAuthenticated, token } = useAuthStore();

    useEffect(() => {
        // Connect to Socket.IO when authenticated
        if (isAuthenticated && token) {
            socketService.connect(token);
        }

        return () => {
            if (isAuthenticated) {
                socketService.disconnect();
            }
        };
    }, [isAuthenticated, token]);

    return (
        <BrowserRouter>
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: '#1a1a2e',
                        color: '#fff',
                        border: '1px solid #ff1bcb'
                    },
                    success: {
                        iconTheme: {
                            primary: '#00f5ff',
                            secondary: '#fff'
                        }
                    },
                    error: {
                        iconTheme: {
                            primary: '#ff1bcb',
                            secondary: '#fff'
                        }
                    }
                }}
            />

            <Routes>
                <Route path="/" element={<LandingScreen />} />
                <Route path="/auth" element={<AuthScreen />} />
                <Route
                    path="/home"
                    element={
                        <ProtectedRoute>
                            <HomeScreen />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/matchmaking"
                    element={
                        <ProtectedRoute>
                            <MatchmakingScreen />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/chat"
                    element={
                        <ProtectedRoute>
                            <ChatScreen />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                neon: {
                    pink: '#ff1bcb',
                    cyan: '#00f5ff',
                    purple: '#a855f7',
                    blue: '#3b82f6',
                    dark: '#0a0a0f',
                    darker: '#050508',
                }
            },
            backgroundImage: {
                'neon-gradient': 'linear-gradient(135deg, #ff1bcb 0%, #a855f7 50%, #00f5ff 100%)',
                'dark-gradient': 'linear-gradient(180deg, #0a0a0f 0%, #1a0a1f 100%)',
            },
            boxShadow: {
                'neon-pink': '0 0 20px rgba(255, 27, 203, 0.5)',
                'neon-cyan': '0 0 20px rgba(0, 245, 255, 0.5)',
                'neon-purple': '0 0 20px rgba(168, 85, 247, 0.5)',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 6s ease-in-out infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                glow: {
                    '0%': { boxShadow: '0 0 5px rgba(255, 27, 203, 0.5), 0 0 10px rgba(255, 27, 203, 0.3)' },
                    '100%': { boxShadow: '0 0 20px rgba(255, 27, 203, 0.8), 0 0 30px rgba(255, 27, 203, 0.5)' },
                }
            }
        },
    },
    plugins: [],
}

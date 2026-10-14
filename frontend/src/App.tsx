//src/App.tsx
import React from 'react';
import { AuthScreen } from './components/AuthScreen';
import { ChatRoom } from './components/ChatRoom';
import { useAuthStore } from './store/useAuthStore';

export function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return isAuthenticated ? <ChatRoom /> : <AuthScreen />;
}

export default App;
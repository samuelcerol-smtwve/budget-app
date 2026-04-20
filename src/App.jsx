import { useEffect, useState } from 'react';
import { useAuth } from './hooks/useAuth';
import Login from './components/Login';
import Home from './pages/Home';

export default function App() {
  const { session, user, loading, signIn, signUp, signOut } = useAuth();

  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-slate-500 dark:text-slate-400">Chargement...</div>
      </div>
    );
  }

  if (!session) {
    return <Login signIn={signIn} signUp={signUp} />;
  }

  return <Home user={user} signOut={signOut} isDark={isDark} onToggleDark={() => setIsDark(!isDark)} />;
}

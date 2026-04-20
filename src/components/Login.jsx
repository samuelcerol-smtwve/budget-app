import { useState } from 'react';

export default function Login({ signIn, signUp }) {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);

    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password);
        if (error) setError(error.message);
      } else {
        const { error } = await signUp(email, password);
        if (error) setError(error.message);
        else setInfo('Compte créé ! Vérifie ton email pour confirmer ton inscription, puis connecte-toi.');
      }
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-night-800">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: 'rgba(201, 169, 97, 0.15)' }}
          >
            <span className="font-display text-3xl text-gold">€</span>
          </div>
          <h1 className="text-2xl font-medium text-cream-100">Mon Budget</h1>
          <p className="text-secondary text-sm mt-1">
            {mode === 'signin' ? 'Connecte-toi pour continuer' : 'Crée ton compte'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 bg-night-700 p-6 rounded-2xl border-gold">
          <div>
            <label className="text-[11px] font-medium text-secondary block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-3 rounded-xl bg-night-800 text-cream-100 focus:outline-none transition-colors"
              style={{ border: '1px solid rgba(201, 169, 97, 0.12)' }}
              onFocus={(e) => e.target.style.borderColor = 'rgba(201, 169, 97, 0.5)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(201, 169, 97, 0.12)'}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="text-[11px] font-medium text-secondary block mb-1">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-3 rounded-xl bg-night-800 text-cream-100 focus:outline-none transition-colors"
              style={{ border: '1px solid rgba(201, 169, 97, 0.12)' }}
              onFocus={(e) => e.target.style.borderColor = 'rgba(201, 169, 97, 0.5)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(201, 169, 97, 0.12)'}
              required
              minLength={6}
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            />
          </div>

          {error && (
            <div className="text-sm p-2.5 rounded-xl" style={{ color: '#D89478', background: 'rgba(216, 148, 120, 0.1)' }}>
              {error}
            </div>
          )}
          {info && (
            <div className="text-sm p-2.5 rounded-xl" style={{ color: '#7A9B7E', background: 'rgba(122, 155, 126, 0.1)' }}>
              {info}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gold text-night-800 rounded-xl font-medium disabled:opacity-50 transition-opacity"
          >
            {loading ? '...' : mode === 'signin' ? 'Se connecter' : 'Créer un compte'}
          </button>

          <button
            type="button"
            onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); setInfo(''); }}
            className="w-full text-sm text-gold-light hover:text-gold transition-colors"
          >
            {mode === 'signin' ? "Pas de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}

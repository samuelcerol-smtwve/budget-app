import { useState, useMemo } from 'react';
import { useEnvelopes } from '../hooks/useEnvelopes';
import { useExpenses } from '../hooks/useExpenses';
import { monthKey } from '../lib/helpers';
import { supabase } from '../lib/supabase';
import { DEFAULT_ENVELOPES, INITIAL_SPENT_AMOUNT, INITIAL_SPENT_NOTE } from '../lib/constants';

import Dashboard from '../components/Dashboard';
import EnvelopeCard from '../components/EnvelopeCard';
import History from '../components/History';
import ExpenseModal from '../components/ExpenseModal';
import EnvelopesModal from '../components/EnvelopesModal';
import SettingsModal from '../components/SettingsModal';

export default function Home({ user, signOut, isDark, onToggleDark }) {
  const { envelopes, loading: loadingEnv, saveEnvelopesBatch, refetch: refetchEnvelopes } = useEnvelopes(user.id);
  const { expenses, loading: loadingExp, addExpense, updateExpense, deleteExpense, deleteMonth, refetch: refetchExpenses } = useExpenses(user.id);

  const [filterMonth, setFilterMonth] = useState(monthKey());
  const [filterEnv, setFilterEnv] = useState('all');

  const [expenseModal, setExpenseModal] = useState({ open: false, expense: null, preselectEnvId: null });
  const [envelopesModalOpen, setEnvelopesModalOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Calculs dérivés
  const spentByEnv = useMemo(() => {
    const m = {};
    expenses.forEach((e) => {
      if (!e.spent_at.startsWith(filterMonth)) return;
      m[e.envelope_id] = (m[e.envelope_id] || 0) + Number(e.amount);
    });
    return m;
  }, [expenses, filterMonth]);

  const totalBudget = envelopes.reduce((s, e) => s + Number(e.budget), 0);
  const totalSpent = expenses
    .filter((e) => e.spent_at.startsWith(filterMonth))
    .reduce((s, e) => s + Number(e.amount), 0);
  const totalRemaining = totalBudget - totalSpent;

  const availableMonths = useMemo(() => {
    const s = new Set([monthKey(), ...expenses.map((e) => e.spent_at.slice(0, 7))]);
    return [...s].sort().reverse();
  }, [expenses]);

  // Handlers
  const handleSaveExpense = async (data) => {
    try {
      if (data.id) {
        await updateExpense(data.id, {
          amount: data.amount,
          envelope_id: data.envelope_id,
          note: data.note,
          spent_at: data.spent_at,
        });
      } else {
        await addExpense({
          amount: data.amount,
          envelope_id: data.envelope_id,
          note: data.note,
          spent_at: data.spent_at,
        });
      }
      // Si la dépense est dans un mois différent du filtre actuel, basculer
      const mk = data.spent_at.slice(0, 7);
      if (mk !== filterMonth) setFilterMonth(mk);
      setExpenseModal({ open: false, expense: null, preselectEnvId: null });
    } catch (err) {
      alert('Erreur: ' + err.message);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (!confirm('Supprimer cette dépense ?')) return;
    try {
      await deleteExpense(id);
      setExpenseModal({ open: false, expense: null, preselectEnvId: null });
    } catch (err) {
      alert('Erreur: ' + err.message);
    }
  };

  const handleSaveEnvelopes = async (items) => {
    try {
      await saveEnvelopesBatch(items);
      setEnvelopesModalOpen(false);
    } catch (err) {
      alert('Erreur: ' + err.message);
    }
  };

  const handleResetMonth = async () => {
    if (!confirm(`Supprimer toutes les dépenses de ce mois ?`)) return;
    try {
      await deleteMonth(filterMonth);
      setSettingsOpen(false);
    } catch (err) {
      alert('Erreur: ' + err.message);
    }
  };

  const handleResetAll = async () => {
    if (!confirm('⚠️ Tout effacer (enveloppes + dépenses) ? Les enveloppes par défaut seront recréées.')) return;
    if (!confirm('Vraiment sûr ? Action irréversible.')) return;
    try {
      await supabase.from('expenses').delete().eq('user_id', user.id);
      await supabase.from('envelopes').delete().eq('user_id', user.id);
      // Recréer les défauts
      const toInsert = DEFAULT_ENVELOPES.map((e) => ({ ...e, user_id: user.id }));
      const { data: insertedEnvs } = await supabase.from('envelopes').insert(toInsert).select();
      const preloadEnv = insertedEnvs?.find((e) => e.name === 'Déjà dépensé (à ventiler)');
      if (preloadEnv) {
        const now = new Date();
        const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 12, 0, 0);
        await supabase.from('expenses').insert([{
          user_id: user.id,
          envelope_id: preloadEnv.id,
          amount: INITIAL_SPENT_AMOUNT,
          note: INITIAL_SPENT_NOTE,
          spent_at: firstOfMonth.toISOString(),
        }]);
      }
      await refetchEnvelopes();
      await refetchExpenses();
      setSettingsOpen(false);
    } catch (err) {
      alert('Erreur: ' + err.message);
    }
  };

  if (loadingEnv || loadingExp) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-500">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 pt-4">
      {/* Header */}
      <header className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">💰 Mon Budget</h1>
        <div className="flex gap-2">
          <button
            onClick={onToggleDark}
            className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-lg"
            aria-label="Thème"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
          <button
            onClick={() => setSettingsOpen(true)}
            className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-lg"
            aria-label="Réglages"
          >
            ⚙️
          </button>
        </div>
      </header>

      {/* Dashboard */}
      <Dashboard
        filterMonth={filterMonth}
        totalBudget={totalBudget}
        totalSpent={totalSpent}
        totalRemaining={totalRemaining}
      />

      {/* Enveloppes */}
      <section className="mb-5">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Enveloppes</h2>
          <button
            onClick={() => setEnvelopesModalOpen(true)}
            className="text-sm text-indigo-600 dark:text-indigo-400 font-medium"
          >
            Gérer
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {envelopes.map((env) => (
            <EnvelopeCard
              key={env.id}
              envelope={env}
              spent={spentByEnv[env.id] || 0}
              filterMonth={filterMonth}
              onClick={() => setExpenseModal({ open: true, expense: null, preselectEnvId: env.id })}
            />
          ))}
        </div>
      </section>

      {/* Historique */}
      <section className="mb-5">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-3">Historique</h2>
        <History
          expenses={expenses}
          envelopes={envelopes}
          filterMonth={filterMonth}
          filterEnv={filterEnv}
          availableMonths={availableMonths}
          onChangeMonth={setFilterMonth}
          onChangeEnv={setFilterEnv}
          onEdit={(exp) => setExpenseModal({ open: true, expense: exp, preselectEnvId: null })}
        />
      </section>

      {/* Bouton flottant */}
      <button
        onClick={() => setExpenseModal({ open: true, expense: null, preselectEnvId: null })}
        className="fixed bottom-5 right-5 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white text-3xl rounded-full shadow-lg active:scale-95 transition-transform z-40 flex items-center justify-center"
        style={{ bottom: `calc(env(safe-area-inset-bottom, 0) + 1.25rem)` }}
        aria-label="Ajouter une dépense"
      >
        +
      </button>

      {/* Modales */}
      <ExpenseModal
        isOpen={expenseModal.open}
        onClose={() => setExpenseModal({ open: false, expense: null, preselectEnvId: null })}
        expense={expenseModal.expense}
        preselectEnvId={expenseModal.preselectEnvId}
        envelopes={envelopes}
        onSave={handleSaveExpense}
        onDelete={handleDeleteExpense}
      />
      <EnvelopesModal
        isOpen={envelopesModalOpen}
        onClose={() => setEnvelopesModalOpen(false)}
        envelopes={envelopes}
        onSave={handleSaveEnvelopes}
      />
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        envelopes={envelopes}
        expenses={expenses}
        onResetMonth={handleResetMonth}
        onResetAll={handleResetAll}
        onSignOut={signOut}
        isDark={isDark}
        onToggleDark={onToggleDark}
      />
    </div>
  );
}

import { useState, useEffect } from 'react';
import Modal from './Modal';
import { nowDateTimeLocal, toLocalFromISO, toISOFromLocal } from '../lib/helpers';

export default function ExpenseModal({ isOpen, onClose, expense, preselectEnvId, envelopes, onSave, onDelete }) {
  const isEdit = !!expense;

  const [amount, setAmount] = useState(expense ? String(expense.amount) : '');
  const [envId, setEnvId] = useState(expense?.envelope_id || preselectEnvId || envelopes[0]?.id || '');
  const [note, setNote] = useState(expense?.note || '');
  const [dateLocal, setDateLocal] = useState(
    expense?.spent_at ? toLocalFromISO(expense.spent_at) : nowDateTimeLocal()
  );
  const [saving, setSaving] = useState(false);

  // Réinitialise les champs quand la modal s'ouvre/change
  const resetToProps = () => {
    setAmount(expense ? String(expense.amount) : '');
    setEnvId(expense?.envelope_id || preselectEnvId || envelopes[0]?.id || '');
    setNote(expense?.note || '');
    setDateLocal(expense?.spent_at ? toLocalFromISO(expense.spent_at) : nowDateTimeLocal());
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useStateResetOnOpen(isOpen, resetToProps);

  const submit = async (e) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!amt || amt <= 0 || !envId || !dateLocal) return;
    setSaving(true);
    try {
      await onSave({
        id: expense?.id,
        amount: amt,
        envelope_id: envId,
        note: note.trim(),
        spent_at: toISOFromLocal(dateLocal),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Modifier la dépense' : 'Nouvelle dépense'}>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">Montant (€)</label>
          <input
            type="number"
            step="0.01"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            autoFocus
            className="w-full px-3 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xl font-semibold focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">Catégorie</label>
          <select
            value={envId}
            onChange={(e) => setEnvId(e.target.value)}
            required
            className="w-full px-3 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
          >
            {envelopes.map((env) => (
              <option key={env.id} value={env.id}>{env.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">Note (facultatif)</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ex: Courses Lidl"
            className="w-full px-3 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">Date et heure</label>
          <input
            type="datetime-local"
            value={dateLocal}
            onChange={(e) => setDateLocal(e.target.value)}
            required
            className="w-full px-3 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex gap-2 pt-2">
          {isEdit && (
            <button
              type="button"
              onClick={() => onDelete(expense.id)}
              className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium"
            >
              Supprimer
            </button>
          )}
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium disabled:opacity-50"
          >
            {saving ? '...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// Petit hook inline pour reset le state quand la modal s'ouvre
function useStateResetOnOpen(isOpen, cb) {
  useEffect(() => {
    if (isOpen) cb();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);
}

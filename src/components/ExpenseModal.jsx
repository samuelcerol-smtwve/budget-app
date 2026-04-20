import { useState, useEffect } from 'react';
import Modal from './Modal';
import { nowDateTimeLocal, toLocalFromISO, toISOFromLocal } from '../lib/helpers';
import ReceiptScanner from './ReceiptScanner';

const inputCls = "w-full px-3 py-3 rounded-xl bg-night-800 text-cream-100 focus:outline-none transition-colors";
const inputStyle = { border: '1px solid rgba(201, 169, 97, 0.12)' };
const inputFocus = (e) => e.target.style.borderColor = 'rgba(201, 169, 97, 0.5)';
const inputBlur = (e) => e.target.style.borderColor = 'rgba(201, 169, 97, 0.12)';

export default function ExpenseModal({ isOpen, onClose, expense, preselectEnvId, envelopes, onSave, onDelete }) {
  const isEdit = !!expense;

  const [amount, setAmount] = useState(expense ? String(expense.amount) : '');
  const [envId, setEnvId] = useState(expense?.envelope_id || preselectEnvId || envelopes[0]?.id || '');
  const [note, setNote] = useState(expense?.note || '');
  const [dateLocal, setDateLocal] = useState(
    expense?.spent_at ? toLocalFromISO(expense.spent_at) : nowDateTimeLocal()
  );
  const [saving, setSaving] = useState(false);

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
      {!isEdit && (
        <ReceiptScanner
          envelopes={envelopes}
          onResult={(data) => {
            if (data.amount) setAmount(String(data.amount));
            if (data.note) setNote(data.note);
            if (data.date) {
              const now = new Date();
              const hh = String(now.getHours()).padStart(2, '0');
              const mm = String(now.getMinutes()).padStart(2, '0');
              setDateLocal(`${data.date}T${hh}:${mm}`);
            }
          }}
        />
      )}
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="text-[11px] font-medium text-secondary block mb-1">Montant (€)</label>
          <input
            type="number"
            step="0.01"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            autoFocus
            className={`${inputCls} font-display text-xl`}
            style={inputStyle}
            onFocus={inputFocus}
            onBlur={inputBlur}
          />
        </div>
        <div>
          <label className="text-[11px] font-medium text-secondary block mb-1">Catégorie</label>
          <select
            value={envId}
            onChange={(e) => setEnvId(e.target.value)}
            required
            className={inputCls}
            style={inputStyle}
            onFocus={inputFocus}
            onBlur={inputBlur}
          >
            {envelopes.map((env) => (
              <option key={env.id} value={env.id}>{env.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-[11px] font-medium text-secondary block mb-1">Note (facultatif)</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ex: Courses Lidl"
            className={inputCls}
            style={inputStyle}
            onFocus={inputFocus}
            onBlur={inputBlur}
          />
        </div>
        <div>
          <label className="text-[11px] font-medium text-secondary block mb-1">Date et heure</label>
          <input
            type="datetime-local"
            value={dateLocal}
            onChange={(e) => setDateLocal(e.target.value)}
            required
            className={inputCls}
            style={inputStyle}
            onFocus={inputFocus}
            onBlur={inputBlur}
          />
        </div>

        <div className="flex gap-2 pt-2">
          {isEdit && (
            <button
              type="button"
              onClick={() => onDelete(expense.id)}
              className="flex-1 py-3 rounded-xl font-medium transition-opacity"
              style={{ background: 'rgba(216, 148, 120, 0.15)', color: '#D89478' }}
            >
              Supprimer
            </button>
          )}
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-3 bg-gold text-night-800 rounded-xl font-medium disabled:opacity-50 transition-opacity"
          >
            {saving ? '...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function useStateResetOnOpen(isOpen, cb) {
  useEffect(() => {
    if (isOpen) cb();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);
}

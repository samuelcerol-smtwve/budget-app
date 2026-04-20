import Modal from './Modal';
import { todayISO } from '../lib/helpers';

export default function SettingsModal({
  isOpen, onClose,
  envelopes, expenses,
  onResetMonth, onResetAll, onSignOut,
  isDark, onToggleDark,
}) {
  const exportJSON = () => {
    const data = JSON.stringify({ envelopes, expenses }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `budget_${todayISO()}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const exportCSV = () => {
    const headers = ['Date', 'Heure', 'Enveloppe', 'Montant', 'Note'];
    const rows = expenses.map((exp) => {
      const env = envelopes.find((e) => e.id === exp.envelope_id);
      const d = new Date(exp.spent_at);
      const pad = (n) => String(n).padStart(2, '0');
      const datePart = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      const timePart = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
      return [
        datePart,
        timePart,
        env ? env.name : 'Supprimée',
        Number(exp.amount).toFixed(2),
        (exp.note || '').replace(/"/g, '""'),
      ];
    });
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `budget_${todayISO()}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Réglages">
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-2">Apparence</label>
          <button
            onClick={onToggleDark}
            className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg font-medium"
          >
            {isDark ? '☀️ Mode clair' : '🌙 Mode sombre'}
          </button>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-2">Exporter mes données</label>
          <div className="flex gap-2">
            <button
              onClick={exportJSON}
              className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg font-medium"
            >
              JSON
            </button>
            <button
              onClick={exportCSV}
              className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg font-medium"
            >
              CSV
            </button>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-red-600 block mb-2">Zone dangereuse</label>
          <button
            onClick={onResetMonth}
            className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium mb-2"
          >
            🔄 Réinitialiser le mois affiché
          </button>
          <button
            onClick={onResetAll}
            className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium"
          >
            🗑️ Tout effacer
          </button>
        </div>

        <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={onSignOut}
            className="w-full py-3 text-slate-700 dark:text-slate-300 rounded-lg font-medium border border-slate-200 dark:border-slate-700"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </Modal>
  );
}

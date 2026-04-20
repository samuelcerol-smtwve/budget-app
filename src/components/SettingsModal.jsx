import Modal from './Modal';
import { todayISO } from '../lib/helpers';
import { getIcon } from '../lib/icons';

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

  const btnSecondary = "w-full py-3 bg-night-800 text-cream-100 rounded-xl font-medium hover:bg-night-600 transition-colors border-gold";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Réglages">
      <div className="space-y-4">
        <div>
          <label className="text-[11px] font-medium text-secondary block mb-2">Apparence</label>
          <button onClick={onToggleDark} className={btnSecondary}>
            <span className="inline-flex items-center gap-2">
              {isDark ? getIcon('sun', { size: 16 }) : getIcon('moon', { size: 16 })}
              {isDark ? 'Mode clair' : 'Mode sombre'}
            </span>
          </button>
        </div>

        <div>
          <label className="text-[11px] font-medium text-secondary block mb-2">Exporter mes données</label>
          <div className="flex gap-2">
            <button onClick={exportJSON} className={`flex-1 ${btnSecondary}`}>
              <span className="inline-flex items-center gap-1.5">
                {getIcon('download', { size: 14 })} JSON
              </span>
            </button>
            <button onClick={exportCSV} className={`flex-1 ${btnSecondary}`}>
              <span className="inline-flex items-center gap-1.5">
                {getIcon('download', { size: 14 })} CSV
              </span>
            </button>
          </div>
        </div>

        <div>
          <label className="text-[11px] font-medium block mb-2" style={{ color: '#D89478' }}>Zone dangereuse</label>
          <button
            onClick={onResetMonth}
            className="w-full py-3 rounded-xl font-medium mb-2 transition-opacity"
            style={{ background: 'rgba(216, 148, 120, 0.12)', color: '#D89478' }}
          >
            <span className="inline-flex items-center gap-2">
              {getIcon('refresh-cw', { size: 14, color: '#D89478' })}
              Réinitialiser le mois affiché
            </span>
          </button>
          <button
            onClick={onResetAll}
            className="w-full py-3 rounded-xl font-medium transition-opacity"
            style={{ background: 'rgba(216, 148, 120, 0.12)', color: '#D89478' }}
          >
            <span className="inline-flex items-center gap-2">
              {getIcon('trash', { size: 14, color: '#D89478' })}
              Tout effacer
            </span>
          </button>
        </div>

        <div style={{ borderTop: '1px solid rgba(201, 169, 97, 0.12)', paddingTop: '16px' }}>
          <button
            onClick={onSignOut}
            className="w-full py-3 text-secondary rounded-xl font-medium border-gold hover:text-cream-100 transition-colors"
          >
            <span className="inline-flex items-center gap-2">
              {getIcon('log-out', { size: 14 })}
              Se déconnecter
            </span>
          </button>
        </div>
      </div>
    </Modal>
  );
}

import { formatMoney, calculatePace } from '../lib/helpers';

export default function EnvelopeCard({ envelope, spent, filterMonth, onClick }) {
  const remaining = envelope.budget - spent;
  const percent = envelope.budget > 0 ? (spent / envelope.budget) * 100 : 0;

  const statusColor = percent > 100
    ? 'text-red-600 dark:text-red-400'
    : percent >= 80
    ? 'text-amber-600 dark:text-amber-400'
    : 'text-green-600 dark:text-green-400';

  const barColor = percent > 100
    ? 'bg-red-500'
    : percent >= 80
    ? 'bg-amber-500'
    : 'bg-green-500';

  const pace = calculatePace(envelope.budget, spent, filterMonth);

  const badgeLabel =
    pace.status === 'ahead' ? 'En avance' :
    pace.status === 'behind' ? 'En retard' :
    pace.status === 'ontrack' ? 'OK' :
    'Cible';

  const badgeCls =
    pace.status === 'ahead' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
    pace.status === 'behind' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
    pace.status === 'ontrack' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
    'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3.5 cursor-pointer active:scale-[0.98] transition-transform"
    >
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2 font-semibold text-sm text-slate-900 dark:text-slate-100">
          <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: envelope.color }} />
          <span className="truncate">{envelope.name}</span>
        </div>
        <div className={`font-bold text-sm ${statusColor}`}>{formatMoney(remaining)}</div>
      </div>

      {envelope.budget > 0 && (
        <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-1.5">
          <div
            className={`h-full rounded-full transition-all duration-300 ${barColor}`}
            style={{ width: `${Math.min(percent, 100)}%` }}
          />
        </div>
      )}

      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
        <span>{formatMoney(spent)} / {formatMoney(envelope.budget)}</span>
        {envelope.budget > 0 && <span className={statusColor}>{percent.toFixed(0)}%</span>}
      </div>

      {envelope.budget > 0 && (
        <div className="mt-2 pt-2 border-t border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{pace.text}</span>
          <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded whitespace-nowrap flex-shrink-0 ${badgeCls}`}>
            {badgeLabel}
          </span>
        </div>
      )}
    </div>
  );
}

import { formatMoney, formatDateTime, weekKey, formatWeekRange, formatMonth, monthKey } from '../lib/helpers';

export default function History({ expenses, envelopes, filterMonth, filterEnv, availableMonths, onChangeMonth, onChangeEnv, onEdit }) {
  // Filtrer
  let filtered = expenses.filter((e) => {
    const mk = e.spent_at.slice(0, 7);
    return mk === filterMonth;
  });
  if (filterEnv !== 'all') {
    filtered = filtered.filter((e) => e.envelope_id === filterEnv);
  }

  // Regrouper par semaine
  const byWeek = new Map();
  filtered.forEach((e) => {
    const wk = weekKey(e.spent_at);
    if (!byWeek.has(wk)) byWeek.set(wk, []);
    byWeek.get(wk).push(e);
  });
  const sortedWeeks = [...byWeek.keys()].sort().reverse();

  const envById = Object.fromEntries(envelopes.map((e) => [e.id, e]));

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <select
          value={filterMonth}
          onChange={(e) => onChangeMonth(e.target.value)}
          className="flex-1 min-w-0 px-2 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm"
        >
          {availableMonths.map((m) => (
            <option key={m} value={m}>{formatMonth(m)}</option>
          ))}
        </select>
        <select
          value={filterEnv}
          onChange={(e) => onChangeEnv(e.target.value)}
          className="flex-1 min-w-0 px-2 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm"
        >
          <option value="all">Toutes</option>
          {envelopes.map((env) => (
            <option key={env.id} value={env.id}>{env.name}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center text-slate-500 dark:text-slate-400 text-sm">
          Aucune dépense pour cette période.
        </div>
      ) : (
        <div className="space-y-3">
          {sortedWeeks.map((wk) => {
            const items = byWeek.get(wk).sort((a, b) => b.spent_at.localeCompare(a.spent_at));
            const total = items.reduce((s, e) => s + Number(e.amount), 0);
            return (
              <div key={wk}>
                <div className="flex justify-between items-center px-3 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 border-b-0 rounded-t-xl text-sm">
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{formatWeekRange(wk)}</div>
                  <div className="font-semibold text-slate-600 dark:text-slate-400">{formatMoney(total)}</div>
                </div>
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-b-xl overflow-hidden">
                  {items.map((exp) => {
                    const env = envById[exp.envelope_id];
                    const envName = env ? env.name : 'Supprimée';
                    const envColor = env ? env.color : '#94a3b8';
                    return (
                      <div
                        key={exp.id}
                        onClick={() => onEdit(exp)}
                        className="flex items-center gap-3 px-3.5 py-3 border-b border-slate-100 dark:border-slate-700 last:border-b-0 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      >
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: envColor }} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                            {exp.note || envName}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">{envName}</div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {formatMoney(Number(exp.amount))}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {formatDateTime(exp.spent_at)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

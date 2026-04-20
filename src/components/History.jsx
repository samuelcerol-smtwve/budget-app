import { formatMoney, formatDateTime, weekKey, formatWeekRange, formatMonth } from '../lib/helpers';
import { getIcon } from '../lib/icons';
import { DEFAULT_ICON_MAP } from '../lib/constants';

export default function History({ expenses, envelopes, filterMonth, filterEnv, availableMonths, onChangeMonth, onChangeEnv, onEdit }) {
  let filtered = expenses.filter((e) => {
    const mk = e.spent_at.slice(0, 7);
    return mk === filterMonth;
  });
  if (filterEnv !== 'all') {
    filtered = filtered.filter((e) => e.envelope_id === filterEnv);
  }

  const byWeek = new Map();
  filtered.forEach((e) => {
    const wk = weekKey(e.spent_at);
    if (!byWeek.has(wk)) byWeek.set(wk, []);
    byWeek.get(wk).push(e);
  });
  const sortedWeeks = [...byWeek.keys()].sort().reverse();

  const envById = Object.fromEntries(envelopes.map((e) => [e.id, e]));

  const selectCls = "flex-1 min-w-0 px-3 py-2.5 rounded-xl bg-night-700 text-cream-100 text-sm focus:outline-none transition-colors";
  const selectStyle = { border: '1px solid rgba(201, 169, 97, 0.12)' };

  return (
    <div>
      <div className="flex gap-2 mb-3">
        <select
          value={filterMonth}
          onChange={(e) => onChangeMonth(e.target.value)}
          className={selectCls}
          style={selectStyle}
        >
          {availableMonths.map((m) => (
            <option key={m} value={m}>{formatMonth(m)}</option>
          ))}
        </select>
        <select
          value={filterEnv}
          onChange={(e) => onChangeEnv(e.target.value)}
          className={selectCls}
          style={selectStyle}
        >
          <option value="all">Toutes</option>
          {envelopes.map((env) => (
            <option key={env.id} value={env.id}>{env.name}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-night-700 rounded-2xl p-8 text-center text-secondary text-sm border-gold">
          Aucune dépense pour cette période.
        </div>
      ) : (
        <div className="space-y-3">
          {sortedWeeks.map((wk) => {
            const items = byWeek.get(wk).sort((a, b) => b.spent_at.localeCompare(a.spent_at));
            const total = items.reduce((s, e) => s + Number(e.amount), 0);
            return (
              <div key={wk}>
                <div className="flex justify-between items-center px-3 py-2.5 bg-night-600 border-b-0 rounded-t-xl text-sm border-gold">
                  <div className="font-medium text-cream-100">{formatWeekRange(wk)}</div>
                  <div className="font-medium text-gold tabular-nums">{formatMoney(total)}</div>
                </div>
                <div className="bg-night-700 rounded-b-xl overflow-hidden border-gold border-t-0">
                  {items.map((exp) => {
                    const env = envById[exp.envelope_id];
                    const envName = env ? env.name : 'Supprimée';
                    const envColor = env ? env.color : '#8B95A7';
                    const iconName = env?.icon || DEFAULT_ICON_MAP[envName] || 'wallet';
                    return (
                      <div
                        key={exp.id}
                        onClick={() => onEdit(exp)}
                        className="flex items-center gap-3 px-3.5 py-3 cursor-pointer hover:bg-night-600/50 transition-colors"
                        style={{ borderBottom: '1px solid rgba(201, 169, 97, 0.08)' }}
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: `${envColor}20` }}
                        >
                          {getIcon(iconName, { color: envColor, size: 14 })}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-cream-100 truncate">
                            {exp.note || envName}
                          </div>
                          <div className="text-[11px] text-secondary">{envName}</div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-sm font-medium text-cream-100 tabular-nums">
                            {formatMoney(Number(exp.amount))}
                          </div>
                          <div className="text-[11px] text-secondary">
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

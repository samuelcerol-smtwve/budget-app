import { formatMoney, calculatePace } from '../lib/helpers';
import { getIcon } from '../lib/icons';
import { DEFAULT_ICON_MAP } from '../lib/constants';

export default function EnvelopeCard({ envelope, spent, filterMonth, onClick }) {
  const remaining = envelope.budget - spent;
  const percent = envelope.budget > 0 ? (spent / envelope.budget) * 100 : 0;
  const pace = calculatePace(envelope.budget, spent, filterMonth);

  // Resolve icon: DB field > name mapping > fallback
  const iconName = envelope.icon || DEFAULT_ICON_MAP[envelope.name] || 'wallet';
  const envColor = envelope.color || '#8B95A7';

  // Status config
  const statusConfig =
    pace.status === 'ahead' ? { label: 'En avance', color: '#7A9B7E' } :
    pace.status === 'behind' ? { label: 'Dépassé', color: '#D89478' } :
    pace.status === 'ontrack' ? { label: 'OK', color: '#8B95A7' } :
    null;

  // Bar color follows semantic
  const barColor =
    percent > 100 ? '#D89478' :
    percent >= 80 ? '#D8976A' :
    envColor;

  return (
    <div
      onClick={onClick}
      className="bg-night-700 rounded-2xl p-4 cursor-pointer active:scale-[0.98] transition-transform border-gold"
    >
      <div className="flex items-center gap-3">
        {/* Icon cube */}
        <div
          className="w-[38px] h-[38px] rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${envColor}26` }}
        >
          {getIcon(iconName, { color: envColor, size: 18 })}
        </div>

        {/* Middle: name + spent info */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-cream-100 truncate">{envelope.name}</div>
          <div className="text-[11px] text-secondary tabular-nums">
            {formatMoney(spent)} de {formatMoney(envelope.budget)}
          </div>
        </div>

        {/* Right: remaining + badge */}
        <div className="text-right flex-shrink-0">
          <div
            className="font-display text-lg tabular-nums"
            style={{ color: percent > 100 ? '#D89478' : '#F1F5F9' }}
          >
            {remaining >= 0 ? '' : ''}{formatMoney(remaining)}
          </div>
          {statusConfig && envelope.budget > 0 && (
            <div
              className="text-[10px] font-medium mt-0.5"
              style={{ color: statusConfig.color }}
            >
              {statusConfig.label}
            </div>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {envelope.budget > 0 && (
        <div className="mt-3 h-[3px] bg-night-600 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${Math.min(percent, 100)}%`,
              background: barColor,
            }}
          />
        </div>
      )}

      {/* Pace details */}
      {envelope.budget > 0 && pace.status !== 'none' && (
        <div className="mt-2.5 pt-2.5 text-[11px] text-secondary tabular-nums"
          style={{ borderTop: '1px dashed rgba(201, 169, 97, 0.12)' }}>
          {pace.text}
        </div>
      )}
    </div>
  );
}

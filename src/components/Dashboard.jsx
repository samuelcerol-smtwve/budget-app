import { formatMoney, formatMonth, getMonthProgress } from '../lib/helpers';
import { getIcon } from '../lib/icons';

export default function Dashboard({ filterMonth, totalBudget, totalSpent, totalRemaining, userName }) {
  const { dayOfMonth, daysInMonth, isCurrent, progress } = getMonthProgress(filterMonth);

  const percentUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const targetDaily = totalBudget > 0 ? totalBudget / daysInMonth : 0;
  const daysLeft = daysInMonth - dayOfMonth;
  const dailyLeft = daysLeft > 0 ? totalRemaining / daysLeft : 0;
  const realDaily = dayOfMonth > 0 ? totalSpent / dayOfMonth : 0;
  const projectedTotal = realDaily * daysInMonth;
  const isOver = projectedTotal > totalBudget;

  const tickPercent = progress * 100;

  return (
    <div className="mb-5">
      {/* Header greeting — outside the bubble */}
      <div className="mb-3">
        <div className="text-xs text-secondary capitalize">{formatMonth(filterMonth)}</div>
        <div className="text-lg font-medium text-cream-100">
          Bonjour{userName ? ` ${userName}` : ''}
        </div>
      </div>

      {/* ── White bubble wrapping the whole recap ── */}
      <div className="bg-white rounded-3xl p-5 space-y-4" style={{ color: '#1A2332' }}>

        {/* Main balance */}
        <div>
          <div className="text-[11px] font-medium" style={{ color: '#8B95A7' }}>Solde restant ce mois</div>
          <div className="flex items-baseline gap-1.5 mt-1 mb-3">
            <span className="font-display text-[52px] font-normal leading-none tabular-nums" style={{ color: '#1A2332' }}>
              {Math.round(totalRemaining).toLocaleString('fr-FR')}
            </span>
            <span className="font-display text-2xl text-gold">€</span>
          </div>

          {/* Progress bar with tick */}
          <div className="relative mb-2.5">
            <div className="h-[5px] rounded-full overflow-hidden" style={{ background: '#E8E4DB' }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(percentUsed, 100)}%`,
                  background: percentUsed > 100 ? '#D89478' : '#C9A961',
                }}
              />
            </div>
            {isCurrent && (
              <div
                className="absolute top-[-2px] w-[1px] h-[9px]"
                style={{ left: `${tickPercent}%`, background: '#1A2332', opacity: 0.3 }}
              />
            )}
          </div>

          {/* Info line */}
          <div className="flex justify-between items-center text-[11px]">
            <span style={{ color: '#8B95A7' }}>
              {percentUsed.toFixed(0)} % utilisé · jour {dayOfMonth}/{daysInMonth}
            </span>
            <span className="text-gold tabular-nums font-medium">
              {formatMoney(totalSpent)} / {formatMoney(totalBudget)}
            </span>
          </div>
        </div>

        {/* Stat cards row */}
        {isCurrent && dayOfMonth > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {/* Rythme actuel */}
            <div className="rounded-2xl p-3.5" style={{ background: '#F5F3EE' }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-[38px] h-[38px] rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(122, 155, 126, 0.15)' }}>
                  {getIcon('zap', { color: '#7A9B7E', size: 18 })}
                </div>
                <span className="text-xs" style={{ color: '#8B95A7' }}>Rythme actuel</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-2xl font-normal tabular-nums" style={{ color: '#1A2332' }}>
                  {Math.round(realDaily)}
                </span>
                <span className="text-xs" style={{ color: '#8B95A7' }}>€/jour</span>
              </div>
            </div>

            {/* Dispo / jour */}
            <div className="rounded-2xl p-3.5" style={{ background: '#F5F3EE' }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-[38px] h-[38px] rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(201, 169, 97, 0.15)' }}>
                  {getIcon('clock', { color: '#C9A961', size: 18 })}
                </div>
                <span className="text-xs" style={{ color: '#8B95A7' }}>Dispo / jour</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-2xl font-normal tabular-nums" style={{ color: '#1A2332' }}>
                  {Math.round(dailyLeft)}
                </span>
                <span className="text-xs" style={{ color: '#8B95A7' }}>€/jour</span>
              </div>
            </div>
          </div>
        )}

        {/* Projection alert */}
        {isCurrent && dayOfMonth > 0 && totalBudget > 0 && (
          <div
            className="rounded-2xl p-3.5 flex items-start gap-3"
            style={{
              background: isOver ? 'rgba(216, 151, 106, 0.08)' : 'rgba(122, 155, 126, 0.08)',
              border: `1px solid ${isOver ? 'rgba(216, 151, 106, 0.20)' : 'rgba(122, 155, 126, 0.20)'}`,
            }}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{
                background: isOver ? 'rgba(216, 151, 106, 0.20)' : 'rgba(122, 155, 126, 0.20)',
              }}
            >
              {getIcon('alert-circle', {
                color: isOver ? '#D8976A' : '#7A9B7E',
                size: 14,
              })}
            </div>
            <div className="text-sm" style={{ color: '#2A2A28' }}>
              {isOver ? (
                <>Léger dépassement. Fin de mois projetée à <span className="font-display font-medium text-gold">{formatMoney(projectedTotal)}</span>.</>
              ) : (
                <>En bonne voie. Fin de mois projetée à <span className="font-display font-medium" style={{ color: '#7A9B7E' }}>{formatMoney(projectedTotal)}</span>.</>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

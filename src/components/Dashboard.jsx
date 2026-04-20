import { formatMoney, formatMonth, getMonthProgress } from '../lib/helpers';

export default function Dashboard({ filterMonth, totalBudget, totalSpent, totalRemaining }) {
  const { dayOfMonth, daysInMonth, isCurrent } = getMonthProgress(filterMonth);

  let projection = null;
  if (totalBudget > 0) {
    const targetDaily = totalBudget / daysInMonth;
    const targetWeekly = totalBudget / (daysInMonth / 7);

    if (!isCurrent || dayOfMonth === 0) {
      projection = (
        <div className="text-xs leading-relaxed">
          🎯 Cible : <strong>{formatMoney(targetDaily)}/j</strong> · <strong>{formatMoney(targetWeekly)}/sem</strong>
        </div>
      );
    } else {
      const realDaily = totalSpent / dayOfMonth;
      const realWeekly = realDaily * 7;
      const projectedTotal = realDaily * daysInMonth;
      const diff = totalBudget - projectedTotal;
      const daysLeft = daysInMonth - dayOfMonth;
      const dailyLeft = daysLeft > 0 ? totalRemaining / daysLeft : 0;

      projection = (
        <div className="text-xs leading-relaxed space-y-0.5">
          <div>🎯 Cible : <strong>{formatMoney(targetDaily)}/j</strong> · <strong>{formatMoney(targetWeekly)}/sem</strong></div>
          <div>📊 Réel : {formatMoney(realDaily)}/j · {formatMoney(realWeekly)}/sem (jour {dayOfMonth}/{daysInMonth})</div>
          <div>💰 Il te reste {formatMoney(dailyLeft)}/j pendant {daysLeft}j</div>
          <div className="pt-1">
            {diff >= 0
              ? <>✅ <strong>En avance</strong>. Fin de mois projetée : {formatMoney(projectedTotal)} ({formatMoney(diff)} sous budget)</>
              : <>⚠️ <strong>En retard</strong>. Fin de mois projetée : {formatMoney(projectedTotal)} ({formatMoney(Math.abs(diff))} au-dessus)</>
            }
          </div>
        </div>
      );
    }
  }

  return (
    <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-2xl p-5 mb-5 shadow-lg">
      <div className="text-xs opacity-80 capitalize mb-2">{formatMonth(filterMonth)}</div>
      <div className="flex items-baseline gap-2 mb-3">
        <div className="text-4xl font-bold tracking-tight">{formatMoney(totalRemaining)}</div>
        <div className="text-sm opacity-80">restant</div>
      </div>
      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/20">
        <div>
          <div className="text-xs opacity-80">Budget total</div>
          <div className="text-lg font-semibold">{formatMoney(totalBudget)}</div>
        </div>
        <div>
          <div className="text-xs opacity-80">Dépensé</div>
          <div className="text-lg font-semibold">{formatMoney(totalSpent)}</div>
        </div>
      </div>
      {projection && (
        <div className="mt-3 p-2.5 bg-white/15 rounded-lg">{projection}</div>
      )}
    </div>
  );
}

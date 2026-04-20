// ============================================
// FORMATAGE
// ============================================

export function formatMoney(amount) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
}

export function formatDateTime(iso) {
  const hasTime = iso.includes('T');
  const d = new Date(iso);
  const ds = d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  if (!hasTime) return ds;
  const ts = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  return `${ds} · ${ts}`;
}

export function formatMonth(monthKey) {
  const [year, month] = monthKey.split('-');
  return new Date(+year, +month - 1, 1).toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  });
}

// ============================================
// DATES / CLÉS
// ============================================

const pad = (n) => String(n).padStart(2, '0');

export function monthKey(date = new Date()) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
}

export function nowDateTimeLocal() {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

// ISO avec fuseau local → utile pour Supabase timestamp
export function toISOFromLocal(localDateTime) {
  // localDateTime format: "YYYY-MM-DDTHH:mm"
  const d = new Date(localDateTime);
  return d.toISOString();
}

// Transforme un ISO UTC en "YYYY-MM-DDTHH:mm" local (pour <input type=datetime-local>)
export function toLocalFromISO(iso) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// ============================================
// SEMAINES
// ============================================

export function getMondayOf(dateInput) {
  const d = new Date(dateInput);
  const day = d.getDay(); // 0 = dim, 1 = lun
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function weekKey(iso) {
  const m = getMondayOf(iso);
  return `${m.getFullYear()}-${pad(m.getMonth() + 1)}-${pad(m.getDate())}`;
}

export function formatWeekRange(mondayStr) {
  const mo = new Date(mondayStr);
  const su = new Date(mo);
  su.setDate(mo.getDate() + 6);
  const opts = { day: '2-digit', month: 'short' };
  const thisMonday = getMondayOf(new Date());
  const prefix = mo.getTime() === thisMonday.getTime() ? 'Cette semaine · ' : '';
  return (
    prefix +
    mo.toLocaleDateString('fr-FR', opts) +
    ' → ' +
    su.toLocaleDateString('fr-FR', opts)
  );
}

// ============================================
// CALCULS RYTHME / PROJECTION
// ============================================

export function getMonthProgress(mKey) {
  const [y, m] = mKey.split('-').map(Number);
  const daysInMonth = new Date(y, m, 0).getDate();
  const now = new Date();
  const current = monthKey(now);
  let dayOfMonth;
  if (mKey < current) dayOfMonth = daysInMonth;
  else if (mKey > current) dayOfMonth = 0;
  else dayOfMonth = now.getDate();
  return {
    daysInMonth,
    dayOfMonth,
    progress: daysInMonth > 0 ? dayOfMonth / daysInMonth : 0,
    isCurrent: mKey === current,
  };
}

/**
 * Calcule le rythme d'une enveloppe :
 * - Cible (théorique) : ce que l'utilisateur devrait dépenser par jour/semaine
 * - Réel : ce qu'il dépense actuellement
 * - Statut : ahead / ontrack / behind / none
 */
export function calculatePace(budget, spent, mKey) {
  const { dayOfMonth, daysInMonth, progress, isCurrent } = getMonthProgress(mKey);
  const targetDaily = daysInMonth > 0 ? budget / daysInMonth : 0;
  const targetWeekly = daysInMonth > 0 ? budget / (daysInMonth / 7) : 0;

  if (!isCurrent || dayOfMonth === 0) {
    return {
      status: 'none',
      targetDaily,
      targetWeekly,
      realDaily: 0,
      realWeekly: 0,
      dailyLeft: 0,
      text: `Cible ${formatMoney(targetDaily)}/j`,
    };
  }

  const expectedSpent = budget * progress;
  const diff = expectedSpent - spent; // > 0 => avance, < 0 => retard
  const realDaily = spent / dayOfMonth;
  const realWeekly = realDaily * 7;
  const daysLeft = daysInMonth - dayOfMonth;
  const remaining = budget - spent;
  const dailyLeft = daysLeft > 0 ? remaining / daysLeft : 0;

  let status;
  if (Math.abs(diff) < budget * 0.03) status = 'ontrack';
  else if (diff > 0) status = 'ahead';
  else status = 'behind';

  return {
    status,
    diff,
    targetDaily,
    targetWeekly,
    realDaily,
    realWeekly,
    dailyLeft,
    daysLeft,
    text: `Cible ${formatMoney(targetDaily)}/j · Réel ${formatMoney(realDaily)}/j · Reste ${formatMoney(dailyLeft)}/j`,
  };
}

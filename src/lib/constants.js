// Enveloppes pré-remplies au premier lancement
export const DEFAULT_ENVELOPES = [
  { name: 'Déjà dépensé (à ventiler)', budget: 0, color: '#8B95A7', icon: 'archive', position: 0 },
  { name: 'Bouffe variable', budget: 450, color: '#7A9B7E', icon: 'utensils', position: 1 },
  { name: 'Sorties / restaurants', budget: 250, color: '#D89478', icon: 'coffee', position: 2 },
  { name: 'Cadeaux / envies', budget: 150, color: '#C58DA5', icon: 'gift', position: 3 },
  { name: 'Imprévus', budget: 200, color: '#89A4C8', icon: 'shield', position: 4 },
  { name: 'Crédit conso', budget: 281, color: '#C9A961', icon: 'credit-card', position: 5 },
];

// Montant pré-rempli au premier lancement (répartir plus tard)
export const INITIAL_SPENT_AMOUNT = 900;
export const INITIAL_SPENT_NOTE = 'Dépenses déjà faites ce mois (à ventiler)';

// Palette de couleurs proposées pour nouvelles enveloppes
export const COLOR_PALETTE = [
  '#7A9B7E', '#D89478', '#C58DA5', '#89A4C8',
  '#C9A961', '#D8976A', '#8B95A7', '#E8D4A0',
];

// Icônes disponibles pour les enveloppes
export const ICON_OPTIONS = [
  'utensils', 'coffee', 'wine', 'gift', 'heart',
  'shield', 'credit-card', 'wallet', 'archive', 'leaf',
];

// Mapping par défaut nom → icône (fallback si pas de champ icon en DB)
export const DEFAULT_ICON_MAP = {
  'Déjà dépensé (à ventiler)': 'archive',
  'Bouffe variable': 'utensils',
  'Sorties / restaurants': 'coffee',
  'Cadeaux / envies': 'gift',
  'Imprévus': 'shield',
  'Crédit conso': 'credit-card',
};

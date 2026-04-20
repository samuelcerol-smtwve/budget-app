// Enveloppes pré-remplies au premier lancement
export const DEFAULT_ENVELOPES = [
  { name: 'Déjà dépensé (à ventiler)', budget: 0, color: '#888780', position: 0 },
  { name: 'Bouffe variable', budget: 450, color: '#1D9E75', position: 1 },
  { name: 'Sorties / restaurants', budget: 250, color: '#BA7517', position: 2 },
  { name: 'Cadeaux / envies', budget: 150, color: '#D4537E', position: 3 },
  { name: 'Imprévus', budget: 200, color: '#378ADD', position: 4 },
  { name: 'Crédit conso', budget: 281, color: '#7F77DD', position: 5 },
];

// Montant pré-rempli au premier lancement (répartir plus tard)
export const INITIAL_SPENT_AMOUNT = 900;
export const INITIAL_SPENT_NOTE = 'Dépenses déjà faites ce mois (à ventiler)';

// Palette de couleurs proposées pour nouvelles enveloppes
export const COLOR_PALETTE = [
  '#1D9E75', '#BA7517', '#D4537E', '#378ADD',
  '#7F77DD', '#E24B4A', '#0F6E56', '#888780',
];

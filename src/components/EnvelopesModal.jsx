import { useState, useEffect } from 'react';
import Modal from './Modal';
import { COLOR_PALETTE } from '../lib/constants';

export default function EnvelopesModal({ isOpen, onClose, envelopes, onSave }) {
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Clone pour édition locale
      setItems(envelopes.map((e) => ({ ...e })));
    }
  }, [isOpen, envelopes]);

  const update = (idx, field, value) => {
    setItems(items.map((e, i) => {
      if (i !== idx) return e;
      const newVal = field === 'budget' ? (parseFloat(value) || 0) : value;
      return { ...e, [field]: newVal };
    }));
  };

  const remove = (idx) => {
    const env = items[idx];
    const label = env.name || 'cette enveloppe';
    if (!confirm(`Supprimer "${label}" ? Les dépenses associées restent dans l'historique.`)) return;
    setItems(items.filter((_, i) => i !== idx));
  };

  const add = () => {
    const color = COLOR_PALETTE[items.length % COLOR_PALETTE.length];
    setItems([...items, { id: null, name: 'Nouvelle enveloppe', budget: 0, color, position: items.length }]);
  };

  const save = async () => {
    setSaving(true);
    try {
      await onSave(items);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Gérer les enveloppes">
      <div className="space-y-2 mb-3">
        {items.map((env, idx) => (
          <div key={env.id || `new-${idx}`} className="flex items-center gap-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <input
              type="color"
              value={env.color}
              onChange={(e) => update(idx, 'color', e.target.value)}
              className="w-9 h-9 p-1 border border-slate-200 dark:border-slate-700 rounded cursor-pointer"
            />
            <input
              type="text"
              value={env.name}
              onChange={(e) => update(idx, 'name', e.target.value)}
              placeholder="Nom"
              className="flex-1 min-w-0 px-2 py-2 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm"
            />
            <input
              type="number"
              value={env.budget}
              step="1"
              min="0"
              onChange={(e) => update(idx, 'budget', e.target.value)}
              className="w-20 px-2 py-2 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm font-medium"
            />
            <button
              type="button"
              onClick={() => remove(idx)}
              className="text-red-500 hover:text-red-700 text-lg px-2"
              aria-label="Supprimer"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={add}
        className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg font-medium mb-2 hover:bg-slate-200 dark:hover:bg-slate-700"
      >
        + Ajouter une enveloppe
      </button>

      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium disabled:opacity-50"
      >
        {saving ? 'Enregistrement...' : 'Enregistrer'}
      </button>
    </Modal>
  );
}

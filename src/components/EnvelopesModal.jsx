import { useState, useEffect } from 'react';
import Modal from './Modal';
import { COLOR_PALETTE } from '../lib/constants';
import { getIcon } from '../lib/icons';

export default function EnvelopesModal({ isOpen, onClose, envelopes, onSave }) {
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
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
    setItems([...items, { id: null, name: 'Nouvelle enveloppe', budget: 0, color, icon: 'wallet', position: items.length }]);
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
          <div key={env.id || `new-${idx}`} className="flex items-center gap-2 p-3 bg-night-800 rounded-xl">
            <input
              type="color"
              value={env.color}
              onChange={(e) => update(idx, 'color', e.target.value)}
              className="w-9 h-9 p-1 rounded-lg cursor-pointer bg-transparent"
              style={{ border: '1px solid rgba(201, 169, 97, 0.12)' }}
            />
            <input
              type="text"
              value={env.name}
              onChange={(e) => update(idx, 'name', e.target.value)}
              placeholder="Nom"
              className="flex-1 min-w-0 px-2 py-2 rounded-lg bg-night-700 text-cream-100 text-sm focus:outline-none"
              style={{ border: '1px solid rgba(201, 169, 97, 0.12)' }}
            />
            <input
              type="number"
              value={env.budget}
              step="1"
              min="0"
              onChange={(e) => update(idx, 'budget', e.target.value)}
              className="w-20 px-2 py-2 rounded-lg bg-night-700 text-cream-100 text-sm font-medium tabular-nums focus:outline-none"
              style={{ border: '1px solid rgba(201, 169, 97, 0.12)' }}
            />
            <button
              type="button"
              onClick={() => remove(idx)}
              className="text-secondary hover:text-terracotta transition-colors px-1"
              aria-label="Supprimer"
            >
              {getIcon('trash', { size: 16 })}
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={add}
        className="w-full py-3 bg-night-800 text-cream-100 rounded-xl font-medium mb-2 hover:bg-night-600 transition-colors border-gold"
      >
        + Ajouter une enveloppe
      </button>

      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="w-full py-3 bg-gold text-night-800 rounded-xl font-medium disabled:opacity-50 transition-opacity"
      >
        {saving ? 'Enregistrement...' : 'Enregistrer'}
      </button>
    </Modal>
  );
}

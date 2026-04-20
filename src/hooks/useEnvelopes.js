import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { DEFAULT_ENVELOPES, INITIAL_SPENT_AMOUNT, INITIAL_SPENT_NOTE } from '../lib/constants';

export function useEnvelopes(userId) {
  const [envelopes, setEnvelopes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEnvelopes = useCallback(async () => {
    if (!userId) return;
    const { data, error } = await supabase
      .from('envelopes')
      .select('*')
      .eq('user_id', userId)
      .order('position', { ascending: true });

    if (error) {
      console.error('Erreur chargement enveloppes:', error);
      setLoading(false);
      return;
    }

    // Premier lancement : initialiser les enveloppes par défaut et la dépense d'amorçage
    if (data.length === 0) {
      await initializeDefaultData(userId);
      const { data: refreshed } = await supabase
        .from('envelopes')
        .select('*')
        .eq('user_id', userId)
        .order('position', { ascending: true });
      setEnvelopes(refreshed || []);
    } else {
      setEnvelopes(data);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchEnvelopes();
  }, [fetchEnvelopes]);

  const addEnvelope = async (envelope) => {
    const { data, error } = await supabase
      .from('envelopes')
      .insert([{ ...envelope, user_id: userId }])
      .select()
      .single();
    if (error) throw error;
    setEnvelopes([...envelopes, data].sort((a, b) => a.position - b.position));
    return data;
  };

  const updateEnvelope = async (id, changes) => {
    const { data, error } = await supabase
      .from('envelopes')
      .update(changes)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    setEnvelopes(envelopes.map((e) => (e.id === id ? data : e)));
    return data;
  };

  const deleteEnvelope = async (id) => {
    const { error } = await supabase.from('envelopes').delete().eq('id', id);
    if (error) throw error;
    setEnvelopes(envelopes.filter((e) => e.id !== id));
  };

  // Remplace toutes les enveloppes (ajout, modif, suppression en batch)
  const saveEnvelopesBatch = async (newEnvelopes) => {
    const existing = envelopes;
    const existingIds = new Set(existing.map((e) => e.id));
    const newIds = new Set(newEnvelopes.filter((e) => e.id).map((e) => e.id));

    // Supprimer ceux qui n'existent plus
    const toDelete = existing.filter((e) => !newIds.has(e.id));
    for (const env of toDelete) {
      await supabase.from('envelopes').delete().eq('id', env.id);
    }

    // Insert / update
    for (let i = 0; i < newEnvelopes.length; i++) {
      const env = newEnvelopes[i];
      if (env.id && existingIds.has(env.id)) {
        // Update
        await supabase
          .from('envelopes')
          .update({ name: env.name, budget: env.budget, color: env.color, position: i })
          .eq('id', env.id);
      } else {
        // Insert
        await supabase.from('envelopes').insert([{
          user_id: userId,
          name: env.name,
          budget: env.budget,
          color: env.color,
          position: i,
        }]);
      }
    }
    await fetchEnvelopes();
  };

  return {
    envelopes,
    loading,
    refetch: fetchEnvelopes,
    addEnvelope,
    updateEnvelope,
    deleteEnvelope,
    saveEnvelopesBatch,
  };
}

// Initialise les données du premier lancement
async function initializeDefaultData(userId) {
  // 1. Créer les enveloppes par défaut
  const toInsert = DEFAULT_ENVELOPES.map((e) => ({ ...e, user_id: userId }));
  const { data: insertedEnvs, error } = await supabase
    .from('envelopes')
    .insert(toInsert)
    .select();

  if (error) {
    console.error('Erreur création enveloppes par défaut:', error);
    return;
  }

  // 2. Créer la dépense d'amorçage des 900€ dans "Déjà dépensé"
  const preloadEnv = insertedEnvs.find((e) => e.name === 'Déjà dépensé (à ventiler)');
  if (preloadEnv) {
    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 12, 0, 0);
    await supabase.from('expenses').insert([{
      user_id: userId,
      envelope_id: preloadEnv.id,
      amount: INITIAL_SPENT_AMOUNT,
      note: INITIAL_SPENT_NOTE,
      spent_at: firstOfMonth.toISOString(),
    }]);
  }
}

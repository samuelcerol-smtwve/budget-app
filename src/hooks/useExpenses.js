import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useExpenses(userId) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = useCallback(async () => {
    if (!userId) return;
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('user_id', userId)
      .order('spent_at', { ascending: false });

    if (error) {
      console.error('Erreur chargement dépenses:', error);
    } else {
      setExpenses(data || []);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const addExpense = async ({ envelope_id, amount, note, spent_at }) => {
    const { data, error } = await supabase
      .from('expenses')
      .insert([{ user_id: userId, envelope_id, amount, note, spent_at }])
      .select()
      .single();
    if (error) throw error;
    setExpenses([data, ...expenses]);
    return data;
  };

  const updateExpense = async (id, changes) => {
    const { data, error } = await supabase
      .from('expenses')
      .update(changes)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    setExpenses(expenses.map((e) => (e.id === id ? data : e)));
    return data;
  };

  const deleteExpense = async (id) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) throw error;
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  const deleteMonth = async (monthKeyStr) => {
    const [year, month] = monthKeyStr.split('-').map(Number);
    const firstDay = new Date(year, month - 1, 1).toISOString();
    const firstDayNext = new Date(year, month, 1).toISOString();
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('user_id', userId)
      .gte('spent_at', firstDay)
      .lt('spent_at', firstDayNext);
    if (error) throw error;
    await fetchExpenses();
  };

  return {
    expenses,
    loading,
    refetch: fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    deleteMonth,
  };
}

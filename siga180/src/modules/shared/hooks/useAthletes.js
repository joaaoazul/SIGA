// src/modules/shared/hooks/useAthletes.js
import { useState, useEffect } from 'react';

// Hook temporário até integrarmos com Supabase
export const useAthletes = () => {
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock data temporário
  useEffect(() => {
    setAthletes([
      {
        id: 1,
        name: 'João Silva',
        email: 'joao@example.com',
        age: 25,
        goal: 'Ganhar massa muscular',
        status: 'active'
      },
      {
        id: 2,
        name: 'Maria Santos',
        email: 'maria@example.com',
        age: 30,
        goal: 'Perder peso',
        status: 'active'
      }
    ]);
  }, []);

  const addAthlete = async (athleteData) => {
    try {
      setLoading(true);
      // TODO: Implementar com Supabase
      const newAthlete = {
        id: Date.now(),
        ...athleteData,
        status: 'active'
      };
      setAthletes([...athletes, newAthlete]);
      return newAthlete;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAthlete = async (id, updates) => {
    try {
      setLoading(true);
      // TODO: Implementar com Supabase
      setAthletes(athletes.map(a => 
        a.id === id ? { ...a, ...updates } : a
      ));
      return { id, ...updates };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAthlete = async (id) => {
    try {
      setLoading(true);
      // TODO: Implementar com Supabase
      setAthletes(athletes.filter(a => a.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getAthleteById = (id) => {
    return athletes.find(a => a.id === parseInt(id));
  };

  return {
    athletes,
    loading,
    error,
    addAthlete,
    updateAthlete,
    deleteAthlete,
    getAthleteById
  };
};
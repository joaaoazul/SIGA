import React, { createContext, useState, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export const AthleteContext = createContext();

export const AthleteProvider = ({ children }) => {
  const [athletes, setAthletes] = useLocalStorage('athletes', []);
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Add a new athlete
  const addAthlete = (athleteData) => {
    const newAthlete = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: 'active',
      ...athleteData,
    };
    setAthletes(prev => [...prev, newAthlete]);
    return newAthlete;
  };

  // Update an athlete
  const updateAthlete = (id, updates) => {
    setAthletes(prev => 
      prev.map(athlete => 
        athlete.id === id 
          ? { ...athlete, ...updates, updatedAt: new Date().toISOString() } 
          : athlete
      )
    );
  };

  // Delete an athlete
  const deleteAthlete = (id) => {
    setAthletes(prev => prev.filter(athlete => athlete.id !== id));
    if (selectedAthlete?.id === id) {
      setSelectedAthlete(null);
    }
  };

  // Get athlete by ID
  const getAthleteById = (id) => {
    return athletes.find(athlete => athlete.id === parseInt(id));
  };

  // Get active athletes
  const getActiveAthletes = () => {
    return athletes.filter(athlete => athlete.status === 'active');
  };

  // Search athletes
  const searchAthletes = (query) => {
    const lowercaseQuery = query.toLowerCase();
    return athletes.filter(athlete => 
      athlete.name?.toLowerCase().includes(lowercaseQuery) ||
      athlete.email?.toLowerCase().includes(lowercaseQuery)
    );
  };

  // Stats
  const getStats = () => {
    return {
      total: athletes.length,
      active: athletes.filter(a => a.status === 'active').length,
      inactive: athletes.filter(a => a.status === 'inactive').length,
    };
  };

  const value = {
    athletes,
    selectedAthlete,
    loading,
    error,
    setSelectedAthlete,
    addAthlete,
    updateAthlete,
    deleteAthlete,
    getAthleteById,
    getActiveAthletes,
    searchAthletes,
    getStats,
    setLoading,
    setError,
  };

  return (
    <AthleteContext.Provider value={value}>
      {children}
    </AthleteContext.Provider>
  );
};

export default AthleteContext;
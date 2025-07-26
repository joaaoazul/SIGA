import { useContext } from 'react';
import { AthleteContext } from '../context/AthleteContext';

export const useAthletes = () => {
  const context = useContext(AthleteContext);
  
  if (!context) {
    throw new Error('useAthletes must be used within an AthleteProvider');
  }
  
  return context;
};

export default useAthletes;
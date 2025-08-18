// src/modules/trainer/pages/Workouts/components/AthleteSelector.js
import React, { useState } from 'react';
import { Search, Check } from 'lucide-react';

const AthleteSelector = ({ athletes, selectedIds = [], onChange, multiple = true }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAthletes = athletes.filter(athlete =>
    athlete.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleAthlete = (athleteId) => {
    if (multiple) {
      const newSelection = selectedIds.includes(athleteId)
        ? selectedIds.filter(id => id !== athleteId)
        : [...selectedIds, athleteId];
      onChange(newSelection);
    } else {
      onChange([athleteId]);
    }
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Pesquisar atletas..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
        {filteredAthletes.map(athlete => (
          <div
            key={athlete.id}
            onClick={() => toggleAthlete(athlete.id)}
            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
              selectedIds.includes(athlete.id)
                ? 'bg-blue-50 border-blue-500'
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{athlete.name}</p>
                <p className="text-sm text-gray-600">{athlete.goal}</p>
              </div>
              {selectedIds.includes(athlete.id) && (
                <Check className="text-blue-600" size={20} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AthleteSelector;
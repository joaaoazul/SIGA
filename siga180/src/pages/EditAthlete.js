import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Layout from '../components/layout/Layout';
import AthleteForm from '../components/athletes/AthleteForm';
import { useAthletes } from '../hooks/useAthletes';

const EditAthlete = () => {
  const { id } = useParams();
  const { getAthleteById, updateAthlete } = useAthletes();
  const [athlete, setAthlete] = useState(null);

  useEffect(() => {
    const athleteData = getAthleteById(parseInt(id));
    setAthlete(athleteData);
  }, [id, getAthleteById]);

  const handleSubmit = async (formData) => {
    // Update the athlete
    updateAthlete(parseInt(id), formData);
    console.log('Athlete updated:', formData);
  };

  if (!athlete) {
    return (
      <Layout title="Edit Athlete">
        <div className="p-6">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500">Athlete not found</p>
            <Link to="/athletes" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
              Back to Athletes
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={`Edit ${athlete.name}`}>
      <div className="p-6">
        <div className="mb-6">
          <Link
            to="/athletes"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Athletes
          </Link>
          
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Edit Athlete</h1>
          <p className="text-gray-600 mt-1">Update the information for {athlete.name}</p>
        </div>

        <AthleteForm 
          athlete={athlete} 
          onSubmit={handleSubmit} 
          isEditing={true}
        />
      </div>
    </Layout>
  );
};

export default EditAthlete;
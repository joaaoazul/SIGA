import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Layout from '../components/layout/Layout';
import AthleteFormWithMagicLink from '../components/athletes/AthleteForm';
import { useAthletes } from '../hooks/useAthletes';

const AddAthlete = () => {
  const { addAthlete } = useAthletes();

  const handleSubmit = async (formData) => {
    // Add the new athlete
    const newAthlete = addAthlete(formData);
    console.log('New athlete added:', newAthlete);
  };

  return (
    <Layout title="Add New Athlete">
      <div className="p-6">
        <div className="mb-6">
          <Link
            to="/athletes"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Athletes
          </Link>
          
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Add New Athlete</h1>
          <p className="text-gray-600 mt-1">Choose how you want to add a new athlete to your roster</p>
        </div>

        <AthleteFormWithMagicLink onSubmit={handleSubmit} />
      </div>
    </Layout>
  );
};

export default AddAthlete;
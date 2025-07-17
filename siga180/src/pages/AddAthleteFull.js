import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Layout from '../components/layout/Layout';
import AthleteFormEdit from '../components/athletes/AthleteFormEdit';
import { useAthletes } from '../hooks/useAthletes';

const AddAthleteFull = () => {
  const { addAthlete } = useAthletes();
  const [searchParams] = useSearchParams();
  const isFromInvite = searchParams.get('invite') === 'true';

  const handleSubmit = async (formData) => {
    // If from invite, mark as requiring password setup
    if (isFromInvite) {
      formData.requiresPasswordSetup = true;
      formData.status = 'invited';
    }
    
    // Add the new athlete
    const newAthlete = addAthlete(formData);
    console.log('New athlete added:', newAthlete);
  };

  return (
    <Layout title="Add Athlete - Complete Profile">
      <div className="p-6">
        <div className="mb-6">
          <Link
            to="/athletes/new"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Options
          </Link>
          
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Complete Athlete Profile</h1>
          <p className="text-gray-600 mt-1">
            {isFromInvite 
              ? "Fill in all the athlete's information. They will set up their password when they first log in."
              : "Fill in all the athlete's information to create their complete profile."
            }
          </p>
        </div>

        <AthleteFormEdit onSubmit={handleSubmit} />
      </div>
    </Layout>
  );
};

export default AddAthleteFull;
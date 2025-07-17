import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit, 
  User, 
  Mail, 
  Phone,
  Activity,
  BarChart,
  FileText,
  CheckSquare,
  Dumbbell
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import AthleteCheckIn from '../components/athletes/AthleteCheckIn';
import AthleteMetrics from '../components/athletes/AthleteMetrics';
import AthleteProgress from '../components/athletes/AthleteProgress';
import AthleteTraining from '../components/athletes/AthleteTraining';
import { useAthletes } from '../hooks/useAthletes';

const AthleteDetail = () => {
  const { id } = useParams();
  const { getAthleteById } = useAthletes();
  const [athlete, setAthlete] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [checkIns, setCheckIns] = useState([]);
  const [measurements, setMeasurements] = useState([]);

  useEffect(() => {
    const athleteData = getAthleteById(parseInt(id));
    setAthlete(athleteData);

    setCheckIns([
      {
        date: new Date().toISOString(),
        mood: 4,
        energy: 3,
        sleep: 4,
        stress: 2,
        soreness: 3,
        motivation: 5,
        sleepHours: 7.5,
        weight: 75,
        notes: 'Feeling great today!'
      }
    ]);

    setMeasurements([
      {
        date: new Date().toISOString(),
        weight: 75,
        bodyFat: 15,
        muscleMass: 55,
        waist: 82,
        chest: 102,
        shoulders: 115,
        hips: 95
      }
    ]);
  }, [id, getAthleteById]);

  if (!athlete) {
    return (
      <Layout title="Athlete Details">
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'training', label: 'Training', icon: Dumbbell },
    { id: 'checkins', label: 'Check-ins', icon: CheckSquare },
    { id: 'measurements', label: 'Measurements', icon: Activity },
    { id: 'progress', label: 'Progress', icon: BarChart },
    { id: 'documents', label: 'Documents', icon: FileText }
  ];

  return (
    <Layout title={athlete.name}>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/athletes"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Athletes
          </Link>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <img
                  src={athlete.avatar || `https://i.pravatar.cc/150?u=${athlete.id}`}
                  alt={athlete.name}
                  className="h-20 w-20 rounded-full object-cover"
                />
                <div className="ml-6">
                  <h1 className="text-2xl font-bold text-gray-900">{athlete.name}</h1>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Mail className="h-4 w-4 mr-1" />
                      {athlete.email}
                    </span>
                    {athlete.phone && (
                      <span className="flex items-center">
                        <Phone className="h-4 w-4 mr-1" />
                        {athlete.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <Link
                to={`/athletes/${id}/edit`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-lg font-semibold capitalize">{athlete.status || 'Active'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Plan</p>
                <p className="text-lg font-semibold">{athlete.plan || 'No plan'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="text-lg font-semibold">
                  {athlete.startDate ? new Date(athlete.startDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Last Check-in</p>
                <p className="text-lg font-semibold text-green-600">Today</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-6 py-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm text-gray-600">Birth Date</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {athlete.birthDate ? new Date(athlete.birthDate).toLocaleDateString() : 'N/A'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-600">Gender</dt>
                    <dd className="text-sm font-medium text-gray-900 capitalize">{athlete.gender || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-600">Address</dt>
                    <dd className="text-sm font-medium text-gray-900">{athlete.address || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-600">Emergency Contact</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {athlete.emergencyContact || 'N/A'}
                      {athlete.emergencyPhone && ` - ${athlete.emergencyPhone}`}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Training Information</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm text-gray-600">Goals</dt>
                    <dd className="text-sm font-medium text-gray-900">{athlete.goals || 'No goals set'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-600">Medical Conditions</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {athlete.medicalConditions || 'None reported'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-600">Setup Status</dt>
                    <dd className="text-sm font-medium">
                      {athlete.setupCompleted ? (
                        <span className="text-green-600">Profile Complete</span>
                      ) : (
                        <span className="text-orange-600">Pending Setup</span>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {activeTab === 'training' && (
            <AthleteTraining athleteId={athlete.id} currentPlan={athlete.plan} />
          )}

          {activeTab === 'checkins' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Latest Check-in</h3>
                {checkIns.length > 0 ? (
                  <AthleteCheckIn 
                    athleteId={athlete.id} 
                    checkInData={checkIns[0]}
                    isTrainer={true}
                  />
                ) : (
                  <div className="bg-white rounded-lg shadow-sm p-6 text-center text-gray-500">
                    No check-ins yet
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Check-in History</h3>
                <div className="space-y-2">
                  {checkIns.length > 0 ? (
                    checkIns.map((checkIn, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium">
                          {new Date(checkIn.date).toLocaleDateString()}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">Mood: {checkIn.mood}/5</span>
                          <span className="text-sm text-gray-600">Energy: {checkIn.energy}/5</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-4">No check-in history available</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'measurements' && (
            <AthleteMetrics 
              athleteId={athlete.id}
              measurements={measurements}
              onSubmit={(data) => {
                console.log('New measurement:', data);
              }}
            />
          )}

          {activeTab === 'progress' && (
            <AthleteProgress 
              athleteId={athlete.id}
              measurements={measurements}
              checkIns={checkIns}
            />
          )}

          {activeTab === 'documents' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Documents</h3>
              <ul className="divide-y divide-gray-200">
                {[ 
                  { name: 'Training Plan - July.pdf', date: '2025-07-01' },
                  { name: 'Injury Report.pdf', date: '2025-06-15' },
                ].map((doc, idx) => (
                  <li key={idx} className="py-2 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                      <p className="text-xs text-gray-500">Uploaded on {new Date(doc.date).toLocaleDateString()}</p>
                    </div>
                    <button className="text-blue-600 hover:underline text-sm">View</button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AthleteDetail;

import React, { useState } from 'react';
import { 
  Calendar,
  Clock,
  Dumbbell,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Target,
  Repeat,
  TrendingUp
} from 'lucide-react';

const AthleteTraining = ({ athleteId, currentPlan }) => {
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  
  // Mock data - in production this would come from the API
  const [sessions, setSessions] = useState([
    {
      id: 1,
      date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      time: '10:00',
      type: 'Strength Training',
      duration: 60,
      status: 'scheduled',
      focus: 'Upper Body',
      notes: 'Focus on bench press progression'
    },
    {
      id: 2,
      date: new Date(Date.now() + 172800000).toISOString(), // 2 days from now
      time: '18:00',
      type: 'Cardio',
      duration: 45,
      status: 'scheduled',
      focus: 'HIIT',
      notes: 'Interval training on treadmill'
    },
    {
      id: 3,
      date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      time: '10:00',
      type: 'Strength Training',
      duration: 60,
      status: 'completed',
      focus: 'Legs',
      notes: 'Great session, increased squat weight'
    }
  ]);

  const workoutPlan = {
    name: currentPlan || 'Custom Strength Program',
    goal: 'Muscle Gain',
    duration: '12 weeks',
    frequency: '4x per week',
    currentWeek: 4,
    exercises: [
      { day: 'Monday', focus: 'Chest & Triceps', exercises: ['Bench Press', 'Dips', 'Flyes'] },
      { day: 'Tuesday', focus: 'Back & Biceps', exercises: ['Deadlifts', 'Pull-ups', 'Rows'] },
      { day: 'Thursday', focus: 'Legs', exercises: ['Squats', 'Leg Press', 'Lunges'] },
      { day: 'Friday', focus: 'Shoulders & Abs', exercises: ['OHP', 'Lateral Raises', 'Planks'] }
    ]
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'scheduled':
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      scheduled: 'bg-blue-100 text-blue-800'
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`}>
        {getStatusIcon(status)}
        <span className="ml-1 capitalize">{status}</span>
      </span>
    );
  };

  const upcomingSessions = sessions.filter(s => s.status === 'scheduled').sort((a, b) => new Date(a.date) - new Date(b.date));
  const pastSessions = sessions.filter(s => s.status !== 'scheduled').sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="space-y-6">
      {/* Current Training Plan */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Current Training Plan</h3>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            Change Plan
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <Target className="h-5 w-5 mr-2 text-gray-400" />
              {workoutPlan.name}
            </h4>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Goal:</dt>
                <dd className="text-sm font-medium">{workoutPlan.goal}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Duration:</dt>
                <dd className="text-sm font-medium">{workoutPlan.duration}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Frequency:</dt>
                <dd className="text-sm font-medium">{workoutPlan.frequency}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-600">Current Week:</dt>
                <dd className="text-sm font-medium">Week {workoutPlan.currentWeek}/12</dd>
              </div>
            </dl>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Progress</span>
                <span>{Math.round((workoutPlan.currentWeek / 12) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(workoutPlan.currentWeek / 12) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <Repeat className="h-5 w-5 mr-2 text-gray-400" />
              Weekly Schedule
            </h4>
            <div className="space-y-2">
              {workoutPlan.exercises.map((day, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{day.day}</p>
                    <p className="text-xs text-gray-600">{day.focus}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Sessions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Upcoming Sessions</h3>
          <button
            onClick={() => setShowScheduleForm(true)}
            className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-1" />
            Schedule Session
          </button>
        </div>

        {upcomingSessions.length > 0 ? (
          <div className="space-y-3">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(session.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                      <span className="text-sm text-gray-600 flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {session.time}
                      </span>
                      <span className="text-sm text-gray-600">
                        {session.duration} min
                      </span>
                    </div>
                    <p className="font-medium text-gray-900">{session.type}</p>
                    <p className="text-sm text-gray-600">{session.focus}</p>
                    {session.notes && (
                      <p className="text-sm text-gray-500 mt-1">Note: {session.notes}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(session.status)}
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No upcoming sessions scheduled</p>
        )}
      </div>

      {/* Past Sessions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Sessions</h3>
        
        {pastSessions.length > 0 ? (
          <div className="space-y-3">
            {pastSessions.slice(0, 5).map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(session.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">{session.type} - {session.focus}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">{session.duration} min</span>
                  {getStatusBadge(session.status)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No past sessions recorded</p>
        )}
      </div>

      {/* Training Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Week</p>
              <p className="text-2xl font-bold">3/4</p>
              <p className="text-xs text-gray-500">Sessions completed</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold">12</p>
              <p className="text-xs text-gray-500">Total sessions</p>
            </div>
            <Dumbbell className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Adherence</p>
              <p className="text-2xl font-bold">85%</p>
              <p className="text-xs text-gray-500">Attendance rate</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Streak</p>
              <p className="text-2xl font-bold">7</p>
              <p className="text-xs text-gray-500">Days in a row</p>
            </div>
            <CheckCircle className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AthleteTraining;
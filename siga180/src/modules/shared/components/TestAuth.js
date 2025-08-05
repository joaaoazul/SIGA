// =============================================
// TestAuth.js - src/modules/shared/pages/TestAuth.js
// PÁGINA TEMPORÁRIA PARA TESTAR AUTH
// =============================================

import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../../../services/supabase/supabaseClient';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const TestAuth = () => {
  const { user, loading: authLoading, signIn, signOut } = useAuth();
  const [testResults, setTestResults] = useState({});
  const [testing, setTesting] = useState(false);

  const runAuthTests = async () => {
    setTesting(true);
    setTestResults({});
    
    const results = {};
    
    // Test 1: Check Supabase Connection
    try {
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      results.supabaseConnection = !error;
    } catch (e) {
      results.supabaseConnection = false;
    }
    
    // Test 2: Check Current Session
    try {
      const { data: { session } } = await supabase.auth.getSession();
      results.currentSession = !!session;
      results.sessionEmail = session?.user?.email || 'None';
    } catch (e) {
      results.currentSession = false;
    }
    
    // Test 3: Check User Role
    if (user) {
      results.userRole = user.role || 'Not set';
      results.userId = user.id;
    }
    
    // Test 4: Check Auth State
    results.authLoading = authLoading;
    results.userExists = !!user;
    
    // Test 5: Check Protected Routes
    results.canAccessAdmin = user?.role === 'admin';
    results.canAccessTrainer = user?.role === 'trainer';
    results.canAccessAthlete = user?.role === 'athlete';
    
    setTestResults(results);
    setTesting(false);
  };

  const TestRow = ({ label, value, isBoolean = false }) => {
    const icon = isBoolean ? (
      value ? <CheckCircle className="text-green-500" size={20} /> : <XCircle className="text-red-500" size={20} />
    ) : null;
    
    return (
      <div className="flex justify-between items-center py-2 border-b">
        <span className="font-medium">{label}:</span>
        <div className="flex items-center space-x-2">
          {icon}
          <span className={isBoolean ? (value ? 'text-green-600' : 'text-red-600') : ''}>
            {isBoolean ? (value ? 'Yes' : 'No') : value || 'N/A'}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔐 Auth System Test</h1>
        
        {/* Current User Info */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current User Info</h2>
          <div className="space-y-2">
            <TestRow label="Logged In" value={!!user} isBoolean />
            <TestRow label="Email" value={user?.email} />
            <TestRow label="Role" value={user?.role} />
            <TestRow label="User ID" value={user?.id} />
            <TestRow label="Auth Loading" value={authLoading} isBoolean />
          </div>
        </div>
        
        {/* Test Results */}
        {Object.keys(testResults).length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            <div className="space-y-2">
              <TestRow label="Supabase Connection" value={testResults.supabaseConnection} isBoolean />
              <TestRow label="Active Session" value={testResults.currentSession} isBoolean />
              <TestRow label="Session Email" value={testResults.sessionEmail} />
              <TestRow label="Can Access Admin" value={testResults.canAccessAdmin} isBoolean />
              <TestRow label="Can Access Trainer" value={testResults.canAccessTrainer} isBoolean />
              <TestRow label="Can Access Athlete" value={testResults.canAccessAthlete} isBoolean />
            </div>
          </div>
        )}
        
        {/* Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="space-x-4">
            <button
              onClick={runAuthTests}
              disabled={testing}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {testing ? (
                <>
                  <Loader2 className="inline mr-2 animate-spin" size={16} />
                  Testing...
                </>
              ) : (
                'Run Auth Tests'
              )}
            </button>
            
            {user ? (
              <button
                onClick={signOut}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => window.location.href = '/login'}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Go to Login
              </button>
            )}
          </div>
        </div>
        
        {/* Test Different Roles */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Quick Role Tests</h2>
          <p className="text-gray-600 mb-4">Test accounts to verify role-based routing:</p>
          <div className="space-y-2">
            <div className="p-3 bg-gray-50 rounded">
              <strong>Admin:</strong> joaoazu74@gmail.com
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <strong>Trainer:</strong> Create via admin panel
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <strong>Athlete:</strong> Create via trainer invite
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAuth;
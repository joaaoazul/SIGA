import React, { useState, useEffect } from 'react';
import { supabase, testConnection } from '../lib/supabase';
import { Database, CheckCircle, XCircle, Loader } from 'lucide-react';

const TestSupabase = () => {
  const [status, setStatus] = useState('checking');
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    checkConnection();
    checkUser();
  }, []);

  const checkConnection = async () => {
    const isConnected = await testConnection();
    setStatus(isConnected ? 'connected' : 'error');
  };

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const handleLogin = async () => {
    setMessage('');
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      setMessage('✅ Login successful!');
      setUser(data.user);
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setMessage('Logged out');
  };

  const createTestUser = async () => {
    setMessage('Creating test trainer...');
    try {
      // This would normally be done by admin only
      const { data, error } = await supabase.auth.signUp({
        email: 'trainer@test.com',
        password: 'Test123!',
        options: {
          data: {
            name: 'Test Trainer',
            role: 'TRAINER'
          }
        }
      });
      
      if (error) throw error;
      setMessage('✅ Test trainer created! Check your email to confirm.');
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Connection Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Database className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold">Supabase Connection</h2>
          </div>
          
          <div className="flex items-center space-x-2">
            {status === 'checking' && (
              <>
                <Loader className="h-5 w-5 animate-spin text-blue-600" />
                <span>Checking connection...</span>
              </>
            )}
            {status === 'connected' && (
              <>
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-green-600">Connected to Supabase!</span>
              </>
            )}
            {status === 'error' && (
              <>
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="text-red-600">Connection failed - Check your .env file</span>
              </>
            )}
          </div>
        </div>

        {/* Auth Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Authentication Status</h3>
          {user ? (
            <div className="space-y-3">
              <p className="text-green-600">✅ Logged in as: {user.email}</p>
              <p className="text-sm text-gray-600">User ID: {user.id}</p>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          ) : (
            <p className="text-gray-600">Not logged in</p>
          )}
        </div>

        {/* Test Login */}
        {!user && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Test Login</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="trainer@test.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Test123!"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleLogin}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Login
                </button>
                <button
                  onClick={createTestUser}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Create Test Trainer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        {message && (
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm">{message}</p>
          </div>
        )}

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Next Steps:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Ensure Supabase connection is working (green status above)</li>
            <li>Create a test trainer account using the button</li>
            <li>Confirm email in Supabase dashboard (Auth → Users)</li>
            <li>Login with the test account</li>
            <li>Start implementing real authentication in your app</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TestSupabase;
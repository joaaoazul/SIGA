import React from 'react';
import Layout from '../components/layout/Layout';

const Messages = () => {
  return (
    <Layout title="Messages">
      <div className="p-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Messages</h2>
          <p className="text-gray-600">Messages coming soon...</p>
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
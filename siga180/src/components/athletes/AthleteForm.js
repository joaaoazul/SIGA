import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Send,
  Link as LinkIcon,
  Copy,
  Check,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

const AthleteFormWithMagicLink = ({ onSubmit }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('quickInvite'); // 'quickInvite' or 'fullForm'
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);
  const [magicLink, setMagicLink] = useState('');
  const [copied, setCopied] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleQuickInvite = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Generate magic link
      const token = btoa(`${formData.email}-${Date.now()}`).replace(/=/g, '');
      const link = `${window.location.origin}/athlete-setup?token=${token}`;
      
      // Save invite to database
      const inviteData = {
        ...formData,
        status: 'invited',
        inviteToken: token,
        invitedAt: new Date().toISOString(),
        setupCompleted: false
      };
      
      await onSubmit(inviteData);
      
      setMagicLink(link);
      setInviteSent(true);
      
      // In production, this would send an email
      console.log('Sending magic link email to:', formData.email);
      console.log('Magic link:', link);
      
    } catch (error) {
      console.error('Error creating invite:', error);
      setErrors({ submit: 'Failed to create invite. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(magicLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  if (inviteSent) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Invite Sent Successfully!</h3>
          <p className="text-gray-600 mt-2">
            An invitation has been sent to <strong>{formData.email}</strong>
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-700 mb-3">
            The athlete will receive an email with a secure link to complete their profile setup.
            You can also share this link directly:
          </p>
          
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={magicLink}
              readOnly
              className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
            />
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => {
              setInviteSent(false);
              setFormData({ name: '', email: '' });
              setMagicLink('');
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Invite Another
          </button>
          <button
            onClick={() => navigate('/athletes')}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Back to Athletes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Mode Selector */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">How would you like to add this athlete?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setMode('quickInvite')}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              mode === 'quickInvite' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${
                mode === 'quickInvite' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                <Send className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Quick Invite</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Send a magic link for the athlete to complete their own profile
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setMode('fullForm')}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              mode === 'fullForm' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${
                mode === 'fullForm' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                <User className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Complete Profile</h4>
                <p className="text-sm text-gray-600 mt-1">
                  Fill in all athlete details yourself right now
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Quick Invite Form */}
      {mode === 'quickInvite' && (
        <form onSubmit={handleQuickInvite} className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Send Athlete Invite</h3>
          
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Athlete Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  placeholder="john@example.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-900">What happens next?</h4>
                  <ul className="mt-2 text-sm text-blue-700 space-y-1">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>The athlete receives an email with a secure setup link</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>They complete their profile with personal details and preferences</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Once complete, they can access their dashboard and start tracking</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Error message */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {errors.submit}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => navigate('/athletes')}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Invite
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Full Form Mode */}
      {mode === 'fullForm' && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Redirecting to Full Form...</h3>
            <p className="text-gray-600 mb-6">Taking you to the complete athlete profile form.</p>
            <button
              onClick={() => navigate('/athletes/new/full')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue to Full Form
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AthleteFormWithMagicLink;
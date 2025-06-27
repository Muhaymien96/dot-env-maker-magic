
import React, { useState, useEffect } from 'react';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Save, 
  Brain,
  Heart,
  Lightbulb,
  Crown,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuthStore, useProfileStore, useSettingsStore } from '../store';
import { supabase } from '../lib/supabase';

export const ProfileSettings: React.FC = () => {
  const { profile, loading, error, loadProfile, updateProfile } = useProfileStore();
  const { 
    notifications, 
    privacy, 
    appearance,
    updateNotifications, 
    updatePrivacy, 
    updateAppearance
  } = useSettingsStore();
  
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'privacy' | 'appearance' | 'password'>('profile');
  
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    neurodivergent_type: 'none' as 'none' | 'adhd' | 'autism' | 'anxiety' | 'multiple',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (profile) {
      setProfileData({
        full_name: profile.full_name || '',
        email: profile.email || '',
        neurodivergent_type: profile.neurodivergent_type || 'none',
      });
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateProfile(profileData);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordLoading(true);
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      setPasswordLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      setPasswordLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) {
        setPasswordError(error.message);
      } else {
        setPasswordSuccess('Password updated successfully');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      setPasswordError('An error occurred while updating your password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const neurodivergentOptions = [
    { 
      value: 'none', 
      label: 'Not specified', 
      description: 'Standard experience',
      icon: User,
      color: 'gray'
    },
    { 
      value: 'adhd', 
      label: 'ADHD', 
      description: 'Attention-focused features, energy-aware scheduling',
      icon: Lightbulb,
      color: 'yellow'
    },
    { 
      value: 'autism', 
      label: 'Autism', 
      description: 'Sensory-friendly design, routine support',
      icon: Brain,
      color: 'blue'
    },
    { 
      value: 'anxiety', 
      label: 'Anxiety', 
      description: 'Calming interface, gentle reminders',
      icon: Heart,
      color: 'green'
    },
    { 
      value: 'multiple', 
      label: 'Multiple conditions', 
      description: 'Adaptive features for multiple neurodivergent traits',
      icon: Crown,
      color: 'purple'
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'password', label: 'Password', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h3 className="text-2xl font-bold text-gray-900">Settings</h3>
        <p className="text-gray-600 mt-1">Customize your MindMesh experience</p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Mobile Tab Navigation - Horizontal Scroll */}
      <div className="border-b border-gray-200 overflow-x-auto">
        <nav className="flex space-x-2 sm:space-x-8 min-w-max px-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center space-x-1 sm:space-x-2 py-2 px-2 sm:px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                activeTab === id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{label.length > 8 ? label.substring(0, 8) + '...' : label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileData.full_name}
                    onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
            </div>

            {/* Neurodivergent Profile Section */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Brain className="h-5 w-5 text-indigo-600" />
                <span>Neurodivergent Profile</span>
              </h4>
              <p className="text-gray-600 mb-6 text-sm">
                Help us personalize your experience by sharing your neurodivergent profile.
              </p>
              
              <div className="grid gap-3 sm:gap-4">
                {neurodivergentOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <label
                      key={option.value}
                      className={`relative flex items-start p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${
                        profileData.neurodivergent_type === option.value
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="neurodivergent_type"
                        value={option.value}
                        checked={profileData.neurodivergent_type === option.value}
                        onChange={(e) => setProfileData({ 
                          ...profileData, 
                          neurodivergent_type: e.target.value as any 
                        })}
                        className="sr-only"
                      />
                      <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center mr-3 sm:mr-4 ${
                        profileData.neurodivergent_type === option.value
                          ? 'bg-indigo-100'
                          : 'bg-gray-100'
                      }`}>
                        <IconComponent className={`h-4 w-4 sm:h-5 sm:w-5 ${
                          profileData.neurodivergent_type === option.value
                            ? 'text-indigo-600'
                            : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-grow">
                        <h5 className={`font-medium text-sm sm:text-base ${
                          profileData.neurodivergent_type === option.value
                            ? 'text-indigo-900'
                            : 'text-gray-900'
                        }`}>
                          {option.label}
                        </h5>
                        <p className={`text-xs sm:text-sm ${
                          profileData.neurodivergent_type === option.value
                            ? 'text-indigo-700'
                            : 'text-gray-600'
                        }`}>
                          {option.description}
                        </p>
                      </div>
                      {profileData.neurodivergent_type === option.value && (
                        <div className="absolute top-2 right-2 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'password' && (
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-900">Change Password</h4>
            
            {passwordError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">{passwordError}</p>
              </div>
            )}
            
            {passwordSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 text-sm">{passwordSuccess}</p>
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handlePasswordChange}
                disabled={passwordLoading || !passwordData.newPassword || !passwordData.confirmPassword}
                className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                <Lock className="h-4 w-4" />
                <span>{passwordLoading ? 'Updating...' : 'Update Password'}</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-900">Notification Preferences</h4>
            
            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex-grow pr-4">
                    <p className="font-medium text-gray-900 text-sm sm:text-base">
                      {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {key === 'smart_reminders' && 'AI-powered contextual reminders'}
                      {key === 'task_deadlines' && 'Notifications for approaching deadlines'}
                      {key === 'mood_check_ins' && 'Gentle reminders to log your mood'}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => updateNotifications({ [key]: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-900">Privacy Settings</h4>
            
            <div className="space-y-4">
              {Object.entries(privacy).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <div className="flex-grow pr-4">
                    <p className="font-medium text-gray-900 text-sm sm:text-base">
                      {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {key === 'analytics' && 'Allow usage analytics to help us improve'}
                      {key === 'personalization' && 'Use your data to provide personalized experiences'}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => updatePrivacy({ [key]: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="space-y-8">
            <h4 className="text-lg font-semibold text-gray-900">Appearance & Accessibility</h4>
            
            {/* Accessibility Features */}
            <div className="space-y-6">
              <h5 className="font-medium text-gray-900">Accessibility</h5>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {[
                  { key: 'high_contrast_mode', label: 'High Contrast Mode', desc: 'Increase contrast for better visibility' },
                  { key: 'colorblind_mode', label: 'Colorblind Mode', desc: 'Adjust colors for colorblind users' },
                  { key: 'reduced_motion', label: 'Reduced Motion', desc: 'Minimize animations and transitions' },
                  { key: 'minimalist_mode', label: 'Minimalist Mode', desc: 'Reduce visual clutter and distractions' }
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="flex-grow pr-4">
                      <p className="font-medium text-gray-900 text-sm">{label}</p>
                      <p className="text-xs text-gray-600">{desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={appearance[key as keyof typeof appearance] as boolean}
                        onChange={(e) => updateAppearance({ [key]: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Text & Reading */}
            <div className="space-y-6">
              <h5 className="font-medium text-gray-900">Text & Reading</h5>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Text Size</label>
                  <select
                    value={appearance.text_size}
                    onChange={(e) => updateAppearance({ text_size: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="xlarge">Extra Large</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Line Spacing</label>
                  <select
                    value={appearance.line_spacing}
                    onChange={(e) => updateAppearance({ line_spacing: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="normal">Normal</option>
                    <option value="wide">Wide</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Font Preference</label>
                  <select
                    value={appearance.font_preference}
                    onChange={(e) => updateAppearance({ font_preference: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="default">Default</option>
                    <option value="dyslexia_friendly">Dyslexia Friendly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Reading Background</label>
                  <input
                    type="color"
                    value={appearance.background_color_for_reading}
                    onChange={(e) => updateAppearance({ background_color_for_reading: e.target.value })}
                    className="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Other Preferences */}
            <div className="space-y-6">
              <h5 className="font-medium text-gray-900">Other Preferences</h5>
              
              <div className="flex items-center justify-between">
                <div className="flex-grow pr-4">
                  <p className="font-medium text-gray-900 text-sm">Mood-Responsive Colors</p>
                  <p className="text-xs text-gray-600">Adapt interface colors based on your mood</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={appearance.mood_responsive_colors}
                    onChange={(e) => updateAppearance({ mood_responsive_colors: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

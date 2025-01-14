import React, { useState, useEffect } from 'react';
import { Save, User, Mail, Lock } from 'lucide-react';
import Swal from 'sweetalert2';

const ProfileView = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/admin/profile');
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();
      setProfileData(prevData => ({
        ...prevData,
        name: data.name,
        email: data.email
      }));
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load profile data'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/admin/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
        },
        body: JSON.stringify({
          name: profileData.name,
          email: profileData.email,
          currentPassword: profileData.currentPassword,
          newPassword: profileData.newPassword,
          newPassword_confirmation: profileData.confirmPassword
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update profile');
      }

      setIsEditing(false);
      setShowPasswordFields(false);
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Profile updated successfully!'
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to update profile'
      });
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold dark:text-white">Admin Profile</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center mb-6">
                <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <User className="w-16 h-16 text-gray-400" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <User className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      disabled={!isEditing}
                      className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      disabled={!isEditing}
                      className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-800"
                    />
                  </div>
                </div>

                

                {isEditing && (
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => setShowPasswordFields(!showPasswordFields)}
                      className="text-red-500 hover:text-red-600 dark:text-red-400 flex items-center space-x-2"
                    >
                      <Lock className="w-4 h-4" />
                      <span>{showPasswordFields ? 'Hide' : 'Change'} Password</span>
                    </button>

                    {showPasswordFields && (
                      <div className="mt-4 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Current Password
                          </label>
                          <input
                            type="password"
                            value={profileData.currentPassword}
                            onChange={(e) => setProfileData({ ...profileData, currentPassword: e.target.value })}
                            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            New Password
                          </label>
                          <input
                            type="password"
                            value={profileData.newPassword}
                            onChange={(e) => setProfileData({ ...profileData, newPassword: e.target.value })}
                            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            value={profileData.confirmPassword}
                            onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
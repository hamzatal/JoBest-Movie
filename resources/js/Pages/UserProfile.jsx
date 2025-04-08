import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Pen, 
  Save, 
  Camera, 
  UserCircle2,
  FileText,
  Calendar,
  MapPin,
  Phone,
  Link,
  Lock,
  AlertTriangle,
  X
} from 'lucide-react';
import { useForm } from '@inertiajs/react';
import NavBar from '../components/Layouts/NavBar';

const UserProfile = ({ user, errors }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [showDeactivateModal, setShowDeactivateModal] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    const { data, setData, post, processing } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        avatar: null,
        bio: user?.bio || 'No bio available',
        phone: user?.phone || '',
        location: user?.location || '',
        website: user?.website || '',
        birthday: user?.birthday || '',
        _method: 'PATCH',
    });

    const { data: pwData, setData: setPwData, post: postPassword, processing: processingPw, reset: resetPw } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
        _method: 'PUT',
    });

    const { data: deactivateData, setData: setDeactivateData, post: postDeactivate, processing: processingDeactivate } = useForm({
        password: '',
        deactivation_reason: '',
        _method: 'PUT',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPwData(name, value);
    };

    const handleDeactivateChange = (e) => {
        const { name, value } = e.target;
        setDeactivateData(name, value);
    };

    const handleAvatarUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('avatar', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = (e) => {
        e.preventDefault();
        post(route('profile.update'), {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditing(false);
                setPreviewImage(null);
            },
        });
    };

    const handleUpdatePassword = (e) => {
        e.preventDefault();
        postPassword(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => {
                resetPw();
            },
        });
    };

    const handleDeactivateAccount = (e) => {
        e.preventDefault();
        postDeactivate(route('profile.deactivate'), {
            preserveScroll: true,
            onSuccess: () => {
                // Redirect happens server-side
            },
        });
    };

    const displayAvatar = previewImage || user?.avatar || '/images/avatar.jpg';
    
    const renderTabContent = () => {
        switch(activeTab) {
            case 'profile':
                return renderProfileTab();
            case 'security':
                return renderSecurityTab();
            case 'account':
                return renderAccountTab();
            default:
                return renderProfileTab();
        }
    };

    const renderProfileTab = () => (
        <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Avatar Section */}
                <div className="flex flex-col items-center">
                    <div className="relative group">
                        <img 
                            src={displayAvatar}
                            alt="Profile Avatar" 
                            className="w-48 h-48 rounded-full object-cover border-4 border-red-700 shadow-lg"
                        />
                        {isEditing && (
                            <label className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                                <Camera className="text-white h-10 w-10" />
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden"
                                    onChange={handleAvatarUpload}
                                />
                            </label>
                        )}
                    </div>
                    {errors?.avatar && (
                        <p className="mt-2 text-red-500 text-sm">{errors.avatar}</p>
                    )}
                    
                    {!isEditing && (
                        <div className="mt-4 text-center">
                            <p className="text-gray-400 text-sm">
                                Member since: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                            </p>
                            {user?.last_login && (
                                <p className="text-gray-400 text-sm mt-1">
                                    Last login: {new Date(user.last_login).toLocaleString()}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Profile Details */}
                <div className="flex-grow space-y-6">
                    {isEditing ? (
                        <>
                            <div className="flex items-center space-x-3">
                                <User className="w-6 h-6 text-red-600" />
                                <div className="flex-grow">
                                    <label className="block text-sm font-medium mb-2 text-white">Name</label>
                                    <input 
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-600 transition-all"
                                    />
                                    {errors?.name && (
                                        <p className="mt-2 text-red-500 text-sm">{errors.name}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Mail className="w-6 h-6 text-red-600" />
                                <div className="flex-grow">
                                    <label className="block text-sm font-medium mb-2 text-white">Email</label>
                                    <input 
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-600 transition-all"
                                    />
                                    {errors?.email && (
                                        <p className="mt-2 text-red-500 text-sm">{errors.email}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="w-6 h-6 text-red-600" />
                                <div className="flex-grow">
                                    <label className="block text-sm font-medium mb-2 text-white">Phone</label>
                                    <input 
                                        type="tel"
                                        name="phone"
                                        value={data.phone}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-600 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Calendar className="w-6 h-6 text-red-600" />
                                <div className="flex-grow">
                                    <label className="block text-sm font-medium mb-2 text-white">Birthday</label>
                                    <input 
                                        type="date"
                                        name="birthday"
                                        value={data.birthday}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-600 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <MapPin className="w-6 h-6 text-red-600" />
                                <div className="flex-grow">
                                    <label className="block text-sm font-medium mb-2 text-white">Location</label>
                                    <input 
                                        type="text"
                                        name="location"
                                        value={data.location}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-600 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Link className="w-6 h-6 text-red-600" />
                                <div className="flex-grow">
                                    <label className="block text-sm font-medium mb-2 text-white">Website</label>
                                    <input 
                                        type="url"
                                        name="website"
                                        value={data.website}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-600 transition-all"
                                        placeholder="https://"
                                    />
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <FileText className="w-6 h-6 text-red-600 mt-2" />
                                <div className="flex-grow">
                                    <label className="block text-sm font-medium mb-2 text-white">Bio</label>
                                    <textarea 
                                        name="bio"
                                        value={data.bio}
                                        onChange={handleInputChange}
                                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 h-24 text-white focus:ring-2 focus:ring-red-600 transition-all"
                                    />
                                    {errors?.bio && (
                                        <p className="mt-2 text-red-500 text-sm">{errors.bio}</p>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <div className="flex items-center space-x-3">
                                    <User className="w-6 h-6 text-red-600" />
                                    <div>
                                        <h2 className="text-xl font-semibold text-white">{data.name}</h2>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center space-x-3">
                                    <Mail className="w-6 h-6 text-red-600" />
                                    <div>
                                        <p className="text-md text-white">{data.email}</p>
                                    </div>
                                </div>
                            </div>
                            {data.phone && (
                                <div>
                                    <div className="flex items-center space-x-3">
                                        <Phone className="w-6 h-6 text-red-600" />
                                        <div>
                                            <p className="text-md text-white">{data.phone}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {data.birthday && (
                                <div>
                                    <div className="flex items-center space-x-3">
                                        <Calendar className="w-6 h-6 text-red-600" />
                                        <div>
                                            <p className="text-md text-white">{new Date(data.birthday).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {data.location && (
                                <div>
                                    <div className="flex items-center space-x-3">
                                        <MapPin className="w-6 h-6 text-red-600" />
                                        <div>
                                            <p className="text-md text-white">{data.location}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {data.website && (
                                <div>
                                    <div className="flex items-center space-x-3">
                                        <Link className="w-6 h-6 text-red-600" />
                                        <div>
                                            <a href={data.website} target="_blank" rel="noopener noreferrer" className="text-md text-blue-400 hover:text-blue-300 underline">{data.website}</a>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div>
                                <div className="flex items-start space-x-3">
                                    <FileText className="w-6 h-6 text-red-600 mt-1" />
                                    <div>
                                        <p className="text-md text-white">{data.bio}</p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </form>
    );

    const renderSecurityTab = () => (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <Lock className="w-6 h-6 text-red-600 mr-2" />
                Change Password
            </h2>
            
            <form onSubmit={handleUpdatePassword} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium mb-2 text-white">Current Password</label>
                    <input 
                        type="password"
                        name="current_password"
                        value={pwData.current_password}
                        onChange={handlePasswordChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-600 transition-all"
                    />
                    {errors?.current_password && (
                        <p className="mt-2 text-red-500 text-sm">{errors.current_password}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-white">New Password</label>
                    <input 
                        type="password"
                        name="password"
                        value={pwData.password}
                        onChange={handlePasswordChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-600 transition-all"
                    />
                    {errors?.password && (
                        <p className="mt-2 text-red-500 text-sm">{errors.password}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2 text-white">Confirm New Password</label>
                    <input 
                        type="password"
                        name="password_confirmation"
                        value={pwData.password_confirmation}
                        onChange={handlePasswordChange}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-600 transition-all"
                    />
                </div>

                <div className="pt-4">
                    <button 
                        type="submit"
                        disabled={processingPw}
                        className="bg-red-700 hover:bg-red-800 text-white font-medium px-6 py-2 rounded-lg transition-colors shadow-md flex items-center"
                    >
                        {processingPw ? 'Updating...' : 'Update Password'}
                    </button>
                </div>
            </form>
        </div>
    );

    const renderAccountTab = () => (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <AlertTriangle className="w-6 h-6 text-red-600 mr-2" />
                Account Management
            </h2>
            
            <div className="border border-red-800 rounded-lg p-5 bg-gray-900">
                <h3 className="text-lg font-semibold text-red-500 mb-4">Deactivate Account</h3>
                <p className="text-gray-300 mb-4">
                    Deactivating your account will make your profile and content inaccessible. 
                    You can reactivate your account at any time by logging in again.
                </p>
                
                <button 
                    onClick={() => setShowDeactivateModal(true)}
                    className="bg-transparent hover:bg-red-900 text-red-500 border border-red-500 font-medium px-5 py-2 rounded-lg transition-colors"
                >
                    Deactivate Account
                </button>
            </div>
        </div>
    );

    return (
        <div className="bg-gray-900 min-h-screen">
            <NavBar isDarkMode={true} />
            
            <div className="container mx-auto px-4 py-8 pt-48">
                <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-2xl border border-gray-700 p-8">
                    <div className="flex items-center justify-between mb-10">
                        <div className="flex items-center space-x-4">
                            <UserCircle2 className="w-10 h-10 text-red-600" />
                            <h1 className="text-3xl font-bold text-white">Profile</h1>
                        </div>
                        {activeTab === 'profile' && (
                            !isEditing ? (
                                <button 
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg transition-all transform hover:scale-105 shadow-md"
                                >
                                    <Pen className="mr-2 h-5 w-5" /> Edit Profile
                                </button>
                            ) : (
                                <div className="flex space-x-2">
                                    <button 
                                        onClick={() => {
                                            setIsEditing(false);
                                            setPreviewImage(null);
                                        }}
                                        className="flex items-center text-gray-300 hover:bg-gray-700 px-4 py-2 rounded-lg transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={handleSaveProfile}
                                        disabled={processing}
                                        className="flex items-center bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg transition-all transform hover:scale-105 shadow-md"
                                    >
                                        <Save className="mr-2 h-5 w-5" /> {processing ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            )
                        )}
                    </div>

                    {/* Tabs Navigation */}
                    <div className="flex border-b border-gray-700 mb-6">
                        <button 
                            onClick={() => setActiveTab('profile')}
                            className={`py-3 px-5 font-medium ${activeTab === 'profile' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400 hover:text-white'}`}
                        >
                            Profile
                        </button>
                        <button 
                            onClick={() => setActiveTab('security')}
                            className={`py-3 px-5 font-medium ${activeTab === 'security' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400 hover:text-white'}`}
                        >
                            Security
                        </button>
                        <button 
                            onClick={() => setActiveTab('account')}
                            className={`py-3 px-5 font-medium ${activeTab === 'account' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400 hover:text-white'}`}
                        >
                            Account
                        </button>
                    </div>

                    {/* Tab Content */}
                    {renderTabContent()}
                </div>
            </div>

            {/* Deactivate Account Modal */}
            {showDeactivateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-xl max-w-md w-full p-6 border border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white">Deactivate Account</h3>
                            <button onClick={() => setShowDeactivateModal(false)} className="text-gray-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <form onSubmit={handleDeactivateAccount}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2 text-white">Password</label>
                                <input 
                                    type="password"
                                    name="password"
                                    value={deactivateData.password}
                                    onChange={handleDeactivateChange}
                                    required
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-600"
                                />
                                {errors?.deactivate_password && (
                                    <p className="mt-2 text-red-500 text-sm">{errors.deactivate_password}</p>
                                )}
                            </div>
                            
                            <div className="mb-6">
                                <label className="block text-sm font-medium mb-2 text-white">Reason for deactivation (optional)</label>
                                <textarea
                                    name="deactivation_reason"
                                    value={deactivateData.deactivation_reason}
                                    onChange={handleDeactivateChange}
                                    rows="3"
                                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-600"
                                ></textarea>
                            </div>
                            
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowDeactivateModal(false)}
                                    className="px-4 py-2 text-gray-300 hover:text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processingDeactivate}
                                    className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                                >
                                    {processingDeactivate ? 'Processing...' : 'Deactivate Account'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserProfile;
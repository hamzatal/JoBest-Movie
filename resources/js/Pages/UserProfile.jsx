import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Pen, 
  Save, 
  Camera, 
  UserCircle2,
  FileText 
} from 'lucide-react';
import { useForm } from '@inertiajs/react';
import NavBar from "../components/NavBar";

const UserProfile = ({ user, errors }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    const { data, setData, post, processing } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        avatar: null,
        bio: user?.bio || 'No bio available',
        _method: 'PATCH',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
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

    const displayAvatar = previewImage || user?.avatar || '/images/avatar.jpg';

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
                        {!isEditing ? (
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
                        )}
                    </div>

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
                                        <div className="mt-4">
                                            <div className="flex items-center space-x-3">
                                                <Mail className="w-6 h-6 text-red-600" />
                                                <div>
                                                    <p className="text-md text-white">{data.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <div className="flex items-start space-x-3">
                                                <FileText className="w-6 h-6 text-red-600 mt-2" />
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
                </div>
            </div>
        </div>
    );
}

export default UserProfile;

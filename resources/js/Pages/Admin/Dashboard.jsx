import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { 
  Users, Film, Calendar, Settings, 
  LogOut, Menu, X, Bell, Search,
  BarChart2, Activity, TrendingUp,
  Clapperboard, Plus, Edit, Trash,
  Filter, SquareStack, MessageSquare,  Send, User, Mail, Lock, Phone, MapPin, Save ,Eye
} from 'lucide-react';
import Swal from 'sweetalert2';
import ProfileView from './ProfileView';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');
  const [movies, setMovies] = useState([]);
  const [users, setUsers] = useState([]);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [showMovieModal, setShowMovieModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [movieFormData, setMovieFormData] = useState({
    title: '',
    category_id: '',
    genre: '',
    description: '',
    release_date: '',
    rating: '',
    poster_url: '',
    trailer_url: '',
    director: '',
    cast: ''
  });
  const [categoryFormData, setCategoryFormData] = useState({
    name: ''
  });

  const showSuccessAlert = (message) => {
    Swal.fire({
      title: 'Success!',
      text: message,
      icon: 'success',
      confirmButtonColor: '#EF4444',
    });
  };

  const showErrorAlert = (message) => {
    Swal.fire({
      title: 'Error!',
      text: message,
      icon: 'error',
      confirmButtonColor: '#EF4444',
    });
  };

  const showConfirmDialog = async (message) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#9CA3AF',
      confirmButtonText: 'Yes, delete it!'
    });
    return result.isConfirmed;
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);
  const getCsrfToken = () => {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  };

  const fetchDashboardData = async () => {
    try {
      const headers = {
        'X-CSRF-TOKEN': getCsrfToken(),
        'Accept': 'application/json',
      };

      const moviesResponse = await fetch('/api/movies', { headers });
      const moviesData = await moviesResponse.json();
      setMovies(moviesData);

      const usersResponse = await fetch('/api/users', { headers });
      const usersData = await usersResponse.json();
      setUsers(usersData.data);
      setTotalUsers(usersData.data.length);
      setActiveUsers(usersData.data.filter(user => user.is_active).length);

      const categoriesResponse = await fetch('/api/categories', { headers });
      const categoriesData = await categoriesResponse.json();
      setCategories(categoriesData);

      const contactsResponse = await fetch('/api/contacts', { headers });
      const contactsData = await contactsResponse.json();
      setContacts(contactsData);

      const watchedMoviesResponse = await fetch('/api/watched-movies', { headers });
    const watchedMoviesData = await watchedMoviesResponse.json();
    setWatchedMovies(watchedMoviesData);

      const revenueResponse = await fetch('/api/subscriptions/revenue', { headers });  
      const revenueData = await revenueResponse.json();
      setRevenue(revenueData.total_revenue);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    alert('Error fetching data. Please try again.');
  }
  };
  
  const handleLogout = async () => {
    await fetch('/admin/logout', {
        method: 'POST',
        headers: {
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
        }
    });
};

  // Update handleMovieSubmit with proper headers and error handling
  const handleMovieSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = selectedMovie ? `/api/movies/${selectedMovie.id}` : '/api/movies';
      const method = selectedMovie ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': getCsrfToken(),
          'Accept': 'application/json',
        },
        body: JSON.stringify(movieFormData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error saving movie');
      }

      setShowMovieModal(false);
      fetchDashboardData();
      resetMovieForm();
      showSuccessAlert(selectedMovie ? 'Movie updated successfully!' : 'Movie created successfully!');
    } catch (error) {
      showErrorAlert(error.message || 'Error saving movie. Please try again.');
    }
  };

  // Update handleCategorySubmit with proper headers and error handling
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      const url = selectedCategory ? `/api/categories/${selectedCategory.id}` : '/api/categories';
      const method = selectedCategory ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': getCsrfToken(),
          'Accept': 'application/json',
        },
        body: JSON.stringify(categoryFormData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error saving category');
      }

      setShowCategoryModal(false);
      fetchDashboardData();
      resetCategoryForm();
      showSuccessAlert(selectedCategory ? 'Category updated successfully!' : 'Category created successfully!');
    } catch (error) {
      showErrorAlert(error.message || 'Error saving category. Please try again.');
    }
  };

  // Update delete handlers with proper headers and error handling
  const handleDeleteMovie = async (movieId) => {
    const confirmed = await showConfirmDialog('You won\'t be able to revert this!');
    if (confirmed) {
      try {
        const response = await fetch(`/api/movies/${movieId}`, {
          method: 'DELETE',
          headers: {
            'X-CSRF-TOKEN': getCsrfToken(),
            'Accept': 'application/json',
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error deleting movie');
        }

        fetchDashboardData();
        showSuccessAlert('Movie deleted successfully!');
      } catch (error) {
        showErrorAlert(error.message || 'Error deleting movie. Please try again.');
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmed = await showConfirmDialog('You won\'t be able to revert this!');
    if (confirmed) {
      try {
        const response = await fetch(`/api/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'X-CSRF-TOKEN': getCsrfToken(),
            'Accept': 'application/json',
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error deleting user');
        }

        fetchDashboardData();
        showSuccessAlert('User deleted successfully!');
      } catch (error) {
        showErrorAlert(error.message || 'Error deleting user. Please try again.');
      }
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    const confirmed = await showConfirmDialog('You won\'t be able to revert this!');
    if (confirmed) {
      try {
        const response = await fetch(`/api/categories/${categoryId}`, {
          method: 'DELETE',
          headers: {
            'X-CSRF-TOKEN': getCsrfToken(),
            'Accept': 'application/json',
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error deleting category');
        }

        fetchDashboardData();
        showSuccessAlert('Category deleted successfully!');
      } catch (error) {
        showErrorAlert(error.message || 'Error deleting category. Please try again.');
      }
    }
  };

   // Contact handlers
   const handleDeleteContact = async (contactId) => {
    const confirmed = await showConfirmDialog('You won\'t be able to revert this!');
    if (confirmed) {
      try {
        const response = await fetch(`/api/contacts/${contactId}`, {
          method: 'DELETE',
          headers: {
            'X-CSRF-TOKEN': getCsrfToken(),
            'Accept': 'application/json',
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error deleting contact');
        }

        fetchDashboardData();
        showSuccessAlert('Contact deleted successfully!');
      } catch (error) {
        showErrorAlert(error.message || 'Error deleting contact. Please try again.');
      }
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    // Here you would typically integrate with your email service
    showSuccessAlert(`Reply sent to ${selectedContact.email}`);
    setShowReplyModal(false);
    setReplyMessage('');
    setSelectedContact(null);
  };

  const resetMovieForm = () => {
    setMovieFormData({
      title: '',
      category_id: '',
      genre: '',
      description: '',
      release_date: '',
      rating: '',
      poster_url: '',
      trailer_url: '',
      director: '',
      cast: ''
    });
    setSelectedMovie(null);
  };

  const resetCategoryForm = () => {
    setCategoryFormData({
      name: ''
    });
    setSelectedCategory(null);
  };

  const filteredMovies = movies.filter(movie => 
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.director?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredContacts = contacts.filter(contact =>
    contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.subject?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const ContactsView = () => (
    <div className="p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold dark:text-white">Contact Messages</h2>
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredContacts.map((contact) => (
                  <tr key={contact.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{contact.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{contact.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{contact.subject}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{contact.message}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedContact(contact);
                          setShowReplyModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                      >
                        Reply
                      </button>
                      <button
                        onClick={() => handleDeleteContact(contact.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Reply Modal */}
      {showReplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold dark:text-white">
                  Reply to {selectedContact.name}
                </h3>
                <button onClick={() => setShowReplyModal(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleReply} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">To:</label>
                  <input
                    type="text"
                    value={selectedContact.email}
                    disabled
                    className="w-full p-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Subject:</label>
                  <input
                    type="text"
                    value={`Re: ${selectedContact.subject}`}
                    disabled
                    className="w-full p-2 border rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Message:</label>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    rows={6}
                    required
                  />
                </div>

                <div className="flex justify-end space-x-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowReplyModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Reply
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const UsersView = () => (
    <div className="p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold dark:text-white">Users</h2>
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th> */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.is_active 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
  const CategoriesView = () => (
    <div className="p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold dark:text-white">Categories</h2>
            <div className="flex space-x-4">
              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              </div>
              <button
                onClick={() => {
                  resetCategoryForm();
                  setShowCategoryModal(true);
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredCategories.map((category) => (
                  <tr key={category.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{category.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedCategory(category);
                          setCategoryFormData(category);
                          setShowCategoryModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold dark:text-white">
                  {selectedCategory ? 'Edit Category' : 'Add New Category'}
                </h3>
                <button onClick={() => setShowCategoryModal(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={categoryFormData.name}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowCategoryModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    {selectedCategory ? 'Update Category' : 'Create Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const MoviesView = () => (
    <div className="p-6">
  
      {/* Search & Add Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
        <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          
          {/* Search */}
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          </div>          
        </div>
      </div>
  
      {/* Movies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMovies.map((movie) => (
          <div key={movie.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            
            {/* Poster */}
            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
              {movie.poster_url ? (
                <img 
                  src={movie.poster_url} 
                  alt={movie.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                  <Clapperboard className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
  
            {/* Movie Info */}
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 dark:text-white">{movie.title}</h3>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{movie.genre}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                  {movie.description}
                </p>
  
                {/* Actions */}
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Rating: {movie.rating}/10
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedMovie(movie);
                        setMovieFormData(movie);
                        setShowMovieModal(true);
                      }}
                      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteMovie(movie.id)}
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
  
      {/* Movie Modal */}
      {showMovieModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full">
            <div className="p-6">
  
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold dark:text-white">
                  {selectedMovie ? 'Edit Movie' : 'Add New Movie'}
                </h3>
                <button onClick={() => setShowMovieModal(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
  
              {/* Modal Form */}
              <form onSubmit={handleMovieSubmit} className="space-y-4">
  
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    value={movieFormData.title}
                    onChange={(e) => setMovieFormData({ ...movieFormData, title: e.target.value })}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
  
                {/* Genre */}
                <div>
                  <label className="block text-sm font-medium mb-1">Genre</label>
                  <input
                    type="text"
                    value={movieFormData.genre}
                    onChange={(e) => setMovieFormData({ ...movieFormData, genre: e.target.value })}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  />
                </div>
  
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    value={movieFormData.description}
                    onChange={(e) => setMovieFormData({ ...movieFormData, description: e.target.value })}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    rows={3}
                    required
                  />
                </div>
  
                {/* Release & Rating */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Release Date</label>
                    <input
                      type="date"
                      value={movieFormData.release_date}
                      onChange={(e) => setMovieFormData({ ...movieFormData, release_date: e.target.value })}
                      className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Rating</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={movieFormData.rating}
                      onChange={(e) => setMovieFormData({ ...movieFormData, rating: e.target.value })}
                      className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      required
                    />
                  </div>
                </div>
  
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select
                    value={movieFormData.category_id}
                    onChange={(e) => setMovieFormData({ ...movieFormData, category_id: e.target.value })}
                    className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
  
                {/* Poster & Trailer URLs */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Poster URL</label>
                    <input
                      type="text"
                      value={movieFormData.poster_url}
                      onChange={(e) => setMovieFormData({ ...movieFormData, poster_url: e.target.value })}
                      className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Trailer URL</label>
                    <input
                      type="text"
                      value={movieFormData.trailer_url}
                      onChange={(e) => setMovieFormData({ ...movieFormData, trailer_url: e.target.value })}
                      className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
  
                {/* Director & Cast */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Director</label>
                    <input
                      type="text"
                      value={movieFormData.director}
                      onChange={(e) => setMovieFormData({ ...movieFormData, director: e.target.value })}
                      className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Cast</label>
                    <input
                      type="text"
                      value={movieFormData.cast}
                      onChange={(e) => setMovieFormData({ ...movieFormData, cast: e.target.value })}
                      className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>
  
                {/* Modal Actions */}
                <div className="flex justify-end space-x-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowMovieModal(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    {selectedMovie ? 'Update Movie' : 'Create Movie'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Head title={activeView.charAt(0).toUpperCase() + activeView.slice(1)} />
      
      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 w-64 shadow-lg transform transition-transform duration-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <Clapperboard className="w-8 h-8 text-red-500" />
            <span className="text-xl font-bold dark:text-white">JO BEST</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => setActiveView('dashboard')}
                className={`w-full flex items-center space-x-2 p-2 rounded-lg ${
                  activeView === 'dashboard' 
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                }`}
              >
                <BarChart2 className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveView('movies')}
                className={`w-full flex items-center space-x-2 p-2 rounded-lg ${
                  activeView === 'movies'
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                }`}
              >
                <Clapperboard className="w-5 h-5" />
                <span>Movies</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveView('users')}
                className={`w-full flex items-center space-x-2 p-2 rounded-lg ${
                  activeView === 'users'
                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                }`}
              >
                <Users className="w-5 h-5" />
                <span>Users</span>
              </button>
            </li>
            <li>
            {/* <button
  onClick={() => setActiveView('categories')}
  className={`w-full flex items-center space-x-2 p-2 rounded-lg ${
    activeView === 'categories'
      ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
      : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
  }`}
>
<SquareStack className="w-5 h-5" />
  <span>Categories</span>
</button> */}

</li>
<li>
  <button
    onClick={() => setActiveView('contacts')}
    className={`w-full flex items-center space-x-2 p-2 rounded-lg ${
      activeView === 'contacts'
        ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
    }`}
  >
    <MessageSquare className="w-5 h-5" />
    <span>Contacts</span>
  </button>
</li>
<li>
  <button
    onClick={() => setActiveView('profile')}
    className={`w-full flex items-center space-x-2 p-2 rounded-lg ${
      activeView === 'profile'
        ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
    }`}
  >
    <User className="w-5 h-5" />
    <span>Profile</span>
  </button>
</li>
            {/* <li>
              <button className="w-full flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </button>
            </li> */}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className={`${isSidebarOpen ? 'lg:ml-64' : ''} transition-margin duration-300`}>
        {/* Top Bar */}
        <div className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex items-center justify-between p-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>

            <div className="flex items-center space-x-4">
            <button
    onClick={() => setActiveView('contacts')}
    className={`w-full flex items-center space-x-2 p-2 rounded-lg ${
      activeView === 'contacts'
        ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
    }`}
  >
                <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                
              </button>
              <form action="/admin/logout" method="POST">
              <input type="hidden" name="_token" value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')} />
      <button type="submit" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
        <LogOut className="w-6 h-6 text-gray-600 dark:text-gray-300" />
      </button>
    </form>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        {activeView === 'dashboard' ? (
          <div className="p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-500 dark:text-gray-400">Total Movies</h3>
                  <Clapperboard className="w-6 h-6 text-red-500" />
                </div>
                <p className="text-2xl font-bold mt-2 dark:text-white">{movies.length}</p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-500 dark:text-gray-400">Total Users</h3>
                  <Users className="w-6 h-6 text-red-500" />
                </div>
                <p className="text-2xl font-bold mt-2 dark:text-white">{totalUsers}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-500 dark:text-gray-400">Total Watches</h3>
                  <Eye className="w-6 h-6 text-red-500" />
                </div>
                <p className="text-2xl font-bold mt-2 dark:text-white">0</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4 dark:text-white">Recent Activity</h2>
                <div className="space-y-4">
                  {/* Recent activities will be mapped here */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                        <Users className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <p className="font-medium dark:text-white">New user registration</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Arsenio Bates signed up</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">1 hour ago</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                        <Clapperboard className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <p className="font-medium dark:text-white">New movie added</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">The Matrix Resurrections</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">1 hour ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : activeView === 'movies' ? (
          <MoviesView />
        ) : activeView === 'users' ? (
          <UsersView />
        ) : activeView === 'categories' ? (
          <CategoriesView />
         ) : activeView === 'contacts' ? (
            <ContactsView />
          ) : activeView === 'profile' ? (
            <ProfileView />
        ) : null}
      </div>
    </div>
  );
};

export default AdminDashboard;

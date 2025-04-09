import React, { useState, useEffect } from 'react';
import { Search, Plus, X, Edit, Trash } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

const CategoryView = () => {
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState({
    name: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const getCsrfToken = () => {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  };

  const fetchCategories = async () => {
    try {
      const headers = {
        'X-CSRF-TOKEN': getCsrfToken(),
        'Accept': 'application/json',
      };

      const response = await fetch('/api/categories', { headers });
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Error fetching categories. Please try again.');
    }
  };

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
      fetchCategories();
      resetCategoryForm();
      alert(selectedCategory ? 'Category updated successfully!' : 'Category created successfully!');
    } catch (error) {
      console.error('Error saving category:', error);
      alert(error.message || 'Error saving category. Please try again.');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (confirm('Are you sure you want to delete this category?')) {
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

        fetchCategories();
        alert('Category deleted successfully!');
      } catch (error) {
        console.error('Error deleting category:', error);
        alert(error.message || 'Error deleting category. Please try again.');
      }
    }
  };

  const resetCategoryForm = () => {
    setCategoryFormData({
      name: ''
    });
    setSelectedCategory(null);
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="m-6">
      <CardHeader>
        <CardTitle>Categories Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
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
                      <Edit className="w-4 h-4 inline-block mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <Trash className="w-4 h-4 inline-block mr-1" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
      </CardContent>
    </Card>
  );
};

export default CategoryView;
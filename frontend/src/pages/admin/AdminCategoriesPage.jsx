import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('/api/categories');
      setCategories(data.categories || data);
    } catch (error) {
      console.log(error.response?.data || error);
      alert('Error loading categories');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategoryHandler = async (e) => {
    e.preventDefault();

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));

      await axios.post(
        '/api/categories',
        {
          name,
          description
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`
          }
        }
      );

      alert('Category added');

      setName('');
      setDescription('');
      fetchCategories();
    } catch (error) {
      console.log(error.response?.data || error);
      alert(error.response?.data?.message || 'Error adding category');
    }
  };

  const startEditHandler = (category) => {
    setEditingId(category._id);
    setEditName(category.name || '');
    setEditDescription(category.description || '');
  };

  const cancelEditHandler = () => {
    setEditingId(null);
    setEditName('');
    setEditDescription('');
  };

  const updateCategoryHandler = async (id) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));

      await axios.put(
        `/api/categories/${id}`,
        {
          name: editName,
          description: editDescription
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`
          }
        }
      );

      alert('Category updated');

      setEditingId(null);
      setEditName('');
      setEditDescription('');

      fetchCategories();
    } catch (error) {
      console.log(error.response?.data || error);
      alert(error.response?.data?.message || 'Error updating category');
    }
  };

  const deleteCategoryHandler = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this category?'
    );

    if (!confirmDelete) return;

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));

      await axios.delete(`/api/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`
        }
      });

      alert('Category deleted');
      fetchCategories();
    } catch (error) {
      console.log(error.response?.data || error);
      alert(error.response?.data?.message || 'Error deleting category');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-8">
        Manage Categories
      </h1>

      <form
        onSubmit={addCategoryHandler}
        className="bg-white shadow rounded-xl p-6 mb-10 space-y-6"
      >
        <h2 className="text-2xl font-semibold">
          Add New Category
        </h2>

        <div>
          <label className="block mb-2 font-medium">
            Category Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-3 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Description
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-3 rounded-lg"
            rows="3"
          />
        </div>

        <button
          type="submit"
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
        >
          Add Category
        </button>
      </form>

      <div className="bg-white shadow rounded-xl overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-semibold">
            All Categories
          </h2>
        </div>

        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Slug</th>
              <th className="text-left p-4">Description</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td className="p-4" colSpan="4">
                  No categories found.
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category._id} className="border-t">
                  <td className="p-4 font-medium">
                    {editingId === category._id ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full border p-2 rounded-lg"
                      />
                    ) : (
                      category.name
                    )}
                  </td>

                  <td className="p-4">
                    {category.slug}
                  </td>

                  <td className="p-4">
                    {editingId === category._id ? (
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full border p-2 rounded-lg"
                        rows="2"
                      />
                    ) : (
                      category.description || 'No description'
                    )}
                  </td>

                  <td className="p-4">
                    {editingId === category._id ? (
                      <div className="flex gap-3">
                        <button
                          onClick={() => updateCategoryHandler(category._id)}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                        >
                          Save
                        </button>

                        <button
                          onClick={cancelEditHandler}
                          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <button
                          onClick={() => startEditHandler(category)}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deleteCategoryHandler(category._id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCategoriesPage;
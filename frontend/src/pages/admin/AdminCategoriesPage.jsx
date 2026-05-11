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

  const CategoryActions = ({ category }) =>
    editingId === category._id ? (
      <div className="grid grid-cols-2 gap-3 sm:flex">
        <button
          type="button"
          onClick={() => updateCategoryHandler(category._id)}
          className="rounded-lg bg-green-500 px-4 py-2 text-white transition hover:bg-green-600"
        >
          Save
        </button>

        <button
          type="button"
          onClick={cancelEditHandler}
          className="rounded-lg bg-gray-500 px-4 py-2 text-white transition hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    ) : (
      <div className="grid grid-cols-2 gap-3 sm:flex">
        <button
          type="button"
          onClick={() => startEditHandler(category)}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => deleteCategoryHandler(category._id)}
          className="rounded-lg bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    );

  return (
    <div className="mx-auto max-w-7xl px-3 py-6 sm:px-4 sm:py-10">
      <h1 className="mb-6 text-3xl font-bold sm:mb-8 sm:text-4xl">
        Manage Categories
      </h1>

      <form
        onSubmit={addCategoryHandler}
        className="mb-8 space-y-6 rounded-xl bg-white p-4 shadow sm:mb-10 sm:p-6"
      >
        <h2 className="text-2xl font-semibold">
          Add New Category
        </h2>

        <div>
          <label className="mb-2 block font-medium">
            Category Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border p-3"
            required
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Description
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border p-3"
            rows="3"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-black px-6 py-3 text-white transition hover:bg-gray-800 sm:w-auto"
        >
          Add Category
        </button>
      </form>

      <div className="overflow-hidden rounded-xl bg-white shadow">
        <div className="border-b p-4 sm:p-6">
          <h2 className="text-2xl font-semibold">
            All Categories
          </h2>
        </div>

        {categories.length === 0 ? (
          <p className="p-4 text-gray-500 sm:p-6">No categories found.</p>
        ) : (
          <>
            <div className="divide-y divide-gray-100 md:hidden">
              {categories.map((category) => (
                <div key={category._id} className="p-4">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      {editingId === category._id ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="mt-1 w-full rounded-lg border p-2"
                        />
                      ) : (
                        <p className="break-words font-semibold text-gray-900">
                          {category.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Slug</p>
                      <p className="break-words text-gray-700">
                        {category.slug}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Description</p>
                      {editingId === category._id ? (
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="mt-1 w-full rounded-lg border p-2"
                          rows="2"
                        />
                      ) : (
                        <p className="break-words text-gray-700">
                          {category.description || 'No description'}
                        </p>
                      )}
                    </div>

                    <CategoryActions category={category} />
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden md:block">
              <table className="w-full border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-left">Slug</th>
                    <th className="p-4 text-left">Description</th>
                    <th className="p-4 text-left">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {categories.map((category) => (
                    <tr key={category._id} className="border-t align-top">
                      <td className="p-4 font-medium">
                        {editingId === category._id ? (
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full rounded-lg border p-2"
                          />
                        ) : (
                          category.name
                        )}
                      </td>

                      <td className="p-4 break-words">
                        {category.slug}
                      </td>

                      <td className="p-4 break-words">
                        {editingId === category._id ? (
                          <textarea
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="w-full rounded-lg border p-2"
                            rows="2"
                          />
                        ) : (
                          category.description || 'No description'
                        )}
                      </td>

                      <td className="p-4">
                        <CategoryActions category={category} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminCategoriesPage;

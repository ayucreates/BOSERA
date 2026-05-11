import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getMediaUrl } from '../../utils/media';

const AdminEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProductAndCategories = async () => {
      try {
        const [productResponse, categoriesResponse] = await Promise.all([
          axios.get(`/api/products/${id}`),
          axios.get('/api/categories')
        ]);

        const product = productResponse.data;
        const categoriesData =
          categoriesResponse.data.categories || categoriesResponse.data;

        setName(product.name || '');
        setDescription(product.description || '');
        setPrice(product.price || '');
        setStock(product.sizes?.[0]?.stock || '');
        setCategory(product.category?._id || product.category || '');
        setImage(product.images?.[0]?.url || '');
        setCategories(categoriesData);
      } catch (error) {
        console.log(error.response?.data || error);
        alert('Error loading product');
      }
    };

    fetchProductAndCategories();
  }, [id]);

  const uploadImageHandler = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    try {
      setUploading(true);

      const userInfo = JSON.parse(localStorage.getItem('userInfo'));

      const formData = new FormData();
      formData.append('images', file);

      const { data } = await axios.post('/api/upload', formData, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setImage(data[0]);
      setUploading(false);
    } catch (error) {
      console.log(error.response?.data || error);
      setUploading(false);
      alert(error.response?.data?.message || 'Image upload failed');
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));

      await axios.put(
        `/api/products/${id}`,
        {
          name,
          description,
          price: Number(price),
          category,
          images: [
            {
              url: image,
              alt: name
            }
          ],
          sizes: [
            {
              size: 'M',
              stock: Number(stock)
            }
          ],
          isActive: true
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`
          }
        }
      );

      alert('Product updated');
      navigate('/admin/products');
    } catch (error) {
      console.log(error.response?.data || error);
      alert(error.response?.data?.message || 'Error updating product');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-3 py-6 sm:px-4 sm:py-10">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8">
        Edit Product
      </h1>

      <form
        onSubmit={submitHandler}
        className="space-y-6 bg-white p-4 sm:p-6 rounded-xl shadow"
      >
        <div>
          <label className="block mb-2 font-medium">
            Product Name
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
            rows="4"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Price
          </label>

          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border p-3 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Stock
          </label>

          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="w-full border p-3 rounded-lg"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Category
          </label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border p-3 rounded-lg"
            required
          >
            <option value="">Select category</option>

            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            Product Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={uploadImageHandler}
            className="w-full border p-3 rounded-lg"
          />

          {uploading && (
            <p className="text-sm text-gray-500 mt-2 break-all">
              Uploading image...
            </p>
          )}

          {image && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">
                Current image:
              </p>

              <img
                src={getMediaUrl(image)}
                alt={name}
                className="w-40 h-40 object-cover rounded-lg border"
              />

              <p className="text-sm text-gray-500 mt-2 break-all">
                {image}
              </p>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={uploading}
          className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Update Product'}
        </button>
      </form>
    </div>
  );
};

export default AdminEditProduct;

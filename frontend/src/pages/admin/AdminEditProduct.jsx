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
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [sizes, setSizes] = useState([
    {
      size: '',
      stock: ''
    }
  ]);

  const commonSizes = [
    'XS',
    'S',
    'M',
    'L',
    'XL',
    'XXL',
    'Free Size',
    'UK 6',
    'UK 7',
    'UK 8',
    'UK 9',
    'UK 10'
  ];

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

        const productImage = product.images?.[0];

        setName(product.name || '');
        setDescription(product.description || '');
        setPrice(product.price || '');
        setCategory(product.category?._id || product.category || '');

        if (typeof productImage === 'string') {
          setImage(productImage);
        } else {
          setImage(productImage?.url || '');
        }

        if (product.sizes && product.sizes.length > 0) {
          setSizes(
            product.sizes.map((item) => ({
              size: item.size || '',
              stock: item.stock ?? ''
            }))
          );
        } else {
          setSizes([
            {
              size: '',
              stock: ''
            }
          ]);
        }

        setCategories(categoriesData);
      } catch (error) {
        console.log(error.response?.data || error);
        alert('Error loading product');
      }
    };

    fetchProductAndCategories();
  }, [id]);

  const addSizeRow = () => {
    setSizes([
      ...sizes,
      {
        size: '',
        stock: ''
      }
    ]);
  };

  const removeSizeRow = (index) => {
    if (sizes.length === 1) {
      alert('At least one size is required');
      return;
    }

    setSizes(sizes.filter((_, sizeIndex) => sizeIndex !== index));
  };

  const updateSizeRow = (index, field, value) => {
    const updatedSizes = sizes.map((item, sizeIndex) => {
      if (sizeIndex === index) {
        return {
          ...item,
          [field]: value
        };
      }

      return item;
    });

    setSizes(updatedSizes);
  };

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

    const cleanedSizes = sizes
      .map((item) => ({
        size: item.size.trim(),
        stock: Number(item.stock)
      }))
      .filter((item) => item.size && item.stock >= 0);

    if (cleanedSizes.length === 0) {
      alert('Please add at least one size with stock');
      return;
    }

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
          sizes: cleanedSizes,
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
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold text-gray-950 sm:text-4xl">
        Edit Product
      </h1>

      <form
        onSubmit={submitHandler}
        className="space-y-6 rounded-xl bg-white p-4 shadow sm:p-6"
      >
        <div>
          <label className="mb-2 block font-medium">
            Product Name
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
            rows="4"
            required
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Price
          </label>

          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded-lg border p-3"
            required
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Category
          </label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border p-3"
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
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <label className="block font-medium">
                Size Options
              </label>
              <p className="text-sm text-gray-500">
                Edit the available sizes and stock for this product.
              </p>
            </div>

            <button
              type="button"
              onClick={addSizeRow}
              className="shrink-0 rounded-lg bg-gray-950 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Add Size
            </button>
          </div>

          <div className="space-y-3">
            {sizes.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-1 gap-3 rounded-lg border bg-gray-50 p-3 sm:grid-cols-[1fr_140px_auto]"
              >
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">
                    Size
                  </label>

                  <input
                    type="text"
                    list={`edit-sizes-list-${index}`}
                    value={item.size}
                    onChange={(e) => updateSizeRow(index, 'size', e.target.value)}
                    placeholder="Example: M, XL, UK 8"
                    className="w-full rounded-lg border bg-white p-3"
                    required
                  />

                  <datalist id={`edit-sizes-list-${index}`}>
                    {commonSizes.map((size) => (
                      <option key={size} value={size} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-600">
                    Stock
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={item.stock}
                    onChange={(e) => updateSizeRow(index, 'stock', e.target.value)}
                    placeholder="0"
                    className="w-full rounded-lg border bg-white p-3"
                    required
                  />
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeSizeRow(index)}
                    className="w-full rounded-lg border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Product Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={uploadImageHandler}
            className="w-full rounded-lg border p-3"
          />

          {uploading && (
            <p className="mt-2 text-sm text-gray-500">
              Uploading image...
            </p>
          )}

          {image && (
            <div className="mt-4">
              <p className="mb-2 text-sm text-gray-500">
                Current image:
              </p>

              <img
                src={getMediaUrl(image)}
                alt={name}
                className="h-40 w-40 rounded-lg border object-cover"
              />

              <p className="mt-2 break-all text-sm text-gray-500">
                {image}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={uploading}
            className="rounded-lg bg-black px-6 py-3 text-white transition hover:bg-gray-800 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Update Product'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="rounded-lg border px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditProduct;
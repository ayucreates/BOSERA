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
  const [originalPrice, setOriginalPrice] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState([]);
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

        setName(product.name || '');
        setDescription(product.description || '');
        setPrice(product.price || '');
        setOriginalPrice(product.originalPrice || product.price || '');
        setCategory(product.category?._id || product.category || '');

        if (product.images && product.images.length > 0) {
          const existingImages = product.images
            .map((image) => {
              if (typeof image === 'string') {
                return image;
              }

              return image?.url;
            })
            .filter(Boolean);

          setImages(existingImages);
        } else {
          setImages([]);
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
    const selectedFiles = Array.from(e.target.files || []);

    if (selectedFiles.length === 0) return;

    if (images.length + selectedFiles.length > 5) {
      alert('You can upload a maximum of 5 images per product');
      return;
    }

    try {
      setUploading(true);

      const userInfo = JSON.parse(localStorage.getItem('userInfo'));

      const formData = new FormData();

      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });

      const { data } = await axios.post('/api/upload', formData, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setImages((prevImages) => [...prevImages, ...data]);
      setUploading(false);

      e.target.value = '';
    } catch (error) {
      console.log(error.response?.data || error);
      setUploading(false);
      alert(error.response?.data?.message || 'Image upload failed');
    }
  };

  const removeImage = (index) => {
    if (images.length === 1) {
      alert('At least one product image is required');
      return;
    }

    setImages(images.filter((_, imageIndex) => imageIndex !== index));
  };

  const moveImageLeft = (index) => {
    if (index === 0) return;

    const updatedImages = [...images];
    const temp = updatedImages[index - 1];
    updatedImages[index - 1] = updatedImages[index];
    updatedImages[index] = temp;

    setImages(updatedImages);
  };

  const moveImageRight = (index) => {
    if (index === images.length - 1) return;

    const updatedImages = [...images];
    const temp = updatedImages[index + 1];
    updatedImages[index + 1] = updatedImages[index];
    updatedImages[index] = temp;

    setImages(updatedImages);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (Number(originalPrice) < Number(price)) {
      alert('MRP should not be less than Selling Price');
      return;
    }

    if (images.length === 0) {
      alert('Please upload at least one product image');
      return;
    }

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
          originalPrice: Number(originalPrice),
          category,
          images: images.map((imageUrl, index) => ({
            url: imageUrl,
            alt: `${name} image ${index + 1}`
          })),
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block font-medium">
              MRP
            </label>

            <input
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              className="w-full rounded-lg border p-3"
              placeholder="Example: 1299"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Selling Price
            </label>

            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-lg border p-3"
              placeholder="Example: 899"
              required
            />
          </div>
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
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
              className="w-full rounded-lg bg-gray-950 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800 sm:w-auto"
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
            Product Images
          </label>

          <p className="mb-3 text-sm text-gray-500">
            Upload up to 5 images. The first image will be used as the main product image.
          </p>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={uploadImageHandler}
            className="w-full rounded-lg border p-3"
          />

          {uploading && (
            <p className="mt-2 text-sm text-gray-500">
              Uploading images...
            </p>
          )}

          {images.length > 0 && (
            <div className="mt-4">
              <p className="mb-3 text-sm font-medium text-gray-700">
                Product images:
              </p>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {images.map((imageUrl, index) => (
                  <div
                    key={`${imageUrl}-${index}`}
                    className="rounded-lg border bg-gray-50 p-2"
                  >
                    <div className="relative">
                      <img
                        src={getMediaUrl(imageUrl)}
                        alt={`Product preview ${index + 1}`}
                        className="h-32 w-full rounded-lg object-cover"
                      />

                      {index === 0 && (
                        <span className="absolute left-2 top-2 rounded-full bg-black px-2 py-1 text-xs font-semibold text-white">
                          Main
                        </span>
                      )}
                    </div>

                    <div className="mt-2 grid grid-cols-3 gap-1">
                      <button
                        type="button"
                        onClick={() => moveImageLeft(index)}
                        disabled={index === 0}
                        className="rounded border px-2 py-1 text-xs disabled:opacity-40"
                      >
                        ←
                      </button>

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="rounded border border-red-200 px-2 py-1 text-xs text-red-600"
                      >
                        Remove
                      </button>

                      <button
                        type="button"
                        onClick={() => moveImageRight(index)}
                        disabled={index === images.length - 1}
                        className="rounded border px-2 py-1 text-xs disabled:opacity-40"
                      >
                        →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={uploading}
            className="w-full rounded-lg bg-black px-6 py-3 text-white transition hover:bg-gray-800 disabled:opacity-50 sm:w-auto"
          >
            {uploading ? 'Uploading...' : 'Update Product'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="w-full rounded-lg border px-6 py-3 font-medium text-gray-700 transition hover:bg-gray-50 sm:w-auto"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditProduct;

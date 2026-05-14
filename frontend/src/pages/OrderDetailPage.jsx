import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { formatPrice } from '../utils/formatters';
import { getMediaUrl } from '../utils/media';

const OrderDetailPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewForms, setReviewForms] = useState({});
  const [submittingReview, setSubmittingReview] = useState('');
  const [uploadingReviewImages, setUploadingReviewImages] = useState('');

  const { userInfo } = useSelector((state) => state.auth);

  const getConfig = () =>
    userInfo?.token
      ? { headers: { Authorization: `Bearer ${userInfo.token}` } }
      : {};

  const fetchOrder = async () => {
    try {
      const { data } = await axios.get(`/api/orders/${id}`, getConfig());
      setOrder(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id, userInfo]);

  const updateReviewForm = (productId, field, value) => {
    setReviewForms((prev) => ({
      ...prev,
      [productId]: {
        rating: 5,
        comment: '',
        images: [],
        ...(prev[productId] || {}),
        [field]: value
      }
    }));
  };

  const handleReviewImageUpload = async (productId, files) => {
    const selectedFiles = Array.from(files || []);

    if (selectedFiles.length === 0) return;

    const currentImages = reviewForms[productId]?.images || [];

    if (currentImages.length + selectedFiles.length > 3) {
      toast.error('You can upload a maximum of 3 review images');
      return;
    }

    try {
      setUploadingReviewImages(productId);

      const formData = new FormData();
      selectedFiles.forEach((file) => formData.append('images', file));

      const { data } = await axios.post('/api/upload/reviews', formData, {
        ...getConfig(),
        headers: {
          ...(getConfig().headers || {}),
          'Content-Type': 'multipart/form-data'
        }
      });

      updateReviewForm(productId, 'images', [...currentImages, ...data]);
      toast.success('Review image uploaded');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Review image upload failed');
    } finally {
      setUploadingReviewImages('');
    }
  };

  const removeReviewImage = (productId, index) => {
    const currentImages = reviewForms[productId]?.images || [];
    updateReviewForm(
      productId,
      'images',
      currentImages.filter((_, imageIndex) => imageIndex !== index)
    );
  };

  const submitReview = async (item) => {
    const productId = item.product;
    const form = reviewForms[productId] || { rating: 5, comment: '', images: [] };

    if (!form.comment?.trim()) {
      toast.error('Please write a review comment');
      return;
    }

    try {
      setSubmittingReview(productId);

      await axios.post(
        `/api/products/${productId}/reviews`,
        {
          orderId: order._id,
          rating: Number(form.rating || 5),
          comment: form.comment,
          images: form.images || []
        },
        getConfig()
      );

      toast.success('Review submitted');
      updateReviewForm(productId, 'comment', '');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not submit review');
    } finally {
      setSubmittingReview('');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-900 border-t-transparent" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h1 className="mb-3 text-2xl font-bold text-gray-950">Order not found</h1>
        <p className="mb-6 text-gray-600">{error || 'This order could not be loaded.'}</p>
        <Link to="/shop" className="btn-primary inline-flex">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const canReview = order.orderStatus === 'delivered';

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-semibold">Order Details</h1>

      {!userInfo && (
        <div className="mb-6 rounded-2xl border border-yellow-100 bg-yellow-50 p-4 text-sm text-yellow-800">
          Save this order link if you checked out as a guest. You can use it to view this order again.
        </div>
      )}

      {canReview && (
        <div className="mb-6 rounded-2xl border border-green-100 bg-green-50 p-4 text-sm text-green-800">
          Your order has been delivered. You can now leave a verified review for the products below.
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border bg-white p-4">
            <h2 className="mb-2 font-semibold">Shipping Address</h2>
            <p className="leading-relaxed text-gray-700">
              {order.shippingAddress.fullName}
              <br />
              {order.shippingAddress.phone}
              <br />
              {order.shippingAddress.addressLine1}
              {order.shippingAddress.addressLine2 ? <><br />{order.shippingAddress.addressLine2}</> : null}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-4">
            <h2 className="mb-4 font-semibold">Order Items</h2>
            <div className="space-y-5">
              {order.orderItems.map((item) => {
                const productId = item.product;
                const form = reviewForms[productId] || {
                  rating: 5,
                  comment: '',
                  images: []
                };

                return (
                  <div
                    key={`${item.product}-${item.size}`}
                    className="border-b pb-5 last:border-0 last:pb-0"
                  >
                    <div className="flex gap-4">
                      <img
                        src={getMediaUrl(item.image)}
                        alt={item.name}
                        className="h-20 w-16 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          Size: {item.size} | Qty: {item.quantity}
                        </p>
                        <p className="font-semibold">{formatPrice(item.price)}</p>
                      </div>
                    </div>

                    {canReview && (
                      <div className="mt-4 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                        <h3 className="mb-3 font-semibold text-gray-950">
                          Leave a review
                        </h3>

                        <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-[160px_1fr]">
                          <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                              Rating
                            </label>
                            <select
                              value={form.rating}
                              onChange={(e) => updateReviewForm(productId, 'rating', e.target.value)}
                              className="w-full rounded-xl border bg-white p-3"
                            >
                              <option value="5">5 stars</option>
                              <option value="4">4 stars</option>
                              <option value="3">3 stars</option>
                              <option value="2">2 stars</option>
                              <option value="1">1 star</option>
                            </select>
                          </div>

                          <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">
                              Review images
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              onChange={(e) => handleReviewImageUpload(productId, e.target.files)}
                              className="w-full rounded-xl border bg-white p-3 text-sm"
                            />
                            {uploadingReviewImages === productId && (
                              <p className="mt-1 text-xs text-gray-500">Uploading images...</p>
                            )}
                          </div>
                        </div>

                        {form.images?.length > 0 && (
                          <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
                            {form.images.map((imageUrl, index) => (
                              <div key={`${imageUrl}-${index}`} className="relative">
                                <img
                                  src={getMediaUrl(imageUrl)}
                                  alt={`Review upload ${index + 1}`}
                                  className="h-20 w-full rounded-lg object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeReviewImage(productId, index)}
                                  className="absolute right-1 top-1 rounded-full bg-black/70 px-2 py-0.5 text-xs text-white"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        <textarea
                          value={form.comment}
                          onChange={(e) => updateReviewForm(productId, 'comment', e.target.value)}
                          rows="3"
                          placeholder="Write your experience with this product"
                          className="mb-3 w-full rounded-xl border bg-white p-3"
                        />

                        <button
                          type="button"
                          onClick={() => submitReview(item)}
                          disabled={submittingReview === productId}
                          className="rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-50"
                        >
                          {submittingReview === productId ? 'Submitting...' : 'Submit Review'}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="h-fit rounded-2xl bg-gray-50 p-6">
          <h2 className="mb-4 font-semibold">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Status</span>
              <span className="font-medium capitalize">{order.orderStatus}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment</span>
              <span>{order.isPaid ? 'Paid' : 'Pending'}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment Method</span>
              <span className="capitalize">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span>Tracking ID</span>
              <span className="text-right font-medium">
                {order.delhivery?.awb || order.trackingNumber || 'Not generated yet'}
              </span>
            </div>
            {(order.delhivery?.trackingUrl || order.trackingNumber) && (
              <a
                href={order.delhivery?.trackingUrl || `https://www.delhivery.com/track/package/${order.trackingNumber}`}
                target="_blank"
                rel="noreferrer"
                className="block rounded-xl bg-gray-950 px-4 py-3 text-center text-sm font-semibold text-white"
              >
                Track with Delhivery
              </a>
            )}
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{formatPrice(order.shippingPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Platform Fee</span>
              <span>{formatPrice(order.platformFee || 0)}</span>
            </div>
            <div className="flex justify-between border-t pt-2 font-semibold">
              <span>Total</span>
              <span>{formatPrice(order.totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;

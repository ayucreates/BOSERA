// ProfilePage.jsx
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../store/slices/authSlice';
import { toast } from 'react-toastify';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { userInfo, loading } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });

  useEffect(() => {
    if (userInfo) setFormData({ name: userInfo.name, email: userInfo.email, phone: userInfo.phone || '', password: '' });
  }, [userInfo]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProfile(formData));
    toast.success('Profile updated');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-3xl font-display font-semibold mb-8">My Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div><label className="block text-sm font-medium mb-2">Name</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" /></div>
        <div><label className="block text-sm font-medium mb-2">Email</label><input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input-field" /></div>
        <div><label className="block text-sm font-medium mb-2">Phone</label><input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="input-field" /></div>
        <div><label className="block text-sm font-medium mb-2">New Password (leave blank to keep)</label><input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="input-field" /></div>
        <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Updating...' : 'Update Profile'}</button>
      </form>
    </div>
  );
};

export default ProfilePage;

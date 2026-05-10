// ContactPage.jsx
import { useState } from 'react';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Message sent! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-display font-semibold text-center mb-12">Contact Us</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
        <div>
          <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Your Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" required />
            <input type="email" placeholder="Your Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input-field" required />
            <textarea placeholder="Your Message" rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="input-field resize-none" required />
            <button type="submit" className="btn-primary w-full">Send Message</button>
          </form>
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
          <div className="flex items-start gap-4"><FiMail className="mt-1" size={20} /><div><p className="font-medium">Email</p><p className="text-gray-600">hello@litebouyszone.com</p></div></div>
          <div className="flex items-start gap-4"><FiPhone className="mt-1" size={20} /><div><p className="font-medium">Phone</p><p className="text-gray-600">+91 98765 43210</p></div></div>
          <div className="flex items-start gap-4"><FiMapPin className="mt-1" size={20} /><div><p className="font-medium">Address</p><p className="text-gray-600">123 Fashion Street, Mumbai<br/>Maharashtra 400001</p></div></div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

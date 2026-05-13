// ContactPage.jsx
import { useState } from 'react';
import { FiFacebook, FiInstagram, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
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
          <div className="flex items-start gap-4"><FiMail className="mt-1" size={20} /><div><p className="font-medium">Email</p><p className="text-gray-600">Litebouys4@gmail.com</p></div></div>
          <div className="flex items-start gap-4"><FiPhone className="mt-1" size={20} /><div><p className="font-medium">Phone</p><p className="text-gray-600">+91 76368 11101</p></div></div>
          <div className="flex items-start gap-4"><FiMapPin className="mt-1" size={20} /><div><p className="font-medium">Address</p><p className="text-gray-600">Near Bajwi Hotel, Kokrajhar,<br/>Assam 783370</p></div></div>

          <div>
            <p className="mb-3 font-medium">Socials</p>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/litebouys_zone/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-gray-700 transition hover:border-gray-950 hover:text-gray-950"
              >
                <FiInstagram />
                Instagram
              </a>

              <a
                href="https://www.facebook.com/people/Lite-Bouys-Zone/61585258894779/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-gray-700 transition hover:border-gray-950 hover:text-gray-950"
              >
                <FiFacebook />
                Facebook
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

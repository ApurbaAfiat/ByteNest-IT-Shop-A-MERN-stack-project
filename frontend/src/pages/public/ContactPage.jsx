import { Helmet } from 'react-helmet-async';
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from 'react-icons/hi';

const ContactPage = () => {
  return (
    <>
      <Helmet><title>Contact Us — ByteNest</title></Helmet>
      <div className="container-custom py-12">
        <h1 className="text-4xl font-display font-bold text-surface-900 dark:text-white mb-4">Contact Us</h1>
        <p className="text-surface-500 mb-10 max-w-xl">Have questions about the project or want to get in touch? Send us a message or reach out via email.</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info cards */}
          <div className="space-y-4">
            <div className="card p-6 flex gap-4">
              <HiOutlineMail className="w-6 h-6 text-primary-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-surface-900 dark:text-white">Email Address</h3>
                <p className="text-sm text-surface-500 mt-1">support@bytenest.com</p>
              </div>
            </div>
            <div className="card p-6 flex gap-4">
              <HiOutlinePhone className="w-6 h-6 text-primary-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-surface-900 dark:text-white">Phone Number</h3>
                <p className="text-sm text-surface-500 mt-1">+880 1700-000001</p>
              </div>
            </div>
            <div className="card p-6 flex gap-4">
              <HiOutlineLocationMarker className="w-6 h-6 text-primary-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-surface-900 dark:text-white">Office Location</h3>
                <p className="text-sm text-surface-500 mt-1">123 Tech Street, Gulshan, Dhaka 1212, Bangladesh</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 card p-8">
            <h2 className="text-xl font-bold mb-6">Send a Message</h2>
            <form onSubmit={(e) => { e.preventDefault(); alert('Message sending mocked! Thank you.'); }} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Name</label>
                  <input type="text" className="input" placeholder="John Doe" required />
                </div>
                <div>
                  <label className="label">Email Address</label>
                  <input type="email" className="input" placeholder="name@example.com" required />
                </div>
              </div>
              <div>
                <label className="label">Subject</label>
                <input type="text" className="input" placeholder="Inquiry about..." required />
              </div>
              <div>
                <label className="label">Message</label>
                <textarea rows={4} className="input" placeholder="Your message here..." required />
              </div>
              <button type="submit" className="btn-primary">Send Message</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;

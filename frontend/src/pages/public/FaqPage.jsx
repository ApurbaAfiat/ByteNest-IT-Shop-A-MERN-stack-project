import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { HiPlus, HiMinus } from 'react-icons/hi';

const faqs = [
  { q: 'Is this a real e-commerce website?', a: 'No. ByteNest is a portfolio project designed to demonstrate MERN stack, Tailwind CSS styling, and premium UI/UX design. All payments, product delivery, and user activity are mocked.' },
  { q: 'What is the shipping cost?', a: 'We offer free delivery for orders above ৳5,000 across Bangladesh. For orders under ৳5,000, a flat shipping fee of ৳100 is applied.' },
  { q: 'What payment methods do you support?', a: 'Currently, the system supports Cash on Delivery (COD) to simulate order processing without requiring real credit card processing or gateway integration.' },
  { q: 'How do I test the admin features?', a: 'You can log in using the credentials admin@bytenest.com / admin123 to access the full admin dashboard, view mock sales analytics, and manage products/orders.' },
];

const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <>
      <Helmet><title>FAQ — ByteNest</title></Helmet>
      <div className="container-custom py-12 max-w-3xl">
        <h1 className="text-4xl font-display font-bold text-surface-900 dark:text-white mb-4">Frequently Asked Questions</h1>
        <p className="text-surface-500 mb-8">Got questions? We have got answers. Here are some of the most common questions about the ByteNest project.</p>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="card p-5 cursor-pointer select-none" onClick={() => setOpenIndex(openIndex === i ? null : i)}>
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-surface-900 dark:text-white">{faq.q}</h3>
                {openIndex === i ? <HiMinus className="w-5 h-5 text-primary-500" /> : <HiPlus className="w-5 h-5 text-primary-500" />}
              </div>
              {openIndex === i && <p className="text-sm text-surface-600 dark:text-surface-400 mt-3 border-t pt-3 leading-relaxed">{faq.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FaqPage;

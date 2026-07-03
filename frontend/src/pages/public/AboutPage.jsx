import { Helmet } from 'react-helmet-async';

const AboutPage = () => {
  return (
    <>
      <Helmet><title>About Us — ByteNest</title></Helmet>
      <div className="container-custom py-12 space-y-12">
        {/* Intro */}
        <div className="max-w-3xl">
          <h1 className="text-4xl font-display font-bold text-surface-900 dark:text-white mb-4">About ByteNest</h1>
          <p className="text-lg text-surface-600 dark:text-surface-400 leading-relaxed">
            ByteNest is a modern e-commerce portfolio application showcasing clean code architecture and premium UI/UX design. Built using the full MERN stack, it demonstrates modern development practices for online stores.
          </p>
        </div>

        {/* Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-t pt-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">The Portfolio Project</h2>
            <p className="text-surface-600 dark:text-surface-400 mb-4 leading-relaxed">
              This application was developed as a MERN stack portfolio piece. It is modeled to look and feel like a modern, fully-fledged online electronics store inspired by major tech retail platforms.
            </p>
            <p className="text-surface-600 dark:text-surface-400 leading-relaxed">
              It incorporates advanced filtering/sorting/pagination, complete coupon/discount logic, secure JWT authentication, responsive cart checkout, comprehensive admin dashboards with interactive sales reports, and a premium dark mode theme.
            </p>
          </div>
          <div className="bg-surface-100 dark:bg-surface-800 h-64 rounded-2xl flex items-center justify-center">
            <span className="text-surface-400 text-lg font-semibold">ByteNest Story Mockup</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;

import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const NotFoundPage = () => {
  return (
    <>
      <Helmet><title>Page Not Found — ByteNest</title></Helmet>
      <div className="min-h-[85vh] flex flex-col justify-center items-center text-center p-4">
        <h1 className="text-8xl font-display font-extrabold text-primary-600 dark:text-primary-400 mb-4 animate-bounce">404</h1>
        <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-2">Page Not Found</h2>
        <p className="text-surface-500 max-w-md mb-8">Sorry, the page you are looking for does not exist or has been moved.</p>
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    </>
  );
};

export default NotFoundPage;

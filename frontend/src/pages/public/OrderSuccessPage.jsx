import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { HiCheckCircle, HiOutlineDocumentText, HiOutlineArrowRight } from 'react-icons/hi';

const OrderSuccessPage = () => {
  const { id } = useParams();

  return (
    <>
      <Helmet><title>Order Success — ByteNest</title></Helmet>
      <div className="container-custom py-16 flex justify-center items-center min-h-[60vh]">
        <div className="card p-8 w-full max-w-md text-center space-y-6">
          <HiCheckCircle className="w-20 h-20 text-emerald-500 mx-auto" />
          <div>
            <h1 className="text-2xl font-display font-bold text-surface-900 dark:text-white">Order Placed Successfully!</h1>
            <p className="text-sm text-surface-500 mt-2">Thank you for your order. We will deliver it to you shortly.</p>
          </div>
          <div className="p-4 bg-surface-50 dark:bg-surface-800 rounded-xl space-y-2 text-sm text-left">
            <div className="flex justify-between">
              <span className="text-surface-500">Order ID:</span>
              <span className="font-mono font-semibold">{id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-surface-500">Payment Status:</span>
              <span className="badge-warning">Pending (COD)</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <Link to={`/order/${id}`} className="btn-primary justify-center">
              <HiOutlineDocumentText className="w-5 h-5" /> View Order Details
            </Link>
            <Link to="/products" className="btn-ghost justify-center">
              Continue Shopping <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderSuccessPage;

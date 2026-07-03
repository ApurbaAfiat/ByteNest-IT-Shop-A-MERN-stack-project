import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import { useGetProductsQuery, useDeleteProductMutation } from '../../slices/productsApiSlice';
import { formatPrice } from '../../utils/formatPrice';
import Skeleton from '../../components/ui/Skeleton';
import Pagination from '../../components/ui/Pagination';
import { useState } from 'react';

const ManageProductsPage = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, refetch } = useGetProductsQuery({ page, limit: 10 });
  const [deleteProduct, { isLoading: deleting }] = useDeleteProductMutation();

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id).unwrap();
        toast.success('Product deleted successfully');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || 'Failed to delete product');
      }
    }
  };

  return (
    <>
      <Helmet><title>Manage Products — ByteNest</title></Helmet>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold">Products</h1>
            <p className="text-sm text-surface-500 mt-1">Manage catalog inventory, prices, and settings.</p>
          </div>
          <Link to="/admin/products/add" className="btn-primary flex items-center gap-1.5 text-sm">
            <HiOutlinePlus className="w-5 h-5" /> Add Product
          </Link>
        </div>

        <div className="card p-6">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="w-full h-12" />
              <Skeleton className="w-full h-12" />
              <Skeleton className="w-full h-12" />
            </div>
          ) : !data || data.products.length === 0 ? (
            <p className="text-surface-500 text-center py-4">No products found in catalog.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-surface-200 dark:border-surface-700 text-sm text-surface-500">
                    <th className="pb-3 pr-4">Image</th>
                    <th className="pb-3 px-4">Name</th>
                    <th className="pb-3 px-4">Brand</th>
                    <th className="pb-3 px-4">Category</th>
                    <th className="pb-3 px-4">Price</th>
                    <th className="pb-3 px-4">Stock</th>
                    <th className="pb-3 pl-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.products.map((product) => (
                    <tr key={product._id} className="border-b border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800/30">
                      <td className="py-3 pr-4">
                        <img src={product.image} alt="" className="w-12 h-12 object-contain bg-surface-50 dark:bg-surface-800 rounded-lg p-1" />
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold max-w-[200px] truncate">{product.name}</td>
                      <td className="py-3 px-4 text-sm">{product.brand}</td>
                      <td className="py-3 px-4 text-sm">{product.category}</td>
                      <td className="py-3 px-4 text-sm font-semibold">{formatPrice(product.discountPrice || product.price)}</td>
                      <td className="py-3 px-4">
                        <span className={`badge ${product.countInStock > 0 ? 'badge-success' : 'badge-danger'}`}>
                          {product.countInStock} Left
                        </span>
                      </td>
                      <td className="py-3 pl-4">
                        <div className="flex gap-2">
                          <Link to={`/admin/products/edit/${product._id}`} className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg text-surface-600 dark:text-surface-400">
                            <HiOutlinePencil className="w-4.5 h-4.5" />
                          </Link>
                          <button onClick={() => handleDelete(product._id)} disabled={deleting} className="p-2 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg text-red-600">
                            <HiOutlineTrash className="w-4.5 h-4.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {data && <Pagination page={data.page} pages={data.pages} onPageChange={(p) => setPage(p)} />}
        </div>
      </div>
    </>
  );
};

export default ManageProductsPage;

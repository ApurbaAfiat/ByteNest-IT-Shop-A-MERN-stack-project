import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import { useGetAllCategoriesQuery, useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation } from '../../slices/categoriesApiSlice';
import Skeleton from '../../components/ui/Skeleton';

const ManageCategoriesPage = () => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [editId, setEditId] = useState(null);

  const { data: categories, isLoading, refetch } = useGetAllCategoriesQuery();
  const [createCategory, { isLoading: creating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: updating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: deleting }] = useDeleteCategoryMutation();

  const handleEditClick = (cat) => {
    setEditId(cat._id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
  };

  const handleCancelEdit = () => {
    setEditId(null);
    setName('');
    setSlug('');
    setDescription('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !slug) return;
    try {
      if (editId) {
        await updateCategory({ id: editId, name, slug, description }).unwrap();
        toast.success('Category updated successfully');
      } else {
        await createCategory({ name, slug, description }).unwrap();
        toast.success('Category created successfully');
      }
      handleCancelEdit();
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id).unwrap();
        toast.success('Category deleted successfully');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || 'Failed to delete category');
      }
    }
  };

  return (
    <>
      <Helmet><title>Manage Categories — ByteNest</title></Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Categories</h1>
          <p className="text-sm text-surface-500 mt-1">Add, update, or remove product categories.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Category Form */}
          <div className="card p-6 h-fit">
            <h3 className="font-display font-bold text-lg border-b pb-3 mb-4">
              {editId ? 'Edit Category' : 'Create Category'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Category Name</label>
                <input type="text" value={name} onChange={(e) => { setName(e.target.value); if (!editId) setSlug(e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')); }} className="input" placeholder="Laptops" required />
              </div>
              <div>
                <label className="label">Category Slug</label>
                <input type="text" value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''))} className="input" placeholder="laptops" required />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="input" placeholder="Enter description..." />
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={creating || updating} className="btn-primary">
                  {editId ? 'Save' : 'Create'}
                </button>
                {editId && <button type="button" onClick={handleCancelEdit} className="btn-secondary">Cancel</button>}
              </div>
            </form>
          </div>

          {/* Category List */}
          <div className="lg:col-span-2 card p-6">
            <h3 className="font-display font-bold text-lg border-b pb-3 mb-4">All Categories</h3>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="w-full h-12" />
                <Skeleton className="w-full h-12" />
              </div>
            ) : !categories || categories.length === 0 ? (
              <p className="text-surface-500 py-4 text-center">No categories found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-surface-200 dark:border-surface-700 text-surface-500">
                      <th className="pb-3 pr-4">Name</th>
                      <th className="pb-3 px-4">Slug</th>
                      <th className="pb-3 px-4">Description</th>
                      <th className="pb-3 pl-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat) => (
                      <tr key={cat._id} className="border-b border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800/30">
                        <td className="py-3.5 pr-4 font-semibold">{cat.name}</td>
                        <td className="py-3.5 px-4 font-mono text-xs">{cat.slug}</td>
                        <td className="py-3.5 px-4 truncate max-w-[200px] text-surface-500">{cat.description || '—'}</td>
                        <td className="py-3.5 pl-4">
                          <div className="flex gap-2">
                            <button onClick={() => handleEditClick(cat)} className="p-1.5 hover:bg-surface-100 dark:hover:bg-surface-700 rounded text-surface-600 dark:text-surface-400">
                              <HiOutlinePencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(cat._id)} disabled={deleting} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 rounded text-red-600">
                              <HiOutlineTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageCategoriesPage;

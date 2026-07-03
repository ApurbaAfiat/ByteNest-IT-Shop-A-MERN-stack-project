import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { HiOutlineLockClosed, HiOutlineLockOpen, HiOutlineTrash } from 'react-icons/hi';
import { useGetUsersQuery, useBlockUserMutation, useUnblockUserMutation, useDeleteUserMutation } from '../../slices/usersApiSlice';
import Skeleton from '../../components/ui/Skeleton';

const ManageUsersPage = () => {
  const { data: users, isLoading, refetch } = useGetUsersQuery();
  const [blockUser, { isLoading: blocking }] = useBlockUserMutation();
  const [unblockUser, { isLoading: unblocking }] = useUnblockUserMutation();
  const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation();

  const handleBlockToggle = async (user) => {
    try {
      if (user.isBlocked) {
        await unblockUser(user._id).unwrap();
        toast.success('User unblocked successfully');
      } else {
        await blockUser(user._id).unwrap();
        toast.success('User blocked successfully');
      }
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || 'Action failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id).unwrap();
        toast.success('User deleted successfully');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || 'Failed to delete user');
      }
    }
  };

  return (
    <>
      <Helmet><title>Manage Users — ByteNest</title></Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Users</h1>
          <p className="text-sm text-surface-500 mt-1">Manage user access permissions, blocking, and deletion.</p>
        </div>

        <div className="card p-6">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="w-full h-12" />
              <Skeleton className="w-full h-12" />
            </div>
          ) : !users || users.length === 0 ? (
            <p className="text-surface-500 text-center py-4">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-surface-200 dark:border-surface-700 text-surface-500">
                    <th className="pb-3 pr-4">Name</th>
                    <th className="pb-3 px-4">Email</th>
                    <th className="pb-3 px-4">Phone</th>
                    <th className="pb-3 px-4">Role</th>
                    <th className="pb-3 px-4">Status</th>
                    <th className="pb-3 pl-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800/30">
                      <td className="py-3.5 pr-4 font-semibold">{user.name}</td>
                      <td className="py-3.5 px-4 font-mono text-xs">{user.email}</td>
                      <td className="py-3.5 px-4">{user.phone || '—'}</td>
                      <td className="py-3.5 px-4">
                        {user.isAdmin ? (
                          <span className="badge bg-primary-100 text-primary-700 font-bold">Admin</span>
                        ) : (
                          <span className="badge bg-surface-100 text-surface-700">Customer</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {user.isBlocked ? (
                          <span className="badge bg-red-100 text-red-700 font-bold">Blocked</span>
                        ) : (
                          <span className="badge bg-emerald-100 text-emerald-700">Active</span>
                        )}
                      </td>
                      <td className="py-3.5 pl-4">
                        {!user.isAdmin && (
                          <div className="flex gap-2">
                            <button onClick={() => handleBlockToggle(user)} disabled={blocking || unblocking} className="p-1.5 hover:bg-surface-100 dark:hover:bg-surface-700 rounded text-surface-600 dark:text-surface-400" title={user.isBlocked ? 'Unblock' : 'Block'}>
                              {user.isBlocked ? <HiOutlineLockOpen className="w-4.5 h-4.5" /> : <HiOutlineLockClosed className="w-4.5 h-4.5" />}
                            </button>
                            <button onClick={() => handleDelete(user._id)} disabled={deleting} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/20 rounded text-red-600" title="Delete">
                              <HiOutlineTrash className="w-4.5 h-4.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ManageUsersPage;

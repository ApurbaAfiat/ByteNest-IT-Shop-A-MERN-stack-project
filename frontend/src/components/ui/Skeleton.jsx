const Skeleton = ({ className = '', variant = 'rect' }) => {
  const variants = {
    rect: 'rounded-lg',
    circle: 'rounded-full',
    text: 'rounded h-4',
  };

  return <div className={`skeleton ${variants[variant]} ${className}`} />;
};

export const ProductCardSkeleton = () => (
  <div className="card p-0">
    <Skeleton className="w-full h-48" />
    <div className="p-4 space-y-3">
      <Skeleton variant="text" className="w-3/4 h-3" />
      <Skeleton variant="text" className="w-full h-4" />
      <Skeleton variant="text" className="w-1/2 h-3" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="w-20 h-6" />
        <Skeleton className="w-24 h-9 rounded-lg" />
      </div>
    </div>
  </div>
);

export const ProductDetailsSkeleton = () => (
  <div className="container-custom py-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Skeleton className="w-full h-96 rounded-2xl" />
      <div className="space-y-4">
        <Skeleton variant="text" className="w-1/3 h-4" />
        <Skeleton variant="text" className="w-full h-8" />
        <Skeleton variant="text" className="w-1/2 h-5" />
        <Skeleton className="w-32 h-10" />
        <Skeleton variant="text" className="w-full h-20" />
        <div className="flex gap-3">
          <Skeleton className="w-32 h-12 rounded-xl" />
          <Skeleton className="flex-1 h-12 rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

export default Skeleton;

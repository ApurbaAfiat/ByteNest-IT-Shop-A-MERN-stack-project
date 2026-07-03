import { HiStar, HiOutlineStar } from 'react-icons/hi';

const Rating = ({ value, count, showCount = true, size = 'sm' }) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star}>
            {value >= star ? (
              <HiStar className={`${sizeClasses[size]} text-amber-400`} />
            ) : value >= star - 0.5 ? (
              <HiStar className={`${sizeClasses[size]} text-amber-400 opacity-50`} />
            ) : (
              <HiOutlineStar className={`${sizeClasses[size]} text-surface-300 dark:text-surface-600`} />
            )}
          </span>
        ))}
      </div>
      {showCount && count !== undefined && (
        <span className="text-xs text-surface-500">({count})</span>
      )}
    </div>
  );
};

export default Rating;

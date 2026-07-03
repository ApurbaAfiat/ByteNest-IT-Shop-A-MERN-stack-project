import { Link } from 'react-router-dom';
import { HiChevronRight } from 'react-icons/hi';

const Breadcrumb = ({ items }) => {
  return (
    <nav className="flex items-center gap-1 text-sm text-surface-500 dark:text-surface-400 py-4 overflow-x-auto no-scrollbar">
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-1 whitespace-nowrap">
          {index > 0 && <HiChevronRight className="w-4 h-4 text-surface-400 flex-shrink-0" />}
          {item.href ? (
            <Link to={item.href} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-surface-900 dark:text-white font-medium">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumb;

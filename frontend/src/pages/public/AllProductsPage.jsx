import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useGetProductsQuery, useGetBrandsQuery } from '../../slices/productsApiSlice';
import { useGetCategoriesQuery } from '../../slices/categoriesApiSlice';
import ProductCard from '../../components/product/ProductCard';
import { ProductCardSkeleton } from '../../components/ui/Skeleton';
import Pagination from '../../components/ui/Pagination';
import Breadcrumb from '../../components/ui/Breadcrumb';
import { HiOutlineAdjustments, HiOutlineX } from 'react-icons/hi';

const AllProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const page = Number(searchParams.get('page')) || 1;
  const category = searchParams.get('category') || '';
  const brand = searchParams.get('brand') || '';
  const sort = searchParams.get('sort') || 'newest';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const { data, isLoading } = useGetProductsQuery({ page, limit: 12, category, brand, sort, minPrice, maxPrice });
  const { data: categories } = useGetCategoriesQuery();
  const { data: brands } = useGetBrandsQuery();

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) { params.set(key, value); } else { params.delete(key); }
    params.set('page', '1');
    setSearchParams(params);
  };

  const clearFilters = () => setSearchParams({});

  const hasFilters = category || brand || minPrice || maxPrice;

  return (
    <>
      <Helmet><title>All Products — ByteNest</title></Helmet>
      <div className="container-custom">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'All Products' }]} />

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="section-title">All Products</h1>
            {data && <p className="text-sm text-surface-500 mt-1">{data.total} products found</p>}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowFilters(!showFilters)} className="btn-secondary btn-sm md:hidden">
              <HiOutlineAdjustments className="w-4 h-4" /> Filters
            </button>
            <select value={sort} onChange={(e) => updateFilter('sort', e.target.value)} className="input py-2 w-auto text-sm">
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="name-asc">Name: A-Z</option>
            </select>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside className={`${showFilters ? 'fixed inset-0 z-50 bg-white dark:bg-surface-900 p-6 overflow-y-auto' : 'hidden'} md:block md:static md:w-64 flex-shrink-0`}>
            <div className="flex items-center justify-between md:hidden mb-4">
              <h3 className="font-display font-bold text-lg">Filters</h3>
              <button onClick={() => setShowFilters(false)}><HiOutlineX className="w-5 h-5" /></button>
            </div>

            {hasFilters && (
              <button onClick={clearFilters} className="text-sm text-red-500 hover:text-red-600 mb-4 font-medium">
                Clear all filters
              </button>
            )}

            {/* Category filter */}
            <div className="mb-6">
              <h4 className="font-semibold text-surface-900 dark:text-white mb-3 text-sm">Category</h4>
              <div className="space-y-2">
                {categories?.map((cat) => (
                  <label key={cat._id} className="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" name="category" checked={category === cat.name} onChange={() => updateFilter('category', category === cat.name ? '' : cat.name)}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500" />
                    <span className="text-sm text-surface-700 dark:text-surface-300 group-hover:text-primary-600">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brand filter */}
            <div className="mb-6">
              <h4 className="font-semibold text-surface-900 dark:text-white mb-3 text-sm">Brand</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {brands?.map((b) => (
                  <label key={b} className="flex items-center gap-2 cursor-pointer group">
                    <input type="radio" name="brand" checked={brand === b} onChange={() => updateFilter('brand', brand === b ? '' : b)}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500" />
                    <span className="text-sm text-surface-700 dark:text-surface-300 group-hover:text-primary-600">{b}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h4 className="font-semibold text-surface-900 dark:text-white mb-3 text-sm">Price Range</h4>
              <div className="flex gap-2">
                <input type="number" placeholder="Min" value={minPrice} onChange={(e) => updateFilter('minPrice', e.target.value)} className="input py-2 text-sm" />
                <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => updateFilter('maxPrice', e.target.value)} className="input py-2 text-sm" />
              </div>
            </div>

            <button onClick={() => setShowFilters(false)} className="btn-primary w-full md:hidden">Apply Filters</button>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {isLoading
                ? Array(12).fill(0).map((_, i) => <ProductCardSkeleton key={i} />)
                : data?.products?.length > 0
                  ? data.products.map((p) => <ProductCard key={p._id} product={p} />)
                  : <p className="col-span-full text-center text-surface-500 py-12">No products match your filters.</p>
              }
            </div>
            {data && <Pagination page={data.page} pages={data.pages} onPageChange={(p) => updateFilter('page', String(p))} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default AllProductsPage;

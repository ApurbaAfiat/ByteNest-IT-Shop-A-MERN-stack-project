import { useParams, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useGetProductsQuery } from '../../slices/productsApiSlice';
import ProductCard from '../../components/product/ProductCard';
import { ProductCardSkeleton } from '../../components/ui/Skeleton';
import Pagination from '../../components/ui/Pagination';
import Breadcrumb from '../../components/ui/Breadcrumb';

const categoryNames = { laptops: 'Laptops', earbuds: 'Earbuds', smartwatches: 'Smartwatches', accessories: 'Accessories' };

const CategoryPage = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const sort = searchParams.get('sort') || 'newest';
  const categoryName = categoryNames[slug] || slug;

  const { data, isLoading } = useGetProductsQuery({ page, limit: 12, category: categoryName, sort });

  return (
    <>
      <Helmet><title>{categoryName} — ByteNest</title></Helmet>
      <div className="container-custom">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Products', href: '/products' }, { label: categoryName }]} />
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="section-title">{categoryName}</h1>
            {data && <p className="text-sm text-surface-500 mt-1">{data.total} products</p>}
          </div>
          <select value={sort} onChange={(e) => { const p = new URLSearchParams(searchParams); p.set('sort', e.target.value); p.set('page', '1'); setSearchParams(p); }} className="input py-2 w-auto text-sm">
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {isLoading ? Array(8).fill(0).map((_, i) => <ProductCardSkeleton key={i} />) : data?.products?.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
        {data && <Pagination page={data.page} pages={data.pages} onPageChange={(p) => { const params = new URLSearchParams(searchParams); params.set('page', String(p)); setSearchParams(params); }} />}
      </div>
    </>
  );
};

export default CategoryPage;

import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useGetProductsQuery } from '../../slices/productsApiSlice';
import ProductCard from '../../components/product/ProductCard';
import { ProductCardSkeleton } from '../../components/ui/Skeleton';
import Pagination from '../../components/ui/Pagination';
import Breadcrumb from '../../components/ui/Breadcrumb';

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const page = Number(searchParams.get('page')) || 1;

  const { data, isLoading } = useGetProductsQuery({ page, limit: 12, keyword: q });

  return (
    <>
      <Helmet><title>Search Results for "{q}" — ByteNest</title></Helmet>
      <div className="container-custom pb-12">
        <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Search Results' }]} />
        <div className="mb-6">
          <h1 className="section-title">Search Results</h1>
          <p className="text-sm text-surface-500 mt-1">Showing results for "{q}"</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {isLoading ? Array(4).fill(0).map((_, i) => <ProductCardSkeleton key={i} />) : data?.products?.length > 0 ? data.products.map((p) => <ProductCard key={p._id} product={p} />) : <div className="col-span-full text-center py-12"><p className="text-surface-500">No products found matching your query.</p><Link to="/products" className="btn-primary mt-4 inline-block">Browse All Products</Link></div>}
        </div>

        {data && <Pagination page={data.page} pages={data.pages} onPageChange={(p) => { const params = new URLSearchParams(searchParams); params.set('page', String(p)); setSearchParams(params); }} />}
      </div>
    </>
  );
};

export default SearchResultsPage;

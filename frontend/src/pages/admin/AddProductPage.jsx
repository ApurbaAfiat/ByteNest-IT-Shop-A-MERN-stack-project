import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useCreateProductMutation } from '../../slices/productsApiSlice';
import { useGetCategoriesQuery } from '../../slices/categoriesApiSlice';
import { UPLOAD_URL } from '../../constants';

const AddProductPage = () => {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('Laptops');
  const [model, setModel] = useState('');
  const [sku, setSku] = useState('');
  const [image, setImage] = useState('');
  const [images, setImages] = useState([]);
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [warranty, setWarranty] = useState('1 Year Warranty');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);

  // Specifications
  const [specs, setSpecs] = useState({
    processor: '', ram: '', storage: '', gpu: '', display: '', battery: '', os: '', weight: '',
    driverSize: '', bluetoothVersion: '', batteryLife: '', ancSupport: '', waterResistance: '',
    sensors: '', waterproofRating: '', type: '', connectivity: '', layout: ''
  });

  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const { data: categoriesList } = useGetCategoriesQuery();

  const handleUpload = async (e, isGallery = false) => {
    const files = Array.from(e.target.files);
    const formData = new FormData();
    files.forEach(file => formData.append('image', file));

    setUploading(true);
    try {
      const res = await axios.post(UPLOAD_URL, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (isGallery) {
        setImages([...images, ...res.data.paths]);
      } else {
        setImage(res.data.path);
      }
      toast.success('Image uploaded successfully');
    } catch (err) {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSpecChange = (key, val) => {
    setSpecs({ ...specs, [key]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Filter specifications
    const filteredSpecs = {};
    Object.entries(specs).forEach(([k, v]) => {
      if (v.trim()) filteredSpecs[k] = v;
    });

    try {
      await createProduct({
        name, brand, category, model, sku, image, images, shortDescription, description,
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : 0,
        countInStock: Number(countInStock),
        warranty, isFeatured, isNewArrival,
        specifications: filteredSpecs
      }).unwrap();

      toast.success('Product created successfully');
      navigate('/admin/products');
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to create product');
    }
  };

  return (
    <>
      <Helmet><title>Add Product — ByteNest</title></Helmet>
      <div className="space-y-6 max-w-4xl">
        <h1 className="text-2xl md:text-3xl font-display font-bold">Add New Product</h1>

        <form onSubmit={handleSubmit} className="card p-6 space-y-6">
          {/* General */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Product Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input" required />
            </div>
            <div>
              <label className="label">Brand</label>
              <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} className="input" required />
            </div>
            <div>
              <label className="label">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="input">
                {categoriesList?.map((cat) => (
                  <option key={cat._id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Model</label>
                <input type="text" value={model} onChange={(e) => setModel(e.target.value)} className="input" />
              </div>
              <div>
                <label className="label">SKU</label>
                <input type="text" value={sku} onChange={(e) => setSku(e.target.value)} className="input" required />
              </div>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Regular Price (৳)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="input" required />
            </div>
            <div>
              <label className="label">Discount Price (৳)</label>
              <input type="number" value={discountPrice} onChange={(e) => setDiscountPrice(e.target.value)} className="input" placeholder="0 or blank" />
            </div>
            <div>
              <label className="label">Count in Stock</label>
              <input type="number" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} className="input" required />
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Warranty Info</label>
              <input type="text" value={warranty} onChange={(e) => setWarranty(e.target.value)} className="input" />
            </div>
            <div className="flex items-center gap-6 pt-8">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="text-primary-600 focus:ring-primary-500 rounded" />
                <span className="text-sm font-semibold">Featured Product</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={isNewArrival} onChange={(e) => setIsNewArrival(e.target.checked)} className="text-primary-600 focus:ring-primary-500 rounded" />
                <span className="text-sm font-semibold">New Arrival</span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="label">Short Feature Summary</label>
            <input type="text" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} className="input" placeholder="13th Gen Intel Core i7, RTX 4050, 16GB DDR5, 512GB SSD" />
          </div>
          <div>
            <label className="label">Full Product Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="input" required />
          </div>

          {/* Media upload */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t">
            <div>
              <label className="label">Primary Image URL</label>
              <input type="text" value={image} onChange={(e) => setImage(e.target.value)} className="input mb-2" required />
              <input type="file" onChange={handleUpload} className="text-sm" />
            </div>
            <div>
              <label className="label">Image Gallery URLs (separated by comma)</label>
              <input type="text" value={images.join(',')} onChange={(e) => setImages(e.target.value.split(','))} className="input mb-2" />
              <input type="file" multiple onChange={(e) => handleUpload(e, true)} className="text-sm" />
            </div>
          </div>

          {/* Specifications */}
          <div className="pt-6 border-t space-y-4">
            <h3 className="font-display font-bold text-lg">Product Specifications</h3>
            <p className="text-xs text-surface-500">Only fill in fields applicable to this product category.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Object.keys(specs).map((key) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-surface-500 mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                  <input type="text" value={specs[key]} onChange={(e) => handleSpecChange(key, e.target.value)} className="input py-2 text-xs" />
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6 border-t">
            <button type="submit" disabled={isLoading || uploading} className="btn-primary">
              {isLoading ? 'Creating Product...' : 'Create Product'}
            </button>
            <Link to="/admin/products" className="btn-secondary">Cancel</Link>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddProductPage;

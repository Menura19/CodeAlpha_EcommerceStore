import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext.jsx';

function ProductDetail() {
  const { id } = useParams();
  const { addToCart, cartCount } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data.product);
      } catch (err) {
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  if (loading) {
    return <div className="p-8">Loading product...</div>;
  }

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!product) {
    return <div className="p-8">Product not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/products"
            className="text-blue-600 hover:underline"
          >
            ← Back to Products
          </Link>

          <Link
            to="/cart"
            className="rounded-lg bg-white px-4 py-2 shadow"
          >
            Cart ({cartCount})
          </Link>
        </div>

        <div className="grid gap-8 rounded-xl bg-white p-6 shadow md:grid-cols-2">
          <div>
            <img
              src={product.image}
              alt={product.name}
              className="w-full rounded-xl object-cover"
            />
          </div>

          <div>
            <p className="mb-2 text-sm text-gray-500">
              {product.category}
            </p>

            <h1 className="mb-4 text-3xl font-bold">
              {product.name}
            </h1>

            <p className="mb-6 text-gray-600">
              {product.description}
            </p>

            <p className="mb-4 text-2xl font-bold">
              Rs. {product.price.toLocaleString()}
            </p>

            <p className="mb-4">
              ⭐ {product.rating}
            </p>

            <p className="mb-6">
              Stock: {product.stock}
            </p>

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full rounded-lg bg-black px-5 py-3 text-white disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {product.stock === 0
                ? 'Out of Stock'
                : added
                ? 'Added to Cart ✓'
                : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
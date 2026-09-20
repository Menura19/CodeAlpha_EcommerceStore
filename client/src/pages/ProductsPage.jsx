import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data.products);
      } catch (err) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <h2 className="text-xl font-semibold">Loading products...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold">Products</h1>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product._id}
              className="overflow-hidden rounded-xl bg-white shadow"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-56 w-full object-cover"
              />

              <div className="p-5">
                <p className="mb-2 text-sm text-gray-500">
                  {product.category}
                </p>

                <h2 className="mb-2 text-xl font-semibold">
                  {product.name}
                </h2>

                <p className="mb-4 text-sm text-gray-600">
                  {product.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">
                    Rs. {product.price.toLocaleString()}
                  </span>

                  <span className="text-sm text-gray-500">
                    ⭐ {product.rating}
                  </span>
                </div>

                <Link
                  to={`/product/${product._id}`}
                  className="mt-5 block w-full rounded-lg bg-black px-4 py-2 text-center text-white"
                >
                  View Product
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext.jsx';

function Checkout() {
  const navigate = useNavigate();

  const {
    cartItems,
    cartTotal,
    clearCart,
  } = useCart();

  const [formData, setFormData] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: 'Sri Lanka',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const orderItems = cartItems.map((item) => ({
        product: item._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      }));

      await api.post('/orders', {
        orderItems,
        shippingAddress: formData,
        totalPrice: cartTotal,
      });

      clearCart();

      navigate('/my-orders');
    } catch (err) {
      setError(err.message || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/cart"
          className="mb-6 inline-block text-blue-600 hover:underline"
        >
          ← Back to Cart
        </Link>

        <div className="rounded-xl bg-white p-8 shadow">
          <h1 className="mb-6 text-3xl font-bold">
            Checkout
          </h1>

          {error && (
            <div className="mb-5 rounded-lg bg-red-50 p-4 text-red-600">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label className="mb-2 block font-medium">
                Address
              </label>

              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full rounded-lg border px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                City
              </label>

              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full rounded-lg border px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Postal Code
              </label>

              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                required
                className="w-full rounded-lg border px-4 py-3"
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Country
              </label>

              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                className="w-full rounded-lg border px-4 py-3"
              />
            </div>

            <div className="border-t pt-5">
              <div className="mb-5 flex justify-between text-xl font-bold">
                <span>Total</span>
                <span>
                  Rs. {cartTotal.toLocaleString()}
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-black px-5 py-3 text-white disabled:opacity-50"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
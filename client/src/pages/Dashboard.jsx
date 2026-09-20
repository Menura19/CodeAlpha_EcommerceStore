import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext.jsx';

function Dashboard() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold">CodeAlpha Store</h1>
            <p className="text-sm text-gray-500">
              Simple E-commerce Store
            </p>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-gray-600 sm:inline">
              Hi, {user?.name}
            </span>

            <button
              onClick={logout}
              className="rounded-lg border px-4 py-2 text-sm"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12">
        <section className="rounded-2xl bg-white p-8 shadow">
          <p className="mb-2 text-sm font-medium text-blue-600">
            Welcome back
          </p>

          <h2 className="mb-4 text-4xl font-bold">
            Shop your favorite products
          </h2>

          <p className="mb-8 max-w-2xl text-gray-600">
            Browse products, add items to your cart, place orders,
            and view your order history.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/products"
              className="rounded-lg bg-black px-6 py-3 text-white"
            >
              Browse Products
            </Link>

            <Link
              to="/cart"
              className="rounded-lg border px-6 py-3"
            >
              Cart ({cartCount})
            </Link>

            <Link
              to="/my-orders"
              className="rounded-lg border px-6 py-3"
            >
              My Orders
            </Link>
          </div>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-3">
          <Link
            to="/products"
            className="rounded-xl bg-white p-6 shadow transition hover:-translate-y-1"
          >
            <h3 className="mb-2 text-xl font-semibold">
              Products
            </h3>

            <p className="text-gray-600">
              Explore all available products and view details.
            </p>
          </Link>

          <Link
            to="/cart"
            className="rounded-xl bg-white p-6 shadow transition hover:-translate-y-1"
          >
            <h3 className="mb-2 text-xl font-semibold">
              Shopping Cart
            </h3>

            <p className="text-gray-600">
              Review your selected products and quantities.
            </p>
          </Link>

          <Link
            to="/my-orders"
            className="rounded-xl bg-white p-6 shadow transition hover:-translate-y-1"
          >
            <h3 className="mb-2 text-xl font-semibold">
              My Orders
            </h3>

            <p className="text-gray-600">
              View your previous orders and current order status.
            </p>
          </Link>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
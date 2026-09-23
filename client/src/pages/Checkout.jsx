import { useState } from 'react';
import {
  Link,
  useNavigate,
} from 'react-router-dom';

import api from '../api/axios';
import { useCart } from '../context/CartContext.jsx';

function Checkout() {
  const navigate = useNavigate();

  const {
    cartItems,
    cartCount,
    cartTotal,
    clearCart,
  } = useCart();

  const [formData, setFormData] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: 'Sri Lanka',
  });

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState('');

  /* =====================================================
     FORM HANDLING
  ===================================================== */
  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  /* =====================================================
     PLACE ORDER
  ===================================================== */
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (cartItems.length === 0) {
      setError(
        'Your cart is empty. Add products before placing an order.'
      );
      return;
    }

    try {
      setLoading(true);
      setError('');

      const orderItems = cartItems.map(
        (item) => ({
          product: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
        })
      );

      await api.post('/orders', {
        orderItems,
        shippingAddress: formData,
        totalPrice: cartTotal,
      });

      clearCart();

      navigate('/my-orders');
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err.message ||
          'Failed to place order.'
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     EMPTY CART STATE
  ===================================================== */
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8f9ff]">
        <main className="mx-auto max-w-[1280px] px-6 py-12 lg:px-12">

          <nav className="flex items-center gap-2 text-[13px] font-semibold">
            <Link
              to="/"
              className="text-[#434655] transition hover:text-[#004ac6]"
            >
              Home
            </Link>

            <span className="text-[#a3a7b3]">
              ›
            </span>

            <Link
              to="/cart"
              className="text-[#434655] transition hover:text-[#004ac6]"
            >
              Cart
            </Link>

            <span className="text-[#a3a7b3]">
              ›
            </span>

            <span className="text-[#0b1c30]">
              Checkout
            </span>
          </nav>

          <section className="flex min-h-[520px] items-center justify-center">
            <div className="w-full max-w-[600px] rounded-2xl border border-[rgba(195,198,215,0.6)] bg-white p-10 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eff4ff] text-[#004ac6]">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle
                    cx="9"
                    cy="20"
                    r="1"
                  />

                  <circle
                    cx="18"
                    cy="20"
                    r="1"
                  />

                  <path d="M3 4h2l2 11h10l2-7H7" />
                </svg>
              </div>

              <h1 className="mt-6 text-[30px] font-bold tracking-[-0.025em] text-[#0b1c30]">
                Your cart is empty
              </h1>

              <p className="mt-3 text-sm leading-6 text-[#565e74]">
                Add products to your cart before
                continuing to checkout.
              </p>

              <Link
                to="/products"
                className="mt-7 inline-flex h-12 items-center justify-center rounded-xl bg-[#004ac6] px-7 text-sm font-semibold text-white transition hover:bg-[#003ca1]"
              >
                Browse Products
              </Link>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff]">

      {/* =================================================
          MAIN CONTENT
      ================================================== */}
      <main className="mx-auto max-w-[1280px] px-6 pb-24 pt-10 lg:px-12">

        {/* =================================================
            BREADCRUMB
        ================================================== */}
        <nav className="flex items-center gap-2 text-[13px] font-semibold">
          <Link
            to="/"
            className="text-[#434655] transition hover:text-[#004ac6]"
          >
            Home
          </Link>

          <span className="text-[#a3a7b3]">
            ›
          </span>

          <Link
            to="/cart"
            className="text-[#434655] transition hover:text-[#004ac6]"
          >
            Cart
          </Link>

          <span className="text-[#a3a7b3]">
            ›
          </span>

          <span className="text-[#0b1c30]">
            Checkout
          </span>
        </nav>

        {/* =================================================
            PAGE HEADER
        ================================================== */}
        <section className="mt-6">
          <h1 className="text-[36px] font-semibold leading-[44px] tracking-[-0.025em] text-[#0b1c30]">
            Checkout
          </h1>

          <p className="mt-2 text-[18px] leading-7 text-[#434655]">
            Provide your delivery details to
            complete your order.
          </p>
        </section>

        {/* =================================================
            FIGMA 7 / 5 COLUMN LAYOUT
        ================================================== */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 grid gap-8 lg:grid-cols-[7fr_5fr] lg:items-start"
        >

          {/* =================================================
              LEFT: SHIPPING FORM
          ================================================== */}
          <section className="rounded-2xl border border-[rgba(195,198,215,0.6)] bg-white p-6 shadow-sm sm:p-8">

            {/* Header */}
            <div className="flex items-center gap-3 border-b border-[rgba(195,198,215,0.4)] pb-6">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eff4ff] text-[#004ac6]">
                <svg
                  width="22"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M3 7h12v9H3z" />
                  <path d="M15 10h3l3 3v3h-6z" />
                  <circle
                    cx="7"
                    cy="18"
                    r="2"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="2"
                  />
                </svg>
              </div>

              <div>
                <h2 className="text-[20px] font-semibold leading-7 text-[#0b1c30]">
                  Shipping Information
                </h2>

                <p className="mt-0.5 text-[13px] leading-5 text-[#434655]">
                  Enter the address where your
                  order should be delivered.
                </p>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-medium text-red-600">
                {error}
              </div>
            )}

            {/* =================================================
                STREET ADDRESS
            ================================================== */}
            <div className="mt-6">
              <label
                htmlFor="address"
                className="mb-2 block text-[13px] font-semibold text-[#0b1c30]"
              >
                Street Address{' '}
                <span className="text-[#ba1a1a]">
                  *
                </span>
              </label>

              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#565e74]"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
                  <circle
                    cx="12"
                    cy="10"
                    r="2"
                  />
                </svg>

                <input
                  id="address"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  placeholder="No. 42, Galle Road"
                  autoComplete="street-address"
                  className="
                    h-12 w-full
                    rounded-xl
                    border border-[rgba(195,198,215,0.8)]
                    bg-white
                    pl-11 pr-4
                    text-[15px]
                    text-[#0b1c30]
                    outline-none
                    transition
                    placeholder:text-[#9ca3af]
                    focus:border-[#2563eb]
                    focus:ring-2
                    focus:ring-blue-100
                  "
                />
              </div>
            </div>

            {/* =================================================
                CITY / POSTAL / COUNTRY
            ================================================== */}
            <div className="mt-6 grid gap-4 sm:grid-cols-3">

              {/* City */}
              <div>
                <label
                  htmlFor="city"
                  className="mb-2 block text-[13px] font-semibold text-[#0b1c30]"
                >
                  City{' '}
                  <span className="text-[#ba1a1a]">
                    *
                  </span>
                </label>

                <input
                  id="city"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="Colombo"
                  autoComplete="address-level2"
                  className="
                    h-12 w-full
                    rounded-xl
                    border border-[rgba(195,198,215,0.8)]
                    bg-white
                    px-4
                    text-[15px]
                    text-[#0b1c30]
                    outline-none
                    transition
                    placeholder:text-[#9ca3af]
                    focus:border-[#2563eb]
                    focus:ring-2
                    focus:ring-blue-100
                  "
                />
              </div>

              {/* Postal Code */}
              <div>
                <label
                  htmlFor="postalCode"
                  className="mb-2 block text-[13px] font-semibold text-[#0b1c30]"
                >
                  Postal Code{' '}
                  <span className="text-[#ba1a1a]">
                    *
                  </span>
                </label>

                <input
                  id="postalCode"
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                  placeholder="00300"
                  autoComplete="postal-code"
                  className="
                    h-12 w-full
                    rounded-xl
                    border border-[rgba(195,198,215,0.8)]
                    bg-white
                    px-4
                    text-[15px]
                    text-[#0b1c30]
                    outline-none
                    transition
                    placeholder:text-[#9ca3af]
                    focus:border-[#2563eb]
                    focus:ring-2
                    focus:ring-blue-100
                  "
                />
              </div>

              {/* Country */}
              <div>
                <label
                  htmlFor="country"
                  className="mb-2 block text-[13px] font-semibold text-[#0b1c30]"
                >
                  Country{' '}
                  <span className="text-[#ba1a1a]">
                    *
                  </span>
                </label>

                <input
                  id="country"
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  autoComplete="country-name"
                  className="
                    h-12 w-full
                    rounded-xl
                    border border-[rgba(195,198,215,0.7)]
                    bg-[#eff4ff]
                    px-4
                    text-[15px]
                    font-medium
                    text-[#0b1c30]
                    outline-none
                    transition
                    focus:border-[#2563eb]
                    focus:ring-2
                    focus:ring-blue-100
                  "
                />
              </div>
            </div>

            {/* =================================================
                ORDER NOTICE
            ================================================== */}
            <div className="mt-6 flex gap-3 rounded-xl border border-[rgba(37,99,235,0.3)] bg-[#eff4ff] p-4">

              <div className="mt-0.5 shrink-0 text-[#2563eb]">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                  />

                  <path d="M12 11v5" />
                  <path d="M12 8h.01" />
                </svg>
              </div>

              <div>
                <p className="text-[13px] font-bold text-[#0b1c30]">
                  Order Processing
                </p>

                <p className="mt-1 text-[13px] leading-5 text-[#434655]">
                  Review your delivery information
                  before placing the order.
                  Your current order total is{' '}
                  <span className="font-bold text-[#0b1c30]">
                    Rs.{' '}
                    {Number(
                      cartTotal
                    ).toLocaleString()}
                  </span>
                  .
                </p>
              </div>
            </div>

            {/* =================================================
                PLACE ORDER BUTTON
            ================================================== */}
            <button
              type="submit"
              disabled={loading}
              className="
                mt-6
                flex h-14 w-full
                items-center justify-center
                gap-3
                rounded-xl
                bg-[#2563eb]
                px-5
                text-[15px]
                font-semibold
                tracking-[0.02em]
                text-white
                shadow-md
                transition
                hover:bg-[#1d4ed8]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Placing Order...
                </>
              ) : (
                <>
                  <svg
                    width="15"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect
                      x="5"
                      y="10"
                      width="14"
                      height="11"
                      rx="2"
                    />

                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  </svg>

                  Place Order — Rs.{' '}
                  {Number(
                    cartTotal
                  ).toLocaleString()}

                  <span>→</span>
                </>
              )}
            </button>

            <Link
              to="/cart"
              className="mt-4 flex justify-center text-[13px] font-semibold text-[#565e74] transition hover:text-[#004ac6]"
            >
              ← Back to Shopping Cart
            </Link>
          </section>

          {/* =================================================
              RIGHT: ORDER REVIEW
          ================================================== */}
          <aside className="rounded-2xl border border-[rgba(195,198,215,0.6)] bg-white p-6 shadow-sm sm:p-7 lg:sticky lg:top-[105px]">

            {/* Header */}
            <div className="border-b border-[rgba(195,198,215,0.4)] pb-5">
              <h2 className="text-[20px] font-semibold tracking-[-0.025em] text-[#0b1c30]">
                Order Review ({cartCount}{' '}
                {cartCount === 1
                  ? 'Product'
                  : 'Products'}
                )
              </h2>
            </div>

            {/* =================================================
                PRODUCT LIST
            ================================================== */}
            <div>
              {cartItems.map(
                (item, index) => {
                  const subtotal =
                    Number(item.price || 0) *
                    Number(item.quantity || 0);

                  return (
                    <article
                      key={item._id}
                      className={`flex gap-4 py-4 ${
                        index !== 0
                          ? 'border-t border-[rgba(195,198,215,0.3)]'
                          : ''
                      }`}
                    >
                      {/* Image */}
                      <Link
                        to={`/product/${item._id}`}
                        className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[rgba(195,198,215,0.4)] bg-[#eff4ff] p-2"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full rounded-lg object-cover"
                        />
                      </Link>

                      {/* Product info */}
                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/product/${item._id}`}
                          className="block truncate text-[13px] font-semibold leading-[18px] text-[#0b1c30] transition hover:text-[#004ac6]"
                        >
                          {item.name}
                        </Link>

                        <div className="mt-1 flex flex-wrap items-center gap-2 text-[12px]">
                          <span className="text-[#434655]">
                            Qty: {item.quantity}
                          </span>

                          <span className="text-[#c3c6d7]">
                            •
                          </span>

                          <span className="text-[#006058]">
                            {item.category ||
                              'Product'}
                          </span>
                        </div>

                        <p className="mt-2 text-[20px] font-bold leading-7 text-[#0b1c30]">
                          Rs.{' '}
                          {subtotal.toLocaleString()}
                        </p>
                      </div>
                    </article>
                  );
                }
              )}
            </div>

            {/* =================================================
                PRICE SUMMARY
            ================================================== */}
            <div className="border-t border-[rgba(195,198,215,0.4)] pt-5">

              <div className="flex items-center justify-between gap-4">
                <span className="text-[15px] text-[#434655]">
                  Subtotal
                </span>

                <span className="text-[15px] font-semibold text-[#0b1c30]">
                  Rs.{' '}
                  {Number(
                    cartTotal
                  ).toLocaleString()}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between gap-4">
                <span className="text-[15px] text-[#434655]">
                  Additional Charges
                </span>

                <span className="text-[15px] font-semibold text-[#0b1c30]">
                  Rs. 0
                </span>
              </div>

              {/* Total */}
              <div className="mt-5 flex items-start justify-between gap-5 border-t border-[rgba(195,198,215,0.4)] pt-5">

                <div>
                  <p className="text-[20px] font-semibold text-[#0b1c30]">
                    Total Amount
                  </p>

                  <p className="mt-1 text-[12px] text-[#737686]">
                    Current order total
                  </p>
                </div>

                <p className="text-right text-[24px] font-bold tracking-[-0.025em] text-[#004ac6]">
                  Rs.{' '}
                  {Number(
                    cartTotal
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          </aside>
        </form>
      </main>

      {/* =================================================
          FOOTER
      ================================================== */}
      <CheckoutFooter />
    </div>
  );
}

/* =====================================================
   FOOTER
===================================================== */
function CheckoutFooter() {
  return (
    <footer className="border-t border-[rgba(195,198,215,0.4)] bg-white">
      <div className="mx-auto max-w-[1280px] px-6 py-14 lg:px-12">

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563eb] text-[11px] font-bold text-white">
                CA
              </div>

              <span className="text-[20px] font-bold text-[#0b1c30]">
                CodeAlpha Store
              </span>
            </div>

            <p className="mt-4 max-w-[420px] text-[14px] leading-6 text-[#434655]">
              Modern technology and everyday
              products brought together in a
              simple e-commerce experience.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-[14px] font-bold text-[#0b1c30]">
              Quick Navigation
            </h3>

            <div className="mt-4 flex flex-col gap-2.5 text-[13px] text-[#434655]">
              <Link
                to="/products"
                className="transition hover:text-[#004ac6]"
              >
                Shop Catalog
              </Link>

              <Link
                to="/my-orders"
                className="transition hover:text-[#004ac6]"
              >
                My Orders
              </Link>

              <Link
                to="/cart"
                className="transition hover:text-[#004ac6]"
              >
                Shopping Cart
              </Link>
            </div>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-[14px] font-bold text-[#0b1c30]">
              Account
            </h3>

            <div className="mt-4 flex flex-col gap-2.5 text-[13px] text-[#434655]">
              <Link
                to="/"
                className="transition hover:text-[#004ac6]"
              >
                Home
              </Link>

              <Link
                to="/products"
                className="transition hover:text-[#004ac6]"
              >
                Products
              </Link>

              <Link
                to="/my-orders"
                className="transition hover:text-[#004ac6]"
              >
                Order History
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-[rgba(195,198,215,0.3)] pt-8">
          <p className="text-[13px] text-[#737686]">
            © 2026 CodeAlpha Store.
            Full-Stack E-commerce Project.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Checkout;
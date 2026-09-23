import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import api from '../api/axios';
import { useCart } from '../context/CartContext';

function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  /* =====================================================
     LOAD PRODUCT
  ===================================================== */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await api.get(`/products/${id}`);

        setProduct(response.data.product);
        setQuantity(1);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err.message ||
            'Failed to load product.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  /* =====================================================
     QUANTITY
  ===================================================== */
  const decreaseQuantity = () => {
    setQuantity((current) =>
      Math.max(1, current - 1)
    );
  };

  const increaseQuantity = () => {
    if (!product) return;

    setQuantity((current) =>
      Math.min(
        Number(product.stock || 0),
        current + 1
      )
    );
  };

  /* =====================================================
     ADD SELECTED QUANTITY TO CART
  ===================================================== */
  const handleAddToCart = () => {
    if (!product || product.stock <= 0) {
      return;
    }

    for (let index = 0; index < quantity; index += 1) {
      addToCart(product);
    }

    setAdded(true);

    window.setTimeout(() => {
      setAdded(false);
    }, 1600);
  };

  /* =====================================================
     LOADING
  ===================================================== */
  if (loading) {
    return (
      <div className="min-h-[700px] bg-[#f8f9ff]">
        <div className="mx-auto max-w-[1280px] px-6 py-12 lg:px-12">
          <div className="grid gap-14 lg:grid-cols-[667px_1fr]">
            <div className="aspect-[16/11] animate-pulse rounded-2xl bg-white ring-1 ring-[#e2e6ef]" />

            <div className="space-y-5">
              <div className="h-6 w-32 animate-pulse rounded bg-slate-200" />
              <div className="h-20 animate-pulse rounded bg-slate-200" />
              <div className="h-8 w-52 animate-pulse rounded bg-slate-200" />
              <div className="h-32 animate-pulse rounded bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */
  if (error) {
    return (
      <div className="min-h-[600px] bg-[#f8f9ff] px-6 py-16">
        <div className="mx-auto max-w-[700px] rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-[#0b1c30]">
            Unable to load product
          </h1>

          <p className="mt-3 text-sm text-red-600">
            {error}
          </p>

          <Link
            to="/products"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#004ac6] px-6 text-sm font-semibold text-white"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[600px] bg-[#f8f9ff] px-6 py-16">
        <div className="mx-auto max-w-[700px] rounded-2xl border border-[#e2e6ef] bg-white p-8 text-center">
          <h1 className="text-xl font-bold text-[#0b1c30]">
            Product not found
          </h1>

          <Link
            to="/products"
            className="mt-6 inline-flex text-sm font-semibold text-[#004ac6]"
          >
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const stock = Number(product.stock || 0);
  const rating = Number(product.rating || 0);

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      {/* =================================================
          FIGMA SUB-NAV / BREADCRUMB
      ================================================== */}
      <div className="border-b border-[rgba(195,198,215,0.3)] bg-[rgba(239,244,255,0.5)]">
        <div className="mx-auto flex min-h-[41px] max-w-[1280px] items-center justify-between gap-4 px-6 py-3 lg:px-12">
          <nav className="flex min-w-0 items-center gap-2 text-[11px] font-semibold">
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
              to="/products"
              className="text-[#434655] transition hover:text-[#004ac6]"
            >
              Shop
            </Link>

            <span className="text-[#a3a7b3]">
              ›
            </span>

            {product.category && (
              <>
                <span className="hidden text-[#434655] sm:inline">
                  {product.category}
                </span>

                <span className="hidden text-[#a3a7b3] sm:inline">
                  ›
                </span>
              </>
            )}

            <span className="max-w-[180px] truncate text-[#0b1c30] sm:max-w-[280px]">
              {product.name}
            </span>
          </nav>

          <Link
            to="/products"
            className="hidden shrink-0 items-center gap-1.5 text-[11px] font-semibold text-[#565e74] transition hover:text-[#004ac6] sm:flex"
          >
            <span>←</span>
            Back to Products
          </Link>
        </div>
      </div>

      {/* =================================================
          MAIN PRODUCT DETAIL
          Figma: 1184px content / 667 + 56 + 461
      ================================================== */}
      <main className="mx-auto max-w-[1280px] px-6 pb-24 pt-10 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[667px_1fr] lg:gap-14">
          {/* =================================================
              LEFT COLUMN
          ================================================== */}
          <section>
            {/* Main Product Image */}
            <div
              className="
                flex aspect-[16/11]
                items-center justify-center
                overflow-hidden
                rounded-2xl
                border border-[rgba(195,198,215,0.5)]
                bg-white
                p-6
                shadow-[0_1px_3px_rgba(15,23,42,0.04)]
                sm:p-10
              "
            >
              <div className="h-full w-full overflow-hidden rounded-xl bg-[#eff4ff]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            {/* Real product information strip.
                Replaces unsupported Figma certification claims. */}
            <div className="mt-6 rounded-xl border border-[rgba(195,198,215,0.4)] bg-[rgba(239,244,255,0.65)] px-5 py-4">
              <div className="grid gap-4 sm:grid-cols-3 sm:divide-x sm:divide-[#c3c6d7]">
                {/* Category */}
                <div className="flex items-center gap-3 sm:pr-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-[#004ac6] shadow-sm">
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M4 7.5 12 3l8 4.5-8 4.5z" />
                      <path d="m4 7.5 8 4.5 8-4.5" />
                      <path d="M4 12l8 4.5 8-4.5" />
                    </svg>
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#737686]">
                      Category
                    </p>

                    <p className="mt-0.5 truncate text-[13px] font-semibold text-[#0b1c30]">
                      {product.category || 'Product'}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-3 sm:px-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-amber-500 shadow-sm">
                    ★
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#737686]">
                      Rating
                    </p>

                    <p className="mt-0.5 text-[13px] font-semibold text-[#0b1c30]">
                      {rating.toFixed(1)} / 5
                    </p>
                  </div>
                </div>

                {/* Availability */}
                <div className="flex items-center gap-3 sm:pl-4">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ${
                      stock > 0
                        ? 'text-[#047857]'
                        : 'text-red-600'
                    }`}
                  >
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M20 7 9 18l-5-5" />
                    </svg>
                  </div>

                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.05em] text-[#737686]">
                      Availability
                    </p>

                    <p
                      className={`mt-0.5 text-[13px] font-semibold ${
                        stock > 0
                          ? 'text-[#047857]'
                          : 'text-red-600'
                      }`}
                    >
                      {stock > 0
                        ? `${stock} available`
                        : 'Out of stock'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* =================================================
              RIGHT COLUMN
          ================================================== */}
          <section className="min-w-0">
            {/* Category */}
            <div className="flex flex-wrap items-center gap-2 pb-2">
              <span className="rounded bg-[#e5eeff] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.05em] text-[#004ac6]">
                {product.category || 'Product'}
              </span>

              <span className="text-[#c3c6d7]">
                •
              </span>

              <span className="text-[11px] font-medium uppercase tracking-[0.025em] text-[#565e74]">
                CodeAlpha Store
              </span>
            </div>

            {/* Product name */}
            <h1 className="pb-4 text-[34px] font-bold leading-[1.18] tracking-[-0.025em] text-[#0b1c30] sm:text-[36px]">
              {product.name}
            </h1>

            {/* Rating / stock */}
            <div className="flex flex-wrap items-center gap-3 border-b border-[rgba(195,198,215,0.5)] pb-5">
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5 text-[15px] text-amber-400">
                  {Array.from({ length: 5 }).map(
                    (_, index) => (
                      <span key={index}>
                        {index <
                        Math.round(rating)
                          ? '★'
                          : '☆'}
                      </span>
                    )
                  )}
                </div>

                <span className="text-[13px] font-bold text-[#0b1c30]">
                  {rating.toFixed(1)}
                </span>
              </div>

              <span className="h-4 w-px bg-[rgba(195,198,215,0.7)]" />

              {stock > 0 ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#a7f3d0] bg-[#ecfdf5] px-3 py-1 text-[11px] font-semibold text-[#047857]">
                  <span className="h-2 w-2 rounded-full bg-[#10b981]" />
                  In Stock ({stock} available)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[11px] font-semibold text-red-600">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  Out of Stock
                </span>
              )}
            </div>

            {/* Price */}
            <div className="border-b border-[rgba(195,198,215,0.35)] py-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#737686]">
                Price
              </p>

              <p className="mt-1 text-[32px] font-extrabold leading-10 tracking-[-0.025em] text-[#0b1c30]">
                Rs.{' '}
                {Number(
                  product.price || 0
                ).toLocaleString()}
              </p>
            </div>

            {/* Description */}
            <div className="py-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#565e74]">
                Product Description
              </p>

              <p className="mt-3 text-[15px] leading-6 text-[#434655]">
                {product.description}
              </p>
            </div>

            {/* Product information chips */}
            <div className="border-y border-[rgba(195,198,215,0.35)] py-5">
              <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-[#565e74]">
                Product Information
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-lg border border-[rgba(195,198,215,0.5)] bg-[#eff4ff] px-3 py-2 text-[12px] font-semibold text-[#0b1c30]">
                  Category: {product.category || 'General'}
                </span>

                <span className="rounded-lg border border-[rgba(195,198,215,0.5)] bg-[#eff4ff] px-3 py-2 text-[12px] font-semibold text-[#0b1c30]">
                  Rating: {rating.toFixed(1)}
                </span>

                <span className="rounded-lg border border-[rgba(195,198,215,0.5)] bg-[#eff4ff] px-3 py-2 text-[12px] font-semibold text-[#0b1c30]">
                  Stock: {stock}
                </span>
              </div>
            </div>

            {/* =================================================
                QUANTITY
            ================================================== */}
            {stock > 0 && (
              <div className="py-6">
                <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.05em] text-[#565e74]">
                  Quantity
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex h-12 items-center overflow-hidden rounded-xl border border-[rgba(195,198,215,0.7)] bg-white shadow-sm">
                    <button
                      type="button"
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1}
                      className="flex h-full w-11 items-center justify-center text-lg text-[#0b1c30] transition hover:bg-[#eff4ff] disabled:cursor-not-allowed disabled:opacity-35"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>

                    <div className="flex h-full w-12 items-center justify-center border-x border-[rgba(195,198,215,0.35)] text-[15px] font-bold text-[#0b1c30]">
                      {quantity}
                    </div>

                    <button
                      type="button"
                      onClick={increaseQuantity}
                      disabled={quantity >= stock}
                      className="flex h-full w-11 items-center justify-center text-lg text-[#0b1c30] transition hover:bg-[#eff4ff] disabled:cursor-not-allowed disabled:opacity-35"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 text-[12px] text-[#565e74]">
                    <svg
                      width="14"
                      height="14"
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

                    Maximum available: {stock}
                  </div>
                </div>
              </div>
            )}

            {/* =================================================
                ADD TO CART
            ================================================== */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={stock <= 0}
              className={`
                flex h-14 w-full
                items-center justify-center gap-2.5
                rounded-xl
                text-[15px] font-bold text-white
                shadow-[0_4px_6px_-1px_rgba(37,99,235,0.2)]
                transition
                ${
                  stock <= 0
                    ? 'cursor-not-allowed bg-slate-300'
                    : added
                    ? 'bg-[#047857]'
                    : 'bg-[#2563eb] hover:bg-[#1d4ed8]'
                }
              `}
            >
              {added ? (
                <>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="m5 12 4 4L19 6" />
                  </svg>

                  Added {quantity}{' '}
                  {quantity === 1
                    ? 'item'
                    : 'items'}{' '}
                  to Cart
                </>
              ) : stock <= 0 ? (
                'Out of Stock'
              ) : (
                <>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
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

                  Add to Cart
                </>
              )}
            </button>

            {/* Cart link after action */}
            <div className="mt-4 text-center">
              <Link
                to="/cart"
                className="text-[12px] font-semibold text-[#565e74] transition hover:text-[#004ac6]"
              >
                View Shopping Cart →
              </Link>
            </div>
          </section>
        </div>
      </main>

      {/* =================================================
          FIGMA-STYLE FOOTER
      ================================================== */}
      <footer className="border-t border-[rgba(195,198,215,0.4)] bg-white">
        <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-12">
          <div className="grid gap-10 border-b border-[rgba(195,198,215,0.3)] pb-12 md:grid-cols-2 lg:grid-cols-12">
            {/* Brand */}
            <div className="lg:col-span-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#004ac6] text-[11px] font-semibold text-white">
                  CA
                </div>

                <span className="text-[20px] font-bold text-[#0b1c30]">
                  CodeAlpha Store
                </span>
              </div>

              <p className="mt-4 max-w-[384px] text-[13px] leading-5 text-[#434655]">
                Modern technology and everyday products
                brought together in a simple, reliable
                e-commerce experience.
              </p>
            </div>

            {/* Catalog */}
            <div className="lg:col-span-3">
              <h3 className="text-[15px] font-bold text-[#0b1c30]">
                Catalog & Orders
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

            {/* Navigation */}
            <div className="lg:col-span-3">
              <h3 className="text-[15px] font-bold text-[#0b1c30]">
                Navigation
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

            {/* Store */}
            <div className="lg:col-span-2">
              <h3 className="text-[15px] font-bold text-[#0b1c30]">
                Store
              </h3>

              <div className="mt-4 text-[13px] leading-6 text-[#434655]">
                <p>CodeAlpha Store</p>
                <p>Sri Lanka</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-3 pt-8 text-[12px] text-[#737686] sm:flex-row">
            <p>
              © 2026 CodeAlpha Store. Full-Stack
              E-commerce Project.
            </p>

            <p>
              Prices quoted in LKR (Rs.)
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ProductDetail;
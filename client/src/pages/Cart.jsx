import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    cartCount,
    cartTotal,
    clearCart,
  } = useCart();

  /* =====================================================
     QUANTITY MANAGEMENT
  ===================================================== */
  const decreaseQuantity = (item) => {
    if (item.quantity > 1) {
      updateQuantity(
        item._id,
        item.quantity - 1
      );
    }
  };

  const increaseQuantity = (item) => {
    const stock = Number(item.stock || 0);

    if (item.quantity < stock) {
      updateQuantity(
        item._id,
        item.quantity + 1
      );
    }
  };

  /* =====================================================
     EMPTY CART
  ===================================================== */
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#f8f9ff]">
        {/* Breadcrumb */}
        <div className="mx-auto max-w-[1280px] px-6 pt-8 lg:px-12">
          <nav className="flex items-center gap-2 text-[11px] font-semibold">
            <Link
              to="/"
              className="text-[#434655] transition hover:text-[#004ac6]"
            >
              Home
            </Link>

            <span className="text-[#a3a7b3]">
              ›
            </span>

            <span className="text-[#0b1c30]">
              Shopping Cart
            </span>
          </nav>
        </div>

        {/* Empty state */}
        <main className="mx-auto max-w-[1280px] px-6 pb-24 pt-8 lg:px-12">
          <section className="flex min-h-[520px] items-center justify-center">
            <div className="w-full max-w-[620px] rounded-2xl border border-[rgba(195,198,215,0.6)] bg-white px-8 py-14 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#eff4ff] text-[#004ac6]">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="9" cy="20" r="1" />
                  <circle cx="18" cy="20" r="1" />
                  <path d="M3 4h2l2 11h10l2-7H7" />
                </svg>
              </div>

              <h1 className="mt-6 text-[32px] font-bold tracking-[-0.025em] text-[#0b1c30]">
                Your cart is empty
              </h1>

              <p className="mx-auto mt-3 max-w-[420px] text-[14px] leading-6 text-[#565e74]">
                Browse the CodeAlpha Store and add
                products to your cart before continuing
                to checkout.
              </p>

              <Link
                to="/products"
                className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#004ac6] px-7 text-sm font-semibold text-white shadow-sm transition hover:bg-[#003ca1]"
              >
                Continue Shopping
                <span>→</span>
              </Link>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    );
  }

  /* =====================================================
     CART WITH PRODUCTS
  ===================================================== */
  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      <main className="mx-auto max-w-[1280px] px-6 pb-24 pt-8 lg:px-12">

        {/* =================================================
            BREADCRUMB
        ================================================== */}
        <nav className="flex items-center gap-2 text-[11px] font-semibold">
          <Link
            to="/"
            className="text-[#434655] transition hover:text-[#004ac6]"
          >
            Home
          </Link>

          <span className="text-[#a3a7b3]">
            ›
          </span>

          <span className="text-[#0b1c30]">
            Shopping Cart
          </span>
        </nav>

        {/* =================================================
            PAGE HEADER
        ================================================== */}
        <section className="mt-6 flex flex-col gap-5 border-b border-[rgba(195,198,215,0.4)] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[36px] font-semibold leading-[44px] tracking-[-0.025em] text-[#0b1c30]">
                Your Shopping Cart
              </h1>

              <span className="rounded-full bg-[#dae2fd] px-3 py-1 text-[13px] font-semibold text-[#131b2e]">
                {cartCount}{' '}
                {cartCount === 1
                  ? 'item'
                  : 'items'}
              </span>
            </div>

            <p className="mt-1 text-[13px] leading-5 text-[#434655]">
              Review your selected products and
              quantities before checkout.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex shrink-0 items-center gap-2 text-[15px] font-semibold text-[#004ac6] transition hover:gap-3"
          >
            <span>←</span>
            Continue Shopping
          </Link>
        </section>

        {/* =================================================
            CART GRID
        ================================================== */}
        <section className="mt-8 grid gap-8 lg:grid-cols-[2fr_1fr]">

          {/* =================================================
              LEFT: CART ITEMS
          ================================================== */}
          <div className="min-w-0">

            <div className="overflow-hidden rounded-2xl border border-[rgba(195,198,215,0.6)] bg-white shadow-sm">

              {/* Desktop header */}
              <div className="hidden border-b border-[rgba(195,198,215,0.5)] bg-[rgba(239,244,255,0.5)] px-6 py-4 md:grid md:grid-cols-12 md:gap-4">
                <div className="col-span-6 text-[11px] font-semibold uppercase tracking-[0.05em] text-[#434655]">
                  Product
                </div>

                <div className="col-span-2 text-right text-[11px] font-semibold uppercase tracking-[0.05em] text-[#434655]">
                  Price
                </div>

                <div className="col-span-2 text-center text-[11px] font-semibold uppercase tracking-[0.05em] text-[#434655]">
                  Quantity
                </div>

                <div className="col-span-2 text-right text-[11px] font-semibold uppercase tracking-[0.05em] text-[#434655]">
                  Subtotal
                </div>
              </div>

              {/* Cart products */}
              <div>
                {cartItems.map(
                  (item, index) => {
                    const stock =
                      Number(item.stock || 0);

                    const itemPrice =
                      Number(item.price || 0);

                    const itemSubtotal =
                      itemPrice *
                      item.quantity;

                    return (
                      <article
                        key={item._id}
                        className={`
                          px-5 py-6
                          md:grid
                          md:grid-cols-12
                          md:items-center
                          md:gap-4
                          md:px-6
                          ${
                            index !== 0
                              ? 'border-t border-[rgba(195,198,215,0.4)]'
                              : ''
                          }
                        `}
                      >
                        {/* Product */}
                        <div className="md:col-span-6">
                          <div className="flex min-w-0 items-center gap-4">
                            <Link
                              to={`/product/${item._id}`}
                              className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[rgba(195,198,215,0.5)] bg-[#eff4ff] p-1"
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full rounded-lg object-cover"
                              />
                            </Link>

                            <div className="min-w-0">
                              <p className="text-[11px] font-semibold tracking-[0.025em] text-[#004ac6]">
                                {item.category ||
                                  'Product'}
                              </p>

                              <Link
                                to={`/product/${item._id}`}
                                className="mt-1 block truncate text-[15px] font-semibold leading-5 text-[#0b1c30] transition hover:text-[#004ac6]"
                              >
                                {item.name}
                              </Link>

                              <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-[#565e74]">
                                <span
                                  className={
                                    stock > 0
                                      ? 'text-[#006058]'
                                      : 'text-red-600'
                                  }
                                >
                                  ●
                                </span>

                                {stock > 0
                                  ? `${stock} available`
                                  : 'Out of stock'}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="mt-5 flex items-center justify-between md:col-span-2 md:mt-0 md:block md:text-right">
                          <span className="text-[11px] font-semibold uppercase tracking-wide text-[#737686] md:hidden">
                            Price
                          </span>

                          <p className="text-[15px] font-semibold text-[#0b1c30]">
                            Rs.{' '}
                            {itemPrice.toLocaleString()}
                          </p>
                        </div>

                        {/* Quantity */}
                        <div className="mt-4 flex items-center justify-between md:col-span-2 md:mt-0 md:justify-center">
                          <span className="text-[11px] font-semibold uppercase tracking-wide text-[#737686] md:hidden">
                            Quantity
                          </span>

                          <div className="flex h-9 items-center rounded-xl border border-[rgba(195,198,215,0.8)] bg-white px-1 shadow-sm">

                            {/* MINUS */}
                            <button
                              type="button"
                              onClick={() =>
                                decreaseQuantity(
                                  item
                                )
                              }
                              disabled={
                                item.quantity <= 1
                              }
                              className="
                                flex h-7 w-7
                                items-center justify-center
                                rounded-lg
                                text-base
                                text-[#0b1c30]
                                transition
                                hover:bg-[#eff4ff]
                                disabled:cursor-not-allowed
                                disabled:opacity-30
                              "
                              aria-label={`Decrease ${item.name} quantity`}
                            >
                              −
                            </button>

                            <span className="w-8 text-center text-[13px] font-bold text-[#0b1c30]">
                              {item.quantity}
                            </span>

                            {/* PLUS */}
                            <button
                              type="button"
                              onClick={() =>
                                increaseQuantity(
                                  item
                                )
                              }
                              disabled={
                                item.quantity >=
                                stock
                              }
                              className="
                                flex h-7 w-7
                                items-center justify-center
                                rounded-lg
                                text-base
                                text-[#0b1c30]
                                transition
                                hover:bg-[#eff4ff]
                                disabled:cursor-not-allowed
                                disabled:opacity-30
                              "
                              aria-label={`Increase ${item.name} quantity`}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Subtotal */}
                        <div className="mt-4 flex items-center justify-between md:col-span-2 md:mt-0 md:justify-end md:gap-3">
                          <div>
                            <span className="text-[11px] font-semibold uppercase tracking-wide text-[#737686] md:hidden">
                              Subtotal
                            </span>

                            <p className="mt-0.5 text-[15px] font-bold leading-5 text-[#0b1c30] md:mt-0">
                              Rs.{' '}
                              {itemSubtotal.toLocaleString()}
                            </p>
                          </div>

                          {/* Remove */}
                          <button
                            type="button"
                            onClick={() =>
                              removeFromCart(
                                item._id
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#737686] transition hover:bg-red-50 hover:text-[#ba1a1a]"
                            aria-label={`Remove ${item.name} from cart`}
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                            >
                              <path d="M3 6h18" />
                              <path d="M8 6V4h8v2" />
                              <path d="m19 6-1 14H6L5 6" />
                              <path d="M10 11v5" />
                              <path d="M14 11v5" />
                            </svg>
                          </button>
                        </div>
                      </article>
                    );
                  }
                )}
              </div>
            </div>

            {/* Cart actions */}
            <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-[rgba(195,198,215,0.4)] bg-[rgba(239,244,255,0.4)] p-4 sm:flex-row sm:items-center sm:justify-between">
              <Link
                to="/products"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#c3c6d7] bg-white px-5 text-[13px] font-semibold text-[#0b1c30] shadow-sm transition hover:border-[#004ac6]"
              >
                <span>←</span>
                Continue Shopping
              </Link>

              <button
                type="button"
                onClick={clearCart}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-[13px] font-semibold text-[#ba1a1a] transition hover:bg-red-50"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M3 6h18" />
                  <path d="M8 6V4h8v2" />
                  <path d="m19 6-1 14H6L5 6" />
                </svg>

                Clear Cart
              </button>
            </div>
          </div>

          {/* =================================================
              RIGHT: ORDER SUMMARY
          ================================================== */}
          <aside>
            <div className="rounded-2xl border border-[rgba(195,198,215,0.6)] bg-white p-6 shadow-sm lg:sticky lg:top-[105px]">

              {/* Header */}
              <div className="flex items-center justify-between border-b border-[rgba(195,198,215,0.4)] pb-4">
                <h2 className="text-[20px] font-bold leading-7 text-[#0b1c30]">
                  Order Summary
                </h2>

                <svg
                  width="19"
                  height="21"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#565e74"
                  strokeWidth="1.8"
                >
                  <path d="M6 3h12v18H6z" />
                  <path d="M9 7h6" />
                  <path d="M9 11h6" />
                  <path d="M9 15h4" />
                </svg>
              </div>

              {/* Breakdown */}
              <div className="space-y-4 py-5">
                <div className="flex items-center justify-between gap-5">
                  <span className="text-[14px] text-[#434655]">
                    Items Subtotal (
                    {cartCount}{' '}
                    {cartCount === 1
                      ? 'item'
                      : 'items'}
                    )
                  </span>

                  <span className="shrink-0 text-[15px] font-semibold text-[#0b1c30]">
                    Rs.{' '}
                    {Number(
                      cartTotal
                    ).toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-5">
                  <span className="text-[14px] text-[#434655]">
                    Additional Charges
                  </span>

                  <span className="shrink-0 text-[15px] font-semibold text-[#0b1c30]">
                    Rs. 0
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-[rgba(195,198,215,0.6)] pt-5">
                <div className="flex items-start justify-between gap-5">
                  <span className="pt-1 text-[15px] font-bold text-[#0b1c30]">
                    Total
                  </span>

                  <div className="text-right">
                    <p className="text-[24px] font-bold leading-8 tracking-[-0.025em] text-[#004ac6]">
                      Rs.{' '}
                      {Number(
                        cartTotal
                      ).toLocaleString()}
                    </p>

                    <p className="mt-1 text-[11px] text-[#737686]">
                      Current order total
                    </p>
                  </div>
                </div>
              </div>

              {/* Checkout */}
              <Link
                to="/checkout"
                className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-[#004ac6] text-[15px] font-semibold text-white shadow-md transition hover:bg-[#003ca1]"
              >
                Proceed to Checkout
                <span>→</span>
              </Link>

              <p className="mt-4 text-center text-[11px] leading-5 text-[#737686]">
                Shipping information will be
                entered on the checkout page.
              </p>
            </div>
          </aside>
        </section>
      </main>

      <Footer />
    </div>
  );
}

/* =====================================================
   FOOTER
===================================================== */
function Footer() {
  return (
    <footer className="border-t border-[rgba(195,198,215,0.4)] bg-white">
      <div className="mx-auto max-w-[1280px] px-6 py-14 lg:px-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">

          {/* Brand */}
          <div className="max-w-[448px]">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#004ac6] text-[11px] font-bold text-white">
                CA
              </div>

              <span className="text-[20px] font-bold text-[#0b1c30]">
                CodeAlpha Store
              </span>
            </div>

            <p className="mt-3 text-[13px] leading-5 text-[#434655]">
              © 2026 CodeAlpha Store.
              Full-Stack E-commerce Project.
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex flex-wrap gap-x-8 gap-y-3 text-[13px] font-semibold text-[#434655]">
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
              className="text-[#004ac6]"
            >
              Shopping Cart
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export default Cart;
import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Link } from 'react-router-dom';

import api from '../api/axios';

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] =
    useState(true);
  const [error, setError] =
    useState('');

  const [search, setSearch] =
    useState('');

  const [statusFilter, setStatusFilter] =
    useState('all');

  /* =====================================================
     LOAD REAL ORDERS
  ===================================================== */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError('');

        const response =
          await api.get(
            '/orders/my-orders'
          );

        setOrders(
          response.data.orders || []
        );
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err.message ||
            'Failed to load orders.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  /* =====================================================
     HELPERS
  ===================================================== */
  const normalizeStatus = (status) =>
    String(status || 'pending')
      .trim()
      .toLowerCase();

  const formatDate = (date) => {
    if (!date) {
      return 'Date unavailable';
    }

    return new Date(
      date
    ).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPrice = (value) =>
    Number(
      value || 0
    ).toLocaleString();

  const shortOrderId = (id) => {
    if (!id) {
      return 'N/A';
    }

    return `#CA-${id
      .slice(-6)
      .toUpperCase()}`;
  };

  /* =====================================================
     STATUS COUNTS
  ===================================================== */
  const statusCounts = useMemo(() => {
    const counts = {
      all: orders.length,
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    orders.forEach((order) => {
      const status =
        normalizeStatus(
          order.status
        );

      if (
        Object.prototype.hasOwnProperty.call(
          counts,
          status
        )
      ) {
        counts[status] += 1;
      }
    });

    return counts;
  }, [orders]);

  /* =====================================================
     FILTER ORDERS
  ===================================================== */
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    if (statusFilter !== 'all') {
      result = result.filter(
        (order) =>
          normalizeStatus(
            order.status
          ) === statusFilter
      );
    }

    const query = search
      .trim()
      .toLowerCase();

    if (query) {
      result = result.filter(
        (order) => {
          const orderId =
            String(
              order._id || ''
            ).toLowerCase();

          const shortId =
            shortOrderId(
              order._id
            ).toLowerCase();

          const itemMatch =
            order.orderItems?.some(
              (item) =>
                String(
                  item.name || ''
                )
                  .toLowerCase()
                  .includes(query)
            );

          return (
            orderId.includes(query) ||
            shortId.includes(query) ||
            itemMatch
          );
        }
      );
    }

    return result.sort(
      (a, b) =>
        new Date(
          b.createdAt
        ).getTime() -
        new Date(
          a.createdAt
        ).getTime()
    );
  }, [
    orders,
    search,
    statusFilter,
  ]);

  /* =====================================================
     STATUS DESIGN
  ===================================================== */
  const getStatusStyle = (status) => {
    const normalized =
      normalizeStatus(status);

    const styles = {
      pending: {
        wrapper:
          'border-[#f8d98d] bg-[#fff8e7] text-[#a35b00]',
        dot: 'bg-[#f59e0b]',
      },

      processing: {
        wrapper:
          'border-[#bfdbfe] bg-[#eff6ff] text-[#2563eb]',
        dot: 'bg-[#2563eb]',
      },

      shipped: {
        wrapper:
          'border-[#e9d5ff] bg-[#faf5ff] text-[#7e22ce]',
        dot: 'bg-[#9333ea]',
      },

      delivered: {
        wrapper:
          'border-[#bbf7d0] bg-[#ecfdf5] text-[#047857]',
        dot: 'bg-[#10b981]',
      },

      cancelled: {
        wrapper:
          'border-[#fecaca] bg-[#fef2f2] text-[#b91c1c]',
        dot: 'bg-[#ef4444]',
      },
    };

    return (
      styles[normalized] ||
      styles.pending
    );
  };

  /* =====================================================
     STATUS FILTERS
  ===================================================== */
  const filters = [
    {
      key: 'all',
      label: 'All Orders',
    },
    {
      key: 'pending',
      label: 'Pending',
    },
    {
      key: 'processing',
      label: 'Processing',
    },
    {
      key: 'shipped',
      label: 'Shipped',
    },
    {
      key: 'delivered',
      label: 'Delivered',
    },
    {
      key: 'cancelled',
      label: 'Cancelled',
    },
  ];

  /* =====================================================
     LOADING
  ===================================================== */
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9ff]">
        <main className="mx-auto max-w-[1280px] px-6 py-10 lg:px-12">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />

          <div className="mt-8 space-y-5">
            {[1, 2, 3].map(
              (item) => (
                <div
                  key={item}
                  className="h-[250px] animate-pulse rounded-2xl bg-white ring-1 ring-[#e2e6ef]"
                />
              )
            )}
          </div>
        </main>
      </div>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */
  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f9ff] px-6 py-12">
        <div className="mx-auto max-w-[800px] rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-[#0b1c30]">
            Unable to load orders
          </h1>

          <p className="mt-3 text-sm text-red-600">
            {error}
          </p>

          <Link
            to="/products"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#004ac6] px-6 text-sm font-semibold text-white"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff]">

      {/* =================================================
          MAIN
      ================================================== */}
      <main className="mx-auto max-w-[1280px] px-6 pb-24 pt-8 lg:px-12">

        {/* =================================================
            BREADCRUMB
        ================================================== */}
        <nav className="flex items-center gap-2 text-[11px] font-semibold text-[#737686]">
          <Link
            to="/"
            className="transition hover:text-[#004ac6]"
          >
            Home
          </Link>

          <span>›</span>

          <span>
            Account
          </span>

          <span>›</span>

          <span className="text-[#0b1c30]">
            My Orders
          </span>
        </nav>

        {/* =================================================
            PAGE HEADER
        ================================================== */}
        <section className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

          {/* Heading */}
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-[36px] font-bold leading-[44px] tracking-[-0.025em] text-[#0b1c30]">
                My Orders
              </h1>

              <span className="rounded-full bg-[#e5eeff] px-3 py-1 text-[11px] font-bold text-[#004ac6]">
                {orders.length}{' '}
                {orders.length === 1
                  ? 'Order'
                  : 'Orders'}
              </span>
            </div>

            <p className="mt-2 max-w-[720px] text-[14px] leading-6 text-[#565e74]">
              Track, view, and manage
              your recent purchases and
              delivery status with
              verified Sri Lankan
              fulfillment.
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full lg:w-[300px]">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737686]"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle
                cx="11"
                cy="11"
                r="7"
              />

              <path d="m20 20-3.5-3.5" />
            </svg>

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Filter by Order ID..."
              className="
                h-11 w-full
                rounded-xl
                border border-[rgba(195,198,215,0.7)]
                bg-white
                pl-11 pr-4
                text-[13px]
                text-[#0b1c30]
                shadow-sm
                outline-none
                transition
                placeholder:text-[#9ca3af]
                focus:border-[#004ac6]
              "
            />
          </div>
        </section>

        {/* =================================================
            STATUS FILTERS
        ================================================== */}
        <section className="mt-7 border-y border-[rgba(195,198,215,0.4)] py-4">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {filters.map(
              (filter) => {
                const active =
                  statusFilter ===
                  filter.key;

                return (
                  <button
                    key={filter.key}
                    type="button"
                    onClick={() =>
                      setStatusFilter(
                        filter.key
                      )
                    }
                    className={`
                      flex shrink-0 items-center
                      gap-2 rounded-full
                      border px-4 py-2
                      text-[11px] font-semibold
                      transition
                      ${
                        active
                          ? 'border-[#0b1c30] bg-[#0b1c30] text-white'
                          : 'border-[rgba(195,198,215,0.6)] bg-white text-[#434655] hover:border-[#004ac6] hover:text-[#004ac6]'
                      }
                    `}
                  >
                    {filter.label}

                    <span
                      className={`
                        flex h-5 min-w-5
                        items-center justify-center
                        rounded-full px-1.5
                        text-[10px]
                        ${
                          active
                            ? 'bg-white/15 text-white'
                            : 'bg-[#eff4ff] text-[#565e74]'
                        }
                      `}
                    >
                      {
                        statusCounts[
                          filter.key
                        ]
                      }
                    </span>
                  </button>
                );
              }
            )}
          </div>
        </section>

        {/* =================================================
            EMPTY ORDERS
        ================================================== */}
        {orders.length === 0 && (
          <section className="mt-8 rounded-2xl border border-[rgba(195,198,215,0.6)] bg-white px-8 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eff4ff] text-[#004ac6]">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M4 7h16v13H4z" />
                <path d="M8 7a4 4 0 0 1 8 0" />
              </svg>
            </div>

            <h2 className="mt-5 text-[22px] font-bold text-[#0b1c30]">
              No orders yet
            </h2>

            <p className="mt-2 text-sm text-[#565e74]">
              Your completed orders will
              appear here.
            </p>

            <Link
              to="/products"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-[#004ac6] px-6 text-sm font-semibold text-white"
            >
              Browse Products
            </Link>
          </section>
        )}

        {/* =================================================
            FILTER EMPTY STATE
        ================================================== */}
        {orders.length > 0 &&
          filteredOrders.length ===
            0 && (
            <section className="mt-8 rounded-2xl border border-[rgba(195,198,215,0.6)] bg-white px-8 py-14 text-center">
              <h2 className="text-xl font-bold text-[#0b1c30]">
                No matching orders
              </h2>

              <p className="mt-2 text-sm text-[#565e74]">
                Try another order ID or
                change the status filter.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setStatusFilter(
                    'all'
                  );
                }}
                className="mt-5 rounded-xl bg-[#004ac6] px-5 py-2.5 text-sm font-semibold text-white"
              >
                Clear Filters
              </button>
            </section>
          )}

        {/* =================================================
            ORDER LIST
        ================================================== */}
        {filteredOrders.length >
          0 && (
          <section className="mt-6 space-y-5">
            {filteredOrders.map(
              (order) => {
                const status =
                  normalizeStatus(
                    order.status
                  );

                const statusStyle =
                  getStatusStyle(
                    status
                  );

                return (
                  <article
                    key={order._id}
                    className="
                      overflow-hidden
                      rounded-2xl
                      border border-[rgba(195,198,215,0.55)]
                      bg-white
                      shadow-[0_1px_3px_rgba(15,23,42,0.04)]
                    "
                  >
                    {/* =====================================
                        ORDER HEADER
                    ====================================== */}
                    <div className="flex flex-col gap-4 border-b border-[rgba(195,198,215,0.35)] bg-[rgba(239,244,255,0.45)] px-5 py-4 sm:px-6 lg:flex-row lg:items-center">

                      <div className="grid flex-1 gap-5 sm:grid-cols-3">

                        {/* Order ID */}
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#737686]">
                            Order ID
                          </p>

                          <p className="mt-1 text-[12px] font-bold text-[#0b1c30]">
                            {shortOrderId(
                              order._id
                            )}
                          </p>
                        </div>

                        {/* Date */}
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#737686]">
                            Date Placed
                          </p>

                          <p className="mt-1 text-[12px] font-semibold text-[#0b1c30]">
                            {formatDate(
                              order.createdAt
                            )}
                          </p>
                        </div>

                        {/* Total */}
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#737686]">
                            Total Amount
                          </p>

                          <p className="mt-1 text-[12px] font-bold text-[#004ac6]">
                            Rs.{' '}
                            {formatPrice(
                              order.totalPrice
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Status */}
                      <div
                        className={`
                          inline-flex w-fit
                          shrink-0 items-center
                          gap-1.5 rounded-full
                          border px-3 py-1.5
                          text-[10px] font-semibold
                          capitalize
                          ${statusStyle.wrapper}
                        `}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`}
                        />

                        {status}
                      </div>
                    </div>

                    {/* =====================================
                        ORDER BODY
                    ====================================== */}
                    <div className="grid lg:grid-cols-[1fr_280px]">

                      {/* Products */}
                      <div className="divide-y divide-[rgba(195,198,215,0.3)] px-5 sm:px-6">
                        {order.orderItems?.map(
                          (
                            item,
                            index
                          ) => (
                            <div
                              key={`${order._id}-${index}`}
                              className="flex items-center gap-4 py-5"
                            >
                              {/* Product image */}
                              <div className="flex h-[58px] w-[76px] shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[rgba(195,198,215,0.5)] bg-[#eff4ff]">
                                <img
                                  src={
                                    item.image
                                  }
                                  alt={
                                    item.name
                                  }
                                  className="h-full w-full object-cover"
                                />
                              </div>

                              {/* Product detail */}
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-[13px] font-semibold text-[#0b1c30]">
                                  {
                                    item.name
                                  }
                                </p>

                                <p className="mt-1 text-[10px] text-[#565e74]">
                                  Qty:{' '}
                                  {
                                    item.quantity
                                  }
                                </p>
                              </div>

                              {/* Item subtotal */}
                              <p className="shrink-0 text-right text-[12px] font-bold text-[#0b1c30]">
                                Rs.{' '}
                                {formatPrice(
                                  Number(
                                    item.price ||
                                      0
                                  ) *
                                    Number(
                                      item.quantity ||
                                        0
                                    )
                                )}
                              </p>
                            </div>
                          )
                        )}
                      </div>

                      {/* =====================================
                          SHIPPING ADDRESS
                      ====================================== */}
                      <aside className="border-t border-[rgba(195,198,215,0.35)] bg-[#fafbff] p-5 lg:border-l lg:border-t-0">

                        <div className="rounded-xl border border-[rgba(195,198,215,0.55)] bg-white p-4">

                          <div className="flex items-center gap-2">
                            <svg
                              width="13"
                              height="13"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#565e74"
                              strokeWidth="1.8"
                            >
                              <path d="M3 7h12v9H3z" />
                              <path d="M15 10h3l3 3v3h-6z" />
                            </svg>

                            <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#565e74]">
                              Shipping Address
                            </p>
                          </div>

                          <div className="mt-3 text-[11px] leading-[18px] text-[#434655]">
                            <p>
                              {
                                order
                                  .shippingAddress
                                  ?.address
                              }
                            </p>

                            <p>
                              {
                                order
                                  .shippingAddress
                                  ?.city
                              }
                              {order
                                .shippingAddress
                                ?.postalCode
                                ? `, ${order.shippingAddress.postalCode}`
                                : ''}
                            </p>

                            <p>
                              {
                                order
                                  .shippingAddress
                                  ?.country
                              }
                            </p>
                          </div>
                        </div>
                      </aside>
                    </div>
                  </article>
                );
              }
            )}
          </section>
        )}
      </main>

      {/* =================================================
          FOOTER
      ================================================== */}
      <OrdersFooter />
    </div>
  );
}

/* =====================================================
   FOOTER
===================================================== */
function OrdersFooter() {
  return (
    <footer className="border-t border-[rgba(195,198,215,0.4)] bg-white">

      <div className="mx-auto max-w-[1280px] px-6 py-12 lg:px-12">

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#004ac6] text-[11px] font-bold text-white">
                CA
              </div>

              <span className="text-[18px] font-bold text-[#0b1c30]">
                CodeAlpha Store
              </span>
            </div>

            <p className="mt-4 max-w-[420px] text-[12px] leading-5 text-[#565e74]">
              Modern technology and
              everyday products brought
              together in a simple,
              reliable e-commerce
              experience.
            </p>
          </div>

          {/* Ecosystem */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#0b1c30]">
              Ecosystem
            </h3>

            <div className="mt-4 flex flex-col gap-2.5 text-[12px] text-[#565e74]">
              <Link
                to="/products"
                className="transition hover:text-[#004ac6]"
              >
                Shop Catalog
              </Link>

              <Link
                to="/my-orders"
                className="font-semibold text-[#004ac6]"
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
            <h3 className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#0b1c30]">
              Account
            </h3>

            <div className="mt-4 flex flex-col gap-2.5 text-[12px] text-[#565e74]">
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

        <div className="mt-10 flex flex-col gap-3 border-t border-[rgba(195,198,215,0.3)] pt-6 text-[11px] text-[#737686] sm:flex-row sm:justify-between">
          <p>
            © 2026 CodeAlpha Store.
            Full-Stack E-commerce Project.
          </p>

          <p>
            Prices in LKR (Rs.)
          </p>
        </div>
      </div>
    </footer>
  );
}

export default MyOrders;
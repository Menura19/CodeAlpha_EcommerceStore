import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

function DepartmentIcon({ index }) {
  const icons = [
    // Audio
    <svg
      key="audio"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M4 14v-4a8 8 0 0 1 16 0v4" />
      <path d="M18 18h1a2 2 0 0 0 2-2v-2h-3z" />
      <path d="M6 18H5a2 2 0 0 1-2-2v-2h3z" />
    </svg>,

    // Desk / monitor
    <svg
      key="desk"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="5" width="18" height="11" rx="2" />
      <path d="M8 20h8" />
      <path d="M12 16v4" />
    </svg>,

    // Keyboard
    <svg
      key="keyboard"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M7 10h.01M10 10h.01M13 10h.01M16 10h.01" />
      <path d="M7 14h10" />
    </svg>,

    // Smart device
    <svg
      key="gadget"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="7" y="3" width="10" height="18" rx="2" />
      <path d="M10 6h4" />
      <path d="M11 18h2" />
    </svg>,

    // Charging
    <svg
      key="charging"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M13 2 6 13h6l-1 9 7-12h-6z" />
    </svg>,
  ];

  return icons[index % icons.length];
}

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const { addToCart } = useCart();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data.products || []);
      } catch (error) {
        console.error('Failed to load home products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const featuredProduct = products[0];

  /*
   * Five truthful department/collection cards.
   * Real MongoDB categories are used first.
   * Remaining cards use calculated product data.
   */
  const departments = useMemo(() => {
    const counts = {};

    products.forEach((product) => {
      if (product.category) {
        counts[product.category] =
          (counts[product.category] || 0) + 1;
      }
    });

    const realCategories = Object.entries(counts)
      .slice(0, 3)
      .map(([name, count]) => ({
        name,
        count,
        type: 'category',
      }));

    const topRatedCount = products.filter(
      (product) => Number(product.rating || 0) >= 4.5
    ).length;

    const inStockCount = products.filter(
      (product) => Number(product.stock || 0) > 0
    ).length;

    const usefulCollections = [
      {
        name: 'Top Rated',
        count: topRatedCount,
        type: 'rated',
      },
      {
        name: 'In Stock',
        count: inStockCount,
        type: 'stock',
      },
      {
        name: 'All Products',
        count: products.length,
        type: 'all',
      },
    ];

    return [...realCategories, ...usefulCollections].slice(0, 5);
  }, [products]);

  const curatedProducts = useMemo(() => {
    let result = [...products];

    if (filter === 'rated') {
      result.sort(
        (a, b) =>
          Number(b.rating || 0) - Number(a.rating || 0)
      );
    }

    if (filter === 'stock') {
      result = result.filter(
        (product) => Number(product.stock || 0) > 0
      );
    }

    return result.slice(0, 4);
  }, [products, filter]);

  return (
    <main className="bg-mist">
      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="bg-mist lg:h-[667px]">
        <div
          className="
            mx-auto grid max-w-[1184px]
            gap-10 px-6 py-14
            lg:h-[667px]
            lg:grid-cols-[677px_475px]
            lg:gap-8
            lg:px-0
            lg:py-[96px]
          "
        >
          {/* Hero text */}
          <div className="flex flex-col justify-center lg:h-[475px] lg:py-[56px]">
            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-semibold text-accent">
              <span className="h-2 w-2 rounded-full bg-accent" />
              Curated technology for modern workspaces
            </div>

            <h1
              className="
                mt-6 max-w-[620px]
                text-[42px] font-bold
                leading-[1.05]
                tracking-[-0.035em]
                text-ink
                sm:text-[50px]
                lg:text-[56px]
              "
            >
              Discover products made for your everyday life.
            </h1>

            <p className="mt-6 max-w-[565px] text-[16px] leading-7 text-slate">
              Elevated tech essentials, curated minimalist desk gear,
              and audio engineered for focus. Crafted to turn everyday
              workspace routines into effortless creative flow.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/products"
                className="
                  inline-flex h-12 min-w-[159px]
                  items-center justify-center gap-2
                  rounded-xl bg-accent px-7
                  text-sm font-semibold text-white
                  shadow-sm transition
                  hover:bg-blue-700
                "
              >
                Shop Now
                <span>→</span>
              </Link>

              <Link
                to="/my-orders"
                className="
                  inline-flex h-12 min-w-[185px]
                  items-center justify-center
                  rounded-xl border border-line
                  bg-white px-7
                  text-sm font-semibold text-ink
                  transition hover:border-accent
                "
              >
                View My Orders
              </Link>
            </div>
          </div>

          {/* Hero product visual */}
          <div className="relative mx-auto h-[475px] w-full max-w-[475px]">
            <div className="absolute -inset-4 rounded-[34px] bg-blue-100/50" />

            <div className="relative h-full w-full overflow-hidden rounded-[28px] bg-white p-[13px] shadow-sm ring-1 ring-line">
              <div className="relative h-full w-full overflow-hidden rounded-[20px] bg-[#edf3fb]">
                {featuredProduct ? (
                  <>
                    <img
                      src={featuredProduct.image}
                      alt={featuredProduct.name}
                      className="h-full w-full object-cover"
                    />

                    <div
                      className="
                        absolute bottom-4 left-4
                        w-[291px]
                        max-w-[calc(100%_-_32px)]
                        rounded-2xl
                        bg-white/95
                        px-5 py-3
                        shadow-lg backdrop-blur
                      "
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-accent" />

                        <div className="min-w-0">
                          <p className="text-xs text-slate">
                            Featured pick
                          </p>

                          <p className="mt-1 truncate text-sm font-semibold text-ink">
                            {featuredProduct.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="grid h-full place-items-center text-sm text-slate">
                    {loading
                      ? 'Loading featured product...'
                      : 'No products available'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          BROWSE BY DEPARTMENT
      ====================================================== */}
      <section className="border-y border-[#e4e8f0] bg-[#f6f8ff] lg:h-[436px]">
        <div className="mx-auto max-w-[1184px] px-6 py-14 lg:px-0 lg:pt-[80px]">
          <div className="flex min-h-[72px] items-end justify-between gap-6">
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-[0.04em] text-accent">
                Explore Collections
              </p>

              <h2 className="mt-2 text-[32px] font-bold tracking-[-0.025em] text-ink">
                Browse by Department
              </h2>
            </div>

            <Link
              to="/products"
              className="hidden items-center gap-2 text-sm font-semibold text-accent transition hover:gap-3 sm:flex"
            >
              View all products
              <span>→</span>
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {departments.map((department, index) => (
              <Link
                key={`${department.name}-${index}`}
                to="/products"
                className="
                  group flex h-[164px]
                  flex-col justify-between
                  rounded-[16px]
                  border border-[#dce2ec]
                  bg-white
                  px-5 py-5
                  shadow-[0_1px_2px_rgba(15,23,42,0.03)]
                  transition-all duration-200
                  hover:-translate-y-1
                  hover:border-blue-200
                  hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)]
                "
              >
                <div
                  className="
                    flex h-12 w-12
                    items-center justify-center
                    rounded-xl bg-[#eef4ff]
                    text-accent
                  "
                >
                  <DepartmentIcon index={index} />
                </div>

                <div>
                  <h3 className="truncate text-[15px] font-semibold text-ink">
                    {department.name}
                  </h3>

                  <p className="mt-1 text-[12px] text-slate">
                    {department.count}{' '}
                    {department.count === 1
                      ? 'Product'
                      : 'Products'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          CURATED ESSENTIALS
      ====================================================== */}
      <section className="bg-mist lg:h-[806px]">
        <div className="mx-auto max-w-[1280px] pt-14 lg:pt-[65px]">
          <div
            className="
              mx-auto flex min-h-[72px]
              max-w-[1184px]
              flex-col justify-between gap-5
              px-6
              sm:flex-row sm:items-end
              lg:px-0
            "
          >
            <div>
              <p className="text-[13px] font-semibold uppercase tracking-[0.04em] text-accent">
                Handpicked Catalog
              </p>

              <h2 className="mt-2 text-[32px] font-bold tracking-[-0.025em] text-ink">
                Curated Essentials
              </h2>
            </div>

            {/* Figma-style filters */}
            <div className="flex h-12 items-center gap-1 rounded-full border border-line bg-white p-1.5 shadow-sm">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`rounded-full px-5 py-2 text-xs font-semibold transition ${
                  filter === 'all'
                    ? 'bg-[#10213d] text-white'
                    : 'text-slate hover:text-ink'
                }`}
              >
                Trending
              </button>

              <button
                type="button"
                onClick={() => setFilter('stock')}
                className={`rounded-full px-5 py-2 text-xs font-semibold transition ${
                  filter === 'stock'
                    ? 'bg-[#10213d] text-white'
                    : 'text-slate hover:text-ink'
                }`}
              >
                New Arrivals
              </button>

              <button
                type="button"
                onClick={() => setFilter('rated')}
                className={`rounded-full px-5 py-2 text-xs font-semibold transition ${
                  filter === 'rated'
                    ? 'bg-[#10213d] text-white'
                    : 'text-slate hover:text-ink'
                }`}
              >
                Best Rated
              </button>
            </div>
          </div>

          {/* Products */}
          <div className="mx-auto mt-10 grid max-w-[1184px] gap-6 px-6 sm:grid-cols-2 lg:grid-cols-4 lg:px-0">
            {loading
              ? [1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-[470px] animate-pulse rounded-2xl bg-white ring-1 ring-line"
                  />
                ))
              : curatedProducts.map((product) => (
                  <article
                    key={product._id}
                    className="
                      flex h-[470px] flex-col
                      overflow-hidden rounded-2xl
                      bg-white shadow-sm
                      ring-1 ring-line
                      transition
                      hover:-translate-y-1
                      hover:shadow-lg
                    "
                  >
                    <div className="p-[17px] pb-0">
                      <Link
                        to={`/product/${product._id}`}
                        className="relative block h-[244px] overflow-hidden rounded-xl bg-[#f1f5f9]"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover transition duration-500 hover:scale-105"
                        />

                        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[10px] font-semibold text-accent shadow-sm">
                          {product.category}
                        </span>
                      </Link>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs">
                          <span className="text-amber-500">★</span>

                          <span className="font-medium text-ink">
                            {product.rating}
                          </span>
                        </div>

                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] text-slate">
                          {product.stock > 0
                            ? `${product.stock} in stock`
                            : 'Out of stock'}
                        </span>
                      </div>

                      <Link to={`/product/${product._id}`}>
                        <h3 className="mt-2 truncate text-[15px] font-semibold text-ink">
                          {product.name}
                        </h3>
                      </Link>

                      <p className="mt-2 line-clamp-2 h-10 text-xs leading-5 text-slate">
                        {product.description}
                      </p>
                    </div>

                    <div className="mt-auto border-t border-line px-[17px] pb-[17px] pt-4">
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-[10px] text-slate">
                            Price
                          </p>

                          <p className="mt-1 text-xl font-bold text-ink">
                            Rs. {product.price.toLocaleString()}
                          </p>
                        </div>

                        <button
                          type="button"
                          disabled={product.stock <= 0}
                          onClick={() => addToCart(product)}
                          aria-label={`Add ${product.name} to cart`}
                          className="
                            flex h-10 w-10
                            items-center justify-center
                            rounded-xl bg-accent
                            text-lg font-semibold text-white
                            transition
                            hover:bg-blue-700
                            disabled:cursor-not-allowed
                            disabled:bg-slate-200
                            disabled:text-slate
                          "
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
          </div>

          <div className="mx-auto mt-10 flex h-[54px] max-w-[1184px] items-center justify-center px-6 lg:px-0">
            <Link
              to="/products"
              className="
                rounded-xl border border-line
                bg-white px-8 py-3
                text-sm font-semibold text-ink
                transition
                hover:border-accent
                hover:text-accent
              "
            >
              Explore the complete collection →
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURED PROMO
      ====================================================== */}
      <section className="bg-mist pb-[96px]">
        <div
          className="
            relative mx-auto
            min-h-[500px] max-w-[1184px]
            overflow-hidden rounded-[28px]
            bg-[#0f172a]
            lg:h-[595px]
          "
        >
          <div
            className="
              relative z-10 grid h-full
              px-8 py-12
              lg:grid-cols-[612px_428px]
              lg:gap-8
              lg:px-[56px]
              lg:py-[56px]
            "
          >
            {/* Promo text */}
            <div className="flex flex-col justify-center">
              <span className="inline-flex w-fit rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-xs font-semibold text-blue-300">
                Featured collection
              </span>

              <h2 className="mt-6 max-w-[600px] text-4xl font-bold leading-[1.08] tracking-[-0.03em] text-white lg:text-[48px]">
                Technology engineered for everyday precision.
              </h2>

              <p className="mt-6 max-w-[510px] text-base leading-7 text-slate-300">
                Explore reliable hardware selected for focused work,
                entertainment and everyday productivity.
              </p>

              {featuredProduct && (
                <p className="mt-7 text-3xl font-bold text-white">
                  Rs. {featuredProduct.price.toLocaleString()}
                </p>
              )}

              <Link
                to="/products"
                className="
                  mt-8 inline-flex h-12 w-fit
                  items-center justify-center
                  rounded-xl bg-white px-7
                  text-sm font-semibold text-ink
                  transition hover:bg-slate-100
                "
              >
                Shop the Collection →
              </Link>
            </div>

            {/* Promo product image */}
            <div className="relative hidden items-center justify-center lg:flex">
              <div className="absolute h-[430px] w-[430px] rounded-full bg-blue-600/15 blur-3xl" />

              {featuredProduct && (
                <div className="relative h-[384px] w-[384px] overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-4 shadow-2xl">
                  <img
                    src={featuredProduct.image}
                    alt={featuredProduct.name}
                    className="h-full w-full rounded-[24px] object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ====================================================== */}
      <footer className="border-t border-line bg-white lg:min-h-[398px]">
        <div className="mx-auto max-w-[1184px] px-6 py-16 lg:px-0">
          <div
            className="
              grid gap-10
              md:grid-cols-2
              lg:min-h-[168px]
              lg:grid-cols-[450px_205px_205px_205px]
            "
          >
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-sm font-bold text-white">
                  C
                </div>

                <span className="text-lg font-bold text-ink">
                  CodeAlpha Store
                </span>
              </div>

              <p className="mt-4 max-w-[384px] text-sm leading-6 text-slate">
                Modern technology and everyday products, brought
                together in a simple e-commerce experience.
              </p>

              <p className="mt-5 text-xs text-slate">
                Built as a Full-Stack CodeAlpha project.
              </p>
            </div>

            {/* Storefront */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink">
                Storefront
              </p>

              <div className="mt-4 flex flex-col gap-3 text-sm text-slate">
                <Link
                  to="/products"
                  className="transition hover:text-accent"
                >
                  Shop Catalog
                </Link>

                <Link
                  to="/my-orders"
                  className="transition hover:text-accent"
                >
                  My Orders
                </Link>

                <Link
                  to="/cart"
                  className="transition hover:text-accent"
                >
                  Shopping Cart
                </Link>
              </div>
            </div>

            {/* Account */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink">
                Account
              </p>

              <div className="mt-4 flex flex-col gap-3 text-sm text-slate">
                <Link
                  to="/"
                  className="transition hover:text-accent"
                >
                  Home
                </Link>

                <Link
                  to="/products"
                  className="transition hover:text-accent"
                >
                  Products
                </Link>

                <Link
                  to="/my-orders"
                  className="transition hover:text-accent"
                >
                  Order History
                </Link>
              </div>
            </div>

            {/* Location */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink">
                Colombo Hub
              </p>

              <div className="mt-4 text-sm leading-6 text-slate">
                <p>Colombo</p>
                <p>Sri Lanka</p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex min-h-[53px] flex-col justify-between gap-3 border-t border-line pt-6 text-xs text-slate sm:flex-row">
            <p>
              © 2026 CodeAlpha Store. Full-Stack E-commerce Project.
            </p>

            <p>
              Built with React, Node.js & MongoDB
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default Dashboard;
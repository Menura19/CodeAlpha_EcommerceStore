import { useEffect, useMemo, useState } from 'react';
import {
  Link,
  useSearchParams,
} from 'react-router-dom';

import api from '../api/axios';
import { useCart } from '../context/CartContext';

const PAGE_SIZE = 8;

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchParams] = useSearchParams();
  const globalSearch = searchParams.get('search') || '';

  const [search, setSearch] = useState(globalSearch);
  const [category, setCategory] = useState('All');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState('featured');
  const [page, setPage] = useState(1);

  const { addToCart } = useCart();

  /* =====================================================
     LOAD REAL PRODUCTS
  ===================================================== */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await api.get('/products');

        setProducts(response.data.products || []);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            err.message ||
            'Failed to load products.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* Navbar search -> Products search */
  useEffect(() => {
    setSearch(globalSearch);
    setPage(1);
  }, [globalSearch]);

  /* =====================================================
     REAL DATABASE CATEGORIES
  ===================================================== */
  const categories = useMemo(() => {
    const realCategories = [
      ...new Set(
        products
          .map((product) => product.category)
          .filter(Boolean)
      ),
    ];

    return ['All', ...realCategories];
  }, [products]);

  /* =====================================================
     FILTER + SORT
  ===================================================== */
  const filteredProducts = useMemo(() => {
    let result = [...products];

    const query = search.trim().toLowerCase();

    if (query) {
      result = result.filter((product) => {
        const name = product.name?.toLowerCase() || '';
        const productCategory =
          product.category?.toLowerCase() || '';
        const description =
          product.description?.toLowerCase() || '';

        return (
          name.includes(query) ||
          productCategory.includes(query) ||
          description.includes(query)
        );
      });
    }

    if (category !== 'All') {
      result = result.filter(
        (product) => product.category === category
      );
    }

    if (inStockOnly) {
      result = result.filter(
        (product) => Number(product.stock || 0) > 0
      );
    }

    if (sort === 'price-low') {
      result.sort(
        (a, b) =>
          Number(a.price || 0) - Number(b.price || 0)
      );
    }

    if (sort === 'price-high') {
      result.sort(
        (a, b) =>
          Number(b.price || 0) - Number(a.price || 0)
      );
    }

    if (sort === 'rating') {
      result.sort(
        (a, b) =>
          Number(b.rating || 0) - Number(a.rating || 0)
      );
    }

    if (sort === 'name') {
      result.sort((a, b) =>
        String(a.name || '').localeCompare(
          String(b.name || '')
        )
      );
    }

    return result;
  }, [
    products,
    search,
    category,
    inStockOnly,
    sort,
  ]);

  /* =====================================================
     PAGINATION
  ===================================================== */
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);

  const visibleProducts = useMemo(() => {
    const start =
      (currentPage - 1) * PAGE_SIZE;

    return filteredProducts.slice(
      start,
      start + PAGE_SIZE
    );
  }, [filteredProducts, currentPage]);

  const changeCategory = (nextCategory) => {
    setCategory(nextCategory);
    setPage(1);
  };

  const changeSearch = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const changeStockFilter = (event) => {
    setInStockOnly(event.target.checked);
    setPage(1);
  };

  const changeSort = (event) => {
    setSort(event.target.value);
    setPage(1);
  };

  const handleAddToCart = (
    event,
    product
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (product.stock > 0) {
      addToCart(product);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      {/* =================================================
          MAIN
      ================================================== */}
      <main className="mx-auto max-w-[1280px] px-6 py-8 lg:px-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 pb-6 text-[11px] font-semibold">
          <Link
            to="/"
            className="text-[#737686] transition hover:text-[#004ac6]"
          >
            Home
          </Link>

          <span className="text-[#a3a7b3]">
            ›
          </span>

          <span className="text-[#0b1c30]">
            Shop
          </span>
        </nav>

        {/* =================================================
            PAGE HEADER
        ================================================== */}
        <section className="flex flex-col gap-8 border-b border-[rgba(195,198,215,0.4)] pb-8 lg:min-h-[179px] lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[672px]">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#e5eeff] px-3 py-1 text-[11px] font-semibold tracking-[0.025em] text-[#004ac6]">
              <span className="h-2 w-2 rounded-full bg-[#004ac6]" />
              CodeAlpha Hardware Catalog
            </div>

            <h1 className="mt-2 text-[36px] font-bold leading-[44px] tracking-[-0.025em] text-[#0b1c30]">
              All Products
            </h1>

            <p className="mt-2 max-w-[600px] text-[18px] leading-7 text-[#434655]">
              Explore our selection of tech,
              lifestyle and everyday products
              from the CodeAlpha Store catalog.
            </p>
          </div>

          {/* Figma 320 × 44 search */}
          <div className="relative w-full lg:w-[320px]">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737686]"
              width="16"
              height="16"
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
              onChange={changeSearch}
              placeholder="Filter models or specs..."
              className="
                h-11 w-full
                rounded-xl
                border border-[rgba(195,198,215,0.7)]
                bg-white
                pl-11 pr-10
                text-[13px] text-[#0b1c30]
                shadow-sm
                outline-none
                transition
                placeholder:text-[#737686]
                focus:border-[#004ac6]
              "
            />

            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setPage(1);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#737686] hover:text-[#0b1c30]"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </section>

        {/* =================================================
            FILTER / SORT TOOLBAR
        ================================================== */}
        <section className="flex flex-col gap-5 py-6 xl:flex-row xl:items-center xl:justify-between">
          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((item) => {
              const active =
                category === item;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() =>
                    changeCategory(item)
                  }
                  className={`
                    whitespace-nowrap
                    rounded-full
                    px-4 py-2
                    text-[13px] font-semibold
                    transition
                    ${
                      active
                        ? 'bg-[#0b1c30] text-white shadow-sm'
                        : 'bg-[#eff4ff] text-[#434655] hover:bg-[#e5eeff] hover:text-[#004ac6]'
                    }
                  `}
                >
                  {item === 'All'
                    ? 'All Products'
                    : item}
                </button>
              );
            })}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-[13px] text-[#434655]">
              Showing{' '}
              <span className="font-semibold text-[#0b1c30]">
                {filteredProducts.length}
              </span>{' '}
              of {products.length}{' '}
              {products.length === 1
                ? 'product'
                : 'products'}
            </p>

            <span className="hidden h-4 w-px bg-[rgba(195,198,215,0.5)] sm:block" />

            {/* In-stock checkbox */}
            <label className="flex cursor-pointer items-center gap-2 text-[13px] font-semibold text-[#434655]">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={changeStockFilter}
                className="h-[18px] w-[18px] accent-[#004ac6]"
              />

              In-stock only
            </label>

            {/* Sort */}
            <select
              value={sort}
              onChange={changeSort}
              className="
                h-9 min-w-[163px]
                rounded-xl
                border border-[rgba(195,198,215,0.8)]
                bg-white
                px-3
                text-[13px] font-semibold
                text-[#0b1c30]
                shadow-sm
                outline-none
                focus:border-[#004ac6]
              "
            >
              <option value="featured">
                Featured: Default
              </option>

              <option value="price-low">
                Price: Low to High
              </option>

              <option value="price-high">
                Price: High to Low
              </option>

              <option value="rating">
                Best Rated
              </option>

              <option value="name">
                Name: A-Z
              </option>
            </select>
          </div>
        </section>

        {/* =================================================
            LOADING
        ================================================== */}
        {loading && (
          <div className="grid gap-6 py-2 sm:grid-cols-2 lg:grid-cols-4">
            {[
              1, 2, 3, 4,
              5, 6, 7, 8,
            ].map((item) => (
              <div
                key={item}
                className="h-[475px] animate-pulse rounded-2xl bg-white ring-1 ring-[#e2e6ef]"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="my-8 rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="font-semibold text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* =================================================
            4 COLUMN PRODUCT GRID
            1184px / 24px gap -> 278px cards
        ================================================== */}
        {!loading &&
          !error &&
          visibleProducts.length > 0 && (
            <section className="grid gap-6 pb-16 pt-2 sm:grid-cols-2 lg:grid-cols-4">
              {visibleProducts.map(
                (product) => (
                  <article
                    key={product._id}
                    className="
                      flex min-h-[475px]
                      flex-col justify-between
                      rounded-2xl
                      border border-[rgba(195,198,215,0.5)]
                      bg-white
                      p-[17px]
                      shadow-[0_1px_2px_rgba(0,0,0,0.05)]
                      transition duration-200
                      hover:-translate-y-1
                      hover:shadow-[0_10px_28px_rgba(15,23,42,0.08)]
                    "
                  >
                    {/* Top */}
                    <div>
                      {/* Image */}
                      <Link
                        to={`/product/${product._id}`}
                        className="relative block aspect-square overflow-hidden rounded-xl bg-[#eff4ff]"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover transition duration-500 hover:scale-105"
                        />

                        {/* Category badge */}
                        <span
                          className="
                            absolute left-[10px] top-[10px]
                            max-w-[150px]
                            truncate
                            rounded-full
                            bg-white/90
                            px-2.5 py-0.5
                            text-[10px] font-bold
                            uppercase
                            tracking-[0.05em]
                            text-[#006058]
                            shadow-sm
                            backdrop-blur-sm
                          "
                        >
                          {product.category ||
                            'Product'}
                        </span>
                      </Link>

                      {/* Product details */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between">
                          {/* Rating */}
                          <div className="flex items-center gap-1 text-[11px]">
                            <span className="text-amber-500">
                              ★
                            </span>

                            <span className="font-semibold text-[#0b1c30]">
                              {product.rating ??
                                '0.0'}
                            </span>
                          </div>

                          {/* Stock */}
                          <span
                            className={`text-[11px] font-medium ${
                              product.stock >
                              0
                                ? 'text-[#006058]'
                                : 'text-red-600'
                            }`}
                          >
                            {product.stock > 0
                              ? `${product.stock} in stock`
                              : 'Out of stock'}
                          </span>
                        </div>

                        <Link
                          to={`/product/${product._id}`}
                        >
                          <h2 className="mt-1.5 truncate text-[15px] font-bold leading-5 text-[#0b1c30] transition hover:text-[#004ac6]">
                            {product.name}
                          </h2>
                        </Link>

                        <p className="mt-1.5 truncate text-[13px] leading-5 text-[#434655]">
                          {product.description}
                        </p>
                      </div>
                    </div>

                    {/* Price/action rail */}
                    <div className="mt-4 border-t border-[rgba(195,198,215,0.3)] pt-4">
                      <div className="flex items-baseline justify-between">
                        <span className="text-[11px] font-semibold text-[#737686]">
                          Price
                        </span>

                        <span className="text-[22px] font-bold tracking-[-0.025em] text-[#0b1c30]">
                          Rs.{' '}
                          {Number(
                            product.price || 0
                          ).toLocaleString()}
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-[1fr_52px] gap-2">
                        <Link
                          to={`/product/${product._id}`}
                          className="
                            flex h-10
                            items-center justify-center
                            rounded-xl
                            bg-[#004ac6]
                            text-[13px]
                            font-semibold
                            text-white
                            transition
                            hover:bg-[#003ca1]
                          "
                        >
                          View Product
                        </Link>

                        <button
                          type="button"
                          disabled={
                            product.stock <= 0
                          }
                          onClick={(event) =>
                            handleAddToCart(
                              event,
                              product
                            )
                          }
                          className="
                            flex h-10
                            items-center justify-center
                            rounded-xl
                            border border-[rgba(195,198,215,0.7)]
                            bg-white
                            text-[#0b1c30]
                            transition
                            hover:border-[#004ac6]
                            hover:text-[#004ac6]
                            disabled:cursor-not-allowed
                            disabled:bg-slate-100
                            disabled:text-slate-400
                          "
                          aria-label={`Add ${product.name} to cart`}
                        >
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
                            <path d="M12 8v5" />
                            <path d="M9.5 10.5h5" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </article>
                )
              )}
            </section>
          )}

        {/* =================================================
            EMPTY STATE
        ================================================== */}
        {!loading &&
          !error &&
          visibleProducts.length === 0 && (
            <section className="my-10 rounded-2xl border border-[rgba(195,198,215,0.5)] bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#eff4ff] text-[#004ac6]">
                <svg
                  width="22"
                  height="22"
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
              </div>

              <h2 className="mt-4 text-xl font-bold text-[#0b1c30]">
                No products found
              </h2>

              <p className="mt-2 text-sm text-[#737686]">
                Try changing your search
                or filters.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setCategory('All');
                  setInStockOnly(false);
                  setSort('featured');
                  setPage(1);
                }}
                className="mt-5 rounded-xl bg-[#004ac6] px-5 py-2.5 text-sm font-semibold text-white"
              >
                Clear Filters
              </button>
            </section>
          )}

        {/* =================================================
            REAL PAGINATION
        ================================================== */}
        {!loading &&
          !error &&
          filteredProducts.length > 0 && (
            <section className="flex items-center justify-center border-t border-[rgba(195,198,215,0.4)] py-8">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setPage((current) =>
                      Math.max(
                        1,
                        current - 1
                      )
                    )
                  }
                  className="
                    flex h-10 w-10
                    items-center justify-center
                    rounded-xl
                    border border-[rgba(195,198,215,0.7)]
                    bg-white
                    text-[#0b1c30]
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  ‹
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() =>
                      setPage(pageNumber)
                    }
                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-[13px] font-semibold transition ${
                      currentPage ===
                      pageNumber
                        ? 'bg-[#004ac6] text-white shadow-sm'
                        : 'text-[#434655] hover:bg-white'
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={
                    currentPage ===
                    totalPages
                  }
                  onClick={() =>
                    setPage((current) =>
                      Math.min(
                        totalPages,
                        current + 1
                      )
                    )
                  }
                  className="
                    flex h-10
                    items-center gap-2
                    rounded-xl
                    border border-[rgba(195,198,215,0.7)]
                    bg-white
                    px-4
                    text-[13px]
                    font-semibold
                    text-[#0b1c30]
                    disabled:cursor-not-allowed
                    disabled:opacity-40
                  "
                >
                  Next
                  <span>›</span>
                </button>
              </div>
            </section>
          )}
      </main>

      {/* =================================================
          FIGMA-STYLE FOOTER
      ================================================== */}
      <footer className="border-t border-[rgba(195,198,215,0.4)] bg-white">
        <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-12">
          <div className="grid gap-10 border-b border-[rgba(195,198,215,0.3)] pb-12 md:grid-cols-2 lg:grid-cols-5">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#004ac6] text-[11px] font-semibold text-white">
                  CA
                </div>

                <span className="text-[20px] font-bold text-[#0b1c30]">
                  CodeAlpha Store
                </span>
              </div>

              <p className="mt-4 max-w-[384px] text-[13px] leading-5 text-[#434655]">
                Modern technology and
                everyday products brought
                together in a simple,
                reliable e-commerce
                experience.
              </p>
            </div>

            {/* Catalog */}
            <div>
              <h3 className="text-[15px] font-semibold text-[#0b1c30]">
                Catalog
              </h3>

              <div className="mt-3 flex flex-col gap-2 text-[13px]">
                <Link
                  to="/products"
                  className="font-semibold text-[#004ac6]"
                >
                  Shop Catalog
                </Link>

                <Link
                  to="/"
                  className="text-[#434655] hover:text-[#004ac6]"
                >
                  Home
                </Link>
              </div>
            </div>

            {/* Account */}
            <div>
              <h3 className="text-[15px] font-semibold text-[#0b1c30]">
                Account & Orders
              </h3>

              <div className="mt-3 flex flex-col gap-2 text-[13px] text-[#434655]">
                <Link
                  to="/my-orders"
                  className="hover:text-[#004ac6]"
                >
                  My Orders
                </Link>

                <Link
                  to="/cart"
                  className="hover:text-[#004ac6]"
                >
                  Shopping Cart
                </Link>
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h3 className="text-[15px] font-semibold text-[#0b1c30]">
                Navigation
              </h3>

              <div className="mt-3 flex flex-col gap-2 text-[13px] text-[#434655]">
                <Link
                  to="/"
                  className="hover:text-[#004ac6]"
                >
                  Home
                </Link>

                <Link
                  to="/products"
                  className="hover:text-[#004ac6]"
                >
                  Products
                </Link>

                <Link
                  to="/my-orders"
                  className="hover:text-[#004ac6]"
                >
                  Order History
                </Link>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-3 pt-8 text-[13px] text-[#737686] sm:flex-row">
            <p>
              © 2026 CodeAlpha Store.
              Full-Stack E-commerce Project.
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

export default ProductsPage;
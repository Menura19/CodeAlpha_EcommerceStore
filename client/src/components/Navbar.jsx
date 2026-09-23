import { useState } from 'react';

import {
  Link,
  NavLink,
  useNavigate,
} from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [search, setSearch] =
    useState('');

  const signOut = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (event) => {
    event.preventDefault();

    const query = search.trim();

    if (query) {
      navigate(
        `/products?search=${encodeURIComponent(
          query
        )}`
      );
    } else {
      navigate('/products');
    }

    setMenuOpen(false);
  };

  /* =====================================================
     DESKTOP NAVIGATION STYLE
  ===================================================== */
  const navClass = ({ isActive }) =>
    `
      flex h-20 shrink-0
      items-center
      whitespace-nowrap

      border-x-0
      border-t-0
      border-b-2

      px-1

      text-[15px]
      font-semibold

      transition-colors

      outline-none
      ring-0

      focus:outline-none
      focus:ring-0

      focus-visible:outline-none
      focus-visible:ring-0

      ${
        isActive
          ? 'border-b-[#004ac6] text-[#004ac6]'
          : 'border-b-transparent text-[#434655] hover:text-[#004ac6]'
      }
    `;

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(195,198,215,0.5)] bg-white/95 shadow-[0_1px_2px_rgba(0,0,0,0.03)] backdrop-blur">
      <div className="mx-auto flex h-20 max-w-[1280px] items-center px-6 lg:px-12">

        {/* ==========================================
            LEFT: BRAND + SEARCH
        ========================================== */}
        <div className="flex shrink-0 items-center gap-8">
          <Link
            to="/"
            onClick={() =>
              setMenuOpen(false)
            }
            className="
              flex shrink-0
              items-center gap-2
              outline-none
              focus:outline-none
              focus-visible:outline-none
            "
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#004ac6] text-sm font-bold text-white shadow-sm">
              C
            </div>

            <span className="whitespace-nowrap text-[20px] font-bold tracking-[-0.025em] text-[#0b1c30]">
              CodeAlpha Store
            </span>
          </Link>

          {/* Desktop search */}
          {user && (
            <form
              onSubmit={handleSearch}
              className="relative hidden w-72 shrink-0 lg:block"
            >
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
                placeholder="Search gear, hardware..."
                className="
                  h-11 w-full

                  rounded-xl

                  border
                  border-[rgba(195,198,215,0.6)]

                  bg-[#eff4ff]

                  pl-11 pr-4

                  text-[13px]
                  text-[#0b1c30]

                  outline-none

                  transition

                  placeholder:text-[#6b7280]

                  focus:border-[#004ac6]
                  focus:bg-white
                  focus:outline-none
                  focus:ring-0
                "
              />
            </form>
          )}
        </div>

        {/* ==========================================
            CENTER: DESKTOP NAVIGATION
        ========================================== */}
        {user && (
          <nav className="ml-auto hidden h-20 shrink-0 items-center gap-8 md:flex lg:ml-[70px]">

            <NavLink
              to="/"
              end
              className={navClass}
            >
              Home
            </NavLink>

            <NavLink
              to="/products"
              className={navClass}
            >
              Shop
            </NavLink>

            <NavLink
              to="/my-orders"
              className={navClass}
            >
              My Orders
            </NavLink>
          </nav>
        )}

        {/* ==========================================
            RIGHT: CART + PROFILE
        ========================================== */}
        {user && (
          <div className="ml-auto hidden shrink-0 items-center md:flex">

            {/* Cart */}
            <Link
              to="/cart"
              className="
                relative

                flex h-10 w-10
                shrink-0
                items-center
                justify-center

                rounded-xl

                text-[#0b1c30]

                outline-none

                transition

                hover:bg-[#eff4ff]
                hover:text-[#004ac6]

                focus:outline-none
                focus-visible:outline-none
                focus-visible:ring-0
              "
              aria-label="Shopping cart"
            >
              <svg
                width="18"
                height="20"
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

              <span className="absolute -right-1 -top-1 flex h-[22px] min-w-[22px] items-center justify-center rounded-full border-2 border-white bg-[#004ac6] px-1 text-[10px] font-bold text-white shadow-sm">
                {cartCount}
              </span>
            </Link>

            {/* Divider */}
            <div className="mx-5 h-6 w-px shrink-0 bg-[rgba(195,198,215,0.6)]" />

            {/* Profile */}
            <div className="flex shrink-0 items-center">

              {/* Avatar */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[rgba(195,198,215,0.8)] bg-[#dce9ff] text-[12px] font-bold text-[#004ac6]">
                {user?.name
                  ?.charAt(0)
                  ?.toUpperCase() ||
                  'U'}
              </div>

              {/* Name */}
              <div className="ml-3 hidden min-w-[118px] xl:block">
                <p className="max-w-[135px] truncate whitespace-nowrap text-[12px] font-semibold text-[#0b1c30]">
                  {user?.name}
                </p>

                <p className="mt-0.5 whitespace-nowrap text-[11px] text-[#737686]">
                  Member
                </p>
              </div>

              {/* Sign Out */}
              <button
                type="button"
                onClick={signOut}
                className="
                  ml-5

                  shrink-0
                  whitespace-nowrap

                  rounded-lg

                  px-3 py-2

                  text-[13px]
                  font-semibold

                  text-[#434655]

                  outline-none

                  transition

                  hover:bg-[#eff4ff]
                  hover:text-[#004ac6]

                  focus:outline-none
                  focus-visible:outline-none
                  focus-visible:ring-0
                "
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        {/* ==========================================
            MOBILE MENU BUTTON
        ========================================== */}
        {user && (
          <button
            type="button"
            onClick={() =>
              setMenuOpen(
                (current) =>
                  !current
              )
            }
            className="
              ml-auto

              flex h-10 w-10
              items-center
              justify-center

              rounded-xl

              border
              border-[rgba(195,198,215,0.7)]

              text-[#0b1c30]

              outline-none

              md:hidden

              focus:outline-none
              focus-visible:outline-none
              focus-visible:ring-0
            "
            aria-label="Toggle navigation"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {menuOpen ? (
                <>
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </>
              ) : (
                <>
                  <path d="M4 6h16" />
                  <path d="M4 12h16" />
                  <path d="M4 18h16" />
                </>
              )}
            </svg>
          </button>
        )}
      </div>

      {/* ==========================================
          MOBILE MENU
      ========================================== */}
      {user && menuOpen && (
        <div className="border-t border-[rgba(195,198,215,0.5)] bg-white px-5 py-4 md:hidden">

          {/* Mobile Search */}
          <form
            onSubmit={handleSearch}
            className="relative mb-4"
          >
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#737686]"
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
              placeholder="Search gear, hardware..."
              className="
                h-11 w-full

                rounded-xl

                border
                border-[rgba(195,198,215,0.6)]

                bg-[#eff4ff]

                pl-10 pr-4

                text-sm

                outline-none

                focus:border-[#004ac6]
                focus:outline-none
                focus:ring-0
              "
            />
          </form>

          {/* Mobile Navigation */}
          <div className="flex flex-col gap-1">

            <NavLink
              to="/"
              end
              onClick={() =>
                setMenuOpen(false)
              }
              className={({ isActive }) =>
                `
                  rounded-lg
                  px-3 py-2.5
                  text-sm
                  font-semibold
                  outline-none
                  focus:outline-none
                  focus-visible:outline-none
                  focus-visible:ring-0
                  ${
                    isActive
                      ? 'bg-[#eff4ff] text-[#004ac6]'
                      : 'text-[#0b1c30] hover:bg-[#eff4ff]'
                  }
                `
              }
            >
              Home
            </NavLink>

            <NavLink
              to="/products"
              onClick={() =>
                setMenuOpen(false)
              }
              className={({ isActive }) =>
                `
                  rounded-lg
                  px-3 py-2.5
                  text-sm
                  font-semibold
                  outline-none
                  focus:outline-none
                  focus-visible:outline-none
                  focus-visible:ring-0
                  ${
                    isActive
                      ? 'bg-[#eff4ff] text-[#004ac6]'
                      : 'text-[#0b1c30] hover:bg-[#eff4ff]'
                  }
                `
              }
            >
              Shop
            </NavLink>

            <NavLink
              to="/my-orders"
              onClick={() =>
                setMenuOpen(false)
              }
              className={({ isActive }) =>
                `
                  rounded-lg
                  px-3 py-2.5
                  text-sm
                  font-semibold
                  outline-none
                  focus:outline-none
                  focus-visible:outline-none
                  focus-visible:ring-0
                  ${
                    isActive
                      ? 'bg-[#eff4ff] text-[#004ac6]'
                      : 'text-[#0b1c30] hover:bg-[#eff4ff]'
                  }
                `
              }
            >
              My Orders
            </NavLink>

            <NavLink
              to="/cart"
              onClick={() =>
                setMenuOpen(false)
              }
              className={({ isActive }) =>
                `
                  flex
                  items-center
                  justify-between

                  rounded-lg

                  px-3 py-2.5

                  text-sm
                  font-semibold

                  outline-none

                  focus:outline-none
                  focus-visible:outline-none
                  focus-visible:ring-0

                  ${
                    isActive
                      ? 'bg-[#eff4ff] text-[#004ac6]'
                      : 'text-[#0b1c30] hover:bg-[#eff4ff]'
                  }
                `
              }
            >
              Cart

              <span className="rounded-full bg-[#004ac6] px-2 py-0.5 text-xs font-bold text-white">
                {cartCount}
              </span>
            </NavLink>

            <button
              type="button"
              onClick={signOut}
              className="
                mt-2
                border-t
                border-[rgba(195,198,215,0.5)]
                px-3 py-3
                text-left
                text-sm
                font-semibold
                text-red-600

                outline-none

                focus:outline-none
                focus-visible:outline-none
                focus-visible:ring-0
              "
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
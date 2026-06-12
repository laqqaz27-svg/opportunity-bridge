import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBriefcase,
  faCircleHalfStroke,
  faCompass,
  faDonate,
  faHouse,
  faPowerOff,
  faRightToBracket,
  faTableColumns,
} from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/logo.png'

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth()
  const location = useLocation()
  const mobileMenuRef = useRef(null)
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('koh_theme') === 'dark')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('theme-dark')
      localStorage.setItem('koh_theme', 'dark')
      return
    }

    document.documentElement.classList.remove('theme-dark')
    localStorage.setItem('koh_theme', 'light')
  }, [darkMode])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname, location.hash])

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }

    const handlePointerDown = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [isMobileMenuOpen])

  const toggleTheme = () => {
    setDarkMode((prev) => !prev)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  const handleMobileThemeToggle = () => {
    toggleTheme()
    closeMobileMenu()
  }

  const handleMobileLogout = () => {
    closeMobileMenu()
    logout()
  }

  const dashboardPath =
    user?.role === 'admin' ? '/admin' : user?.role === 'employer' ? '/employer-dashboard' : '/dashboard'

  const sectionNavItems = [
    { href: '/home#home', hash: '#home', label: 'Home', icon: faHouse },
    { href: '/home#programs', hash: '#programs', label: 'Programs', icon: faBriefcase },
    { href: '/home#contact', hash: '#contact', label: 'Contact', icon: faCompass },
  ]

  const isSectionActive = (hash) => {
    if (location.pathname !== '/home') {
      return false
    }

    if (!location.hash && hash === '#home') {
      return true
    }

    return location.hash === hash
  }

  return (
    <header className="sticky top-0 z-30 border-b border-amber-900/15 bg-transparent px-2 pt-2 md:px-3">
      <nav className="nav-shell mx-auto flex w-full max-w-6xl items-center justify-between px-3 py-2.5 md:px-4">
        <Link to="/" className="group flex items-center gap-2.5 md:mr-6 lg:mr-8">
          <img
            src={logo}
            alt="Opportunity Bridge logo"
            loading="eager"
            decoding="async"
            className={`logo-frame h-10 w-10 rounded-xl p-1 object-contain shadow-sm md:h-11 md:w-11 ${
              darkMode ? '' : 'logo-blue'
            }`}
          />
          <div className="leading-tight">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-kohBlue">Opportunity Bridge</p>
            <p className="text-[11px] text-slate-600 md:text-xs">Hope + Innovation + Community</p>
          </div>
        </Link>

        <div className="hidden items-center gap-2.5 md:flex">
          <Link
            to="/opportunity-feed"
            className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
              location.pathname === '/opportunity-feed'
                ? 'bg-kohBlue text-white shadow-md shadow-kohBlue/25'
                : 'text-slate-700 hover:bg-white/70 hover:text-kohBlue'
            }`}
          >
            <FontAwesomeIcon icon={faCompass} className="mr-2" />
            Opportunity Feed
          </Link>
          {sectionNavItems.map((item) => (
            <a
              key={item.hash}
              href={item.href}
              className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
                isSectionActive(item.hash)
                  ? 'bg-kohBlue text-white shadow-md shadow-kohBlue/25'
                  : 'text-slate-700 hover:bg-white/70 hover:text-kohBlue'
              }`}
            >
              <FontAwesomeIcon icon={item.icon} className="mr-2" />
              {item.label}
            </a>
          ))}
          {isAuthenticated && (
            <Link
              to={dashboardPath}
              className={`rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
                location.pathname === dashboardPath
                  ? 'bg-kohBlue text-white shadow-md shadow-kohBlue/25'
                  : 'text-slate-700 hover:bg-white/70 hover:text-kohBlue'
              }`}
            >
              <FontAwesomeIcon icon={faTableColumns} className="mr-2" />
              Dashboard
            </Link>
          )}
          <Link
            to="/donate"
            className="magnetic-btn btn-pill btn-animated-border btn-shimmer rounded-full bg-gradient-to-r from-kohOrange to-amber-500 px-4 py-2 text-sm font-bold text-white shadow-koh transition hover:brightness-105"
          >
            <FontAwesomeIcon icon={faDonate} className="mr-2" />
            Donate
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            className="magnetic-btn rounded-full border border-slate-300/90 bg-white/65 px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-kohBlue hover:text-kohBlue"
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            <FontAwesomeIcon icon={faCircleHalfStroke} className="mr-2" />
            {darkMode ? 'Light' : 'Dark'}
          </button>
          {!isAuthenticated && (
            <Link
              to="/register"
              state={{ fastLoad: true }}
              className="magnetic-btn btn-pill btn-animated-border btn-shimmer fast-login-btn rounded-full border border-slate-300/90 bg-white/65 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-kohBlue hover:text-kohBlue"
            >
              <FontAwesomeIcon icon={faRightToBracket} className="mr-2" />
              Get Started
            </Link>
          )}
          {isAuthenticated && (
            <>
              <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-kohBlue">
                {user?.role}
              </span>
              <button
                type="button"
                onClick={logout}
                className="magnetic-btn rounded-full border border-slate-300/90 bg-white/65 px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-kohBlue hover:text-kohBlue"
              >
                <FontAwesomeIcon icon={faPowerOff} className="mr-2" />
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      <div ref={mobileMenuRef} className="md:hidden">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 pb-2 pt-1">
          <div className="flex min-w-0 items-center gap-2 rounded-[1.4rem] border border-slate-200/80 bg-white/80 px-2.5 py-2 shadow-sm backdrop-blur">
            <img
              src={logo}
              alt="Opportunity Bridge logo"
              loading="eager"
              decoding="async"
              className={`h-9 w-9 rounded-xl p-1 object-contain shadow-sm ${darkMode ? '' : 'logo-blue'}`}
            />
            <div className="min-w-0 leading-tight">
              <p className="truncate text-[10px] font-bold uppercase tracking-[0.18em] text-kohBlue">Opportunity Bridge</p>
              <p className="truncate text-xs font-medium text-slate-600">Quick links and account actions</p>
            </div>
          </div>
          <button
            type="button"
            onClick={toggleMobileMenu}
            className="magnetic-btn flex shrink-0 items-center gap-2 rounded-full border border-slate-300/90 bg-white/85 px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:border-kohBlue hover:text-kohBlue"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav-menu"
            aria-label="Toggle navigation menu"
          >
            <span className="flex h-4 w-4 flex-col items-center justify-center gap-[3px]" aria-hidden="true">
              <span
                className={`block h-[2px] w-4 rounded-full bg-current transition-transform duration-200 ${
                  isMobileMenuOpen ? 'translate-y-[5px] rotate-45' : ''
                }`}
              />
              <span
                className={`block h-[2px] w-4 rounded-full bg-current transition-opacity duration-200 ${
                  isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`block h-[2px] w-4 rounded-full bg-current transition-transform duration-200 ${
                  isMobileMenuOpen ? '-translate-y-[5px] -rotate-45' : ''
                }`}
              />
            </span>
            <span>{isMobileMenuOpen ? 'Close' : 'Menu'}</span>
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="px-4 pb-4">
            <div
              id="mobile-nav-menu"
              className="mx-auto flex w-full max-w-6xl flex-col gap-2.5 rounded-[1.6rem] border border-slate-200/80 bg-white/92 p-3.5 shadow-xl shadow-slate-900/10 backdrop-blur"
            >
              <div className="flex items-center justify-between rounded-[1.2rem] bg-slate-100/70 px-3 py-2">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-kohBlue">Menu</p>
                  <p className="text-xs text-slate-600">Choose a destination or account action</p>
                </div>
                {isAuthenticated && (
                  <span className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-kohBlue">
                    {user?.role}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/opportunity-feed"
                  onClick={closeMobileMenu}
                  className={`rounded-full px-3 py-2 text-center text-sm font-semibold transition-colors ${
                    location.pathname === '/opportunity-feed'
                      ? 'bg-kohBlue text-white shadow-md shadow-kohBlue/25'
                      : 'bg-slate-100/80 text-slate-700 hover:text-kohBlue'
                  }`}
                >
                  <FontAwesomeIcon icon={faCompass} className="mr-2" />
                  Opportunity Feed
                </Link>
                <Link
                  to="/donate"
                  onClick={closeMobileMenu}
                  className="rounded-full bg-gradient-to-r from-kohOrange to-amber-500 px-3 py-2 text-center text-sm font-bold text-white shadow-koh transition hover:brightness-105"
                >
                  <FontAwesomeIcon icon={faDonate} className="mr-2" />
                  Donate
                </Link>
                {isAuthenticated && (
                  <Link
                    to={dashboardPath}
                    onClick={closeMobileMenu}
                    className={`rounded-full px-3 py-2 text-center text-sm font-semibold transition-colors ${
                      location.pathname === dashboardPath
                        ? 'bg-kohBlue text-white shadow-md shadow-kohBlue/25'
                        : 'bg-slate-100/80 text-slate-700 hover:text-kohBlue'
                    }`}
                  >
                    <FontAwesomeIcon icon={faTableColumns} className="mr-2" />
                    Dashboard
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleMobileThemeToggle}
                  className="magnetic-btn rounded-full border border-slate-300/90 bg-white px-3 py-2 text-center text-sm font-bold text-slate-700 transition hover:border-kohBlue hover:text-kohBlue"
                >
                  <FontAwesomeIcon icon={faCircleHalfStroke} className="mr-2" />
                  {darkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
              </div>

              <div className="space-y-1.5">
                {sectionNavItems.map((item) => (
                  <a
                    key={item.hash}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={`block rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                      isSectionActive(item.hash)
                        ? 'bg-kohBlue text-white shadow-md shadow-kohBlue/25'
                        : 'bg-slate-100/70 text-slate-700 hover:text-kohBlue'
                    }`}
                  >
                    <FontAwesomeIcon icon={item.icon} className="mr-2" />
                    {item.label}
                  </a>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2 border-t border-slate-200/80 pt-2">
                {isAuthenticated ? (
                  <>
                    <button
                      type="button"
                      onClick={handleMobileLogout}
                      className="magnetic-btn rounded-full border border-slate-300/90 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-kohBlue hover:text-kohBlue"
                    >
                      <FontAwesomeIcon icon={faPowerOff} className="mr-2" />
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    to="/register"
                    state={{ fastLoad: true }}
                    onClick={closeMobileMenu}
                    className="magnetic-btn btn-pill btn-animated-border btn-shimmer fast-login-btn rounded-full border border-slate-300/90 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:border-kohBlue hover:text-kohBlue"
                  >
                    <FontAwesomeIcon icon={faRightToBracket} className="mr-2" />
                    Get Started
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar

import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBullseye, faHandHoldingHeart, faLightbulb, faRoute, faUsers } from '@fortawesome/free-solid-svg-icons'
import logo from '../assets/logo.png'

const missionPoints = [
  {
    title: 'Building bridges.',
    text: 'Connecting people to opportunities and linking communities with life-changing resources.',
  },
  {
    title: 'Creating opportunities.',
    text: 'Opening pathways through education, jobs, innovation, and skills training.',
  },
  {
    title: 'Transforming lives.',
    text: 'Delivering measurable impact that strengthens futures for youth and families.',
  },
]

function Hero() {
  return (
    <section
      id="home"
      className="section-anchor-offset pattern-overlay hero-sunset relative overflow-hidden border-b border-amber-900/15"
    >
      <div
        className="hero-orb hero-orb--warm pointer-events-none absolute -left-24 top-10 h-56 w-56 rounded-full bg-kohOrange/25 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="hero-orb hero-orb--cool pointer-events-none absolute -right-16 top-20 h-64 w-64 rounded-full bg-kohBlue/20 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="hero-orb hero-orb--base pointer-events-none absolute bottom-0 left-1/2 h-40 w-[34rem] -translate-x-1/2 bg-gradient-to-r from-transparent via-kohYellow/30 to-transparent blur-3xl"
        aria-hidden="true"
      />

      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-14 md:gap-10 md:px-6 md:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="hero-stagger">
          {/* Circular logo mark */}
          <div data-reveal className="mb-1 flex items-center gap-3">
            <div className="hero-logo-ring">
              <img
                src={logo}
                alt="Opportunity Bridge"
                loading="eager"
                decoding="async"
                className="hero-logo-img"
              />
            </div>
            <p className="inline-flex rounded-full border border-amber-700/30 bg-amber-100/85 px-4 py-1 text-xs font-bold uppercase tracking-[0.15em] text-kohBrown">
              <FontAwesomeIcon icon={faBullseye} className="mr-2" />
              Kakuma-inspired future
            </p>
          </div>

          <h2 data-reveal="text" className="max-w-3xl text-3xl font-extrabold leading-[1.05] text-kohText sm:text-4xl md:text-6xl">
            Building bridges. Creating opportunities. Transforming{' '}
            <span className="hero-highlight inline-block">lives.</span>
          </h2>
          <p id="about" data-reveal className="section-anchor-offset mt-5 max-w-2xl text-base font-medium text-slate-600 sm:text-lg md:text-xl">
            Opportunity Bridge connects young people, employers, NGOs, and communities to create
            <span className="font-semibold text-kohBrown"> dignity</span>,
            <span className="font-semibold text-kohBlue"> progress</span>, and practical pathways to
            <span className="font-semibold text-kohGreen"> opportunity</span>.
          </p>

          <div data-reveal className="mt-7 grid grid-cols-1 gap-3 sm:mt-8 sm:flex sm:flex-wrap">
            <Link
              to="/home#programs"
              className="magnetic-btn btn-pill btn-animated-border btn-shimmer inline-flex w-full items-center justify-center rounded-full bg-kohBlue px-6 py-3 text-center text-sm font-bold text-white shadow-koh transition hover:bg-blue-800 sm:w-auto"
            >
              Our Programs
            </Link>
            <Link
              to="/home#story"
              className="magnetic-btn btn-pill btn-animated-border btn-shimmer inline-flex w-full items-center justify-center rounded-full border border-kohOrange bg-kohOrange/95 px-6 py-3 text-center text-sm font-bold text-white shadow-koh transition hover:bg-kohOrange sm:w-auto"
            >
              Watch Our Story
            </Link>
            <Link
              to="/donate"
              className="magnetic-btn btn-pill btn-animated-border btn-shimmer inline-flex w-full items-center justify-center rounded-full border border-kohGreen bg-kohGreen px-6 py-3 text-center text-sm font-bold text-white shadow-koh transition hover:brightness-110 sm:w-auto"
            >
              Donate Now
            </Link>
            <Link
              to="/donate"
              className="magnetic-btn btn-pill btn-animated-border btn-shimmer inline-flex w-full items-center justify-center rounded-full border border-kohOrange bg-white/85 px-6 py-3 text-center text-sm font-bold text-kohOrange shadow-koh transition hover:bg-white sm:w-auto"
            >
              Support a Student
            </Link>
          </div>

          <div data-stagger className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {missionPoints.map((point) => (
              <article
                key={point.title}
                data-reveal
                className="project-card brand-card p-4 transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(75,46,26,0.22)]"
              >
                <h3 className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.08em] text-kohBrown">
                  <FontAwesomeIcon
                    icon={
                      point.title.includes('Building')
                        ? faUsers
                        : point.title.includes('Creating')
                          ? faLightbulb
                          : faRoute
                    }
                  />
                  {point.title}
                </h3>
                <p className="mt-2 text-sm text-slate-700">{point.text}</p>
              </article>
            ))}
          </div>
        </div>

        <div data-reveal className="relative mx-auto w-full max-w-md lg:mx-0">
          <div className="project-card brand-card hero-glass hero-panel-reveal p-6 md:p-7">
            <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-kohBlue">Community impact</p>
            <h3 className="mt-3 text-2xl font-extrabold leading-tight text-kohText">Skills. Employment. Entrepreneurship.</h3>
            <p className="mt-3 text-sm text-slate-700 md:text-base">
              <FontAwesomeIcon icon={faHandHoldingHeart} className="mr-2 text-kohOrange" />
              Empowering refugees and host communities with practical training, mentorship, and direct access to opportunities.
            </p>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-kohBlue/20 bg-white/70 p-3 text-center">
                <p className="text-2xl font-extrabold text-kohBlue">350+</p>
                <p className="text-xs font-semibold text-slate-600">Youth trained</p>
              </div>
              <div className="rounded-xl border border-kohGreen/20 bg-white/70 p-3 text-center">
                <p className="text-2xl font-extrabold text-kohGreen">120+</p>
                <p className="text-xs font-semibold text-slate-600">Jobs matched</p>
              </div>
              <div className="rounded-xl border border-kohOrange/25 bg-white/70 p-3 text-center">
                <p className="text-2xl font-extrabold text-kohOrange">40+</p>
                <p className="text-xs font-semibold text-slate-600">Partner NGOs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

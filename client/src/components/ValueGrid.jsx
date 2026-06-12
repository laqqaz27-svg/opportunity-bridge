import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookOpenReader, faShapes } from '@fortawesome/free-solid-svg-icons'

const valueCards = [
  {
    title: 'Education',
    text: 'Helping children and youth access quality learning through practical support and pathways.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 fill-kohBlue">
        <path d="M12 3 1 8l11 5 9-4.09V16h2V8L12 3Zm-7 8.18V16c0 2.76 3.13 5 7 5s7-2.24 7-5v-4.82l-7 3.18-7-3.18Z" />
      </svg>
    ),
  },
  {
    title: 'Skills Development',
    text: 'Training young people in practical and digital skills to strengthen employment readiness.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 fill-kohOrange">
        <path d="M22 7.24a1 1 0 0 0-1.18-.79l-6.2 1.24L11.7 4.8l1.24-1.24a1 1 0 0 0-1.42-1.42L10.3 3.36 8.6 1.66A2 2 0 1 0 5.76 4.5l1.7 1.7-6.3 6.3a1 1 0 0 0 0 1.41l2.83 2.83a1 1 0 0 0 1.41 0l6.3-6.3 1.7 1.7-1.22 1.22a1 1 0 0 0 1.41 1.42l1.23-1.23 2.9 2.9-1.25 6.22a1 1 0 0 0 .79 1.18.98.98 0 0 0 .2.02 1 1 0 0 0 .98-.8l1.33-6.65a1 1 0 0 0-.27-.9l-3.25-3.25 1.95-1.95 6.2-1.24A1 1 0 0 0 22 7.24Z" />
      </svg>
    ),
  },
  {
    title: 'Innovation',
    text: 'Encouraging local ideas and technology-enabled solutions that solve real community problems.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 fill-kohYellow">
        <path d="M9 21h6v-1H9v1Zm3-19a7 7 0 0 0-4.95 11.95c.67.66 1.33 1.64 1.58 2.55h6.74c.25-.91.91-1.89 1.58-2.55A7 7 0 0 0 12 2Zm2.43 10.57c-.8.8-1.45 1.74-1.85 2.72h-1.16c-.4-.98-1.05-1.92-1.85-2.72A5 5 0 1 1 17 9a4.97 4.97 0 0 1-2.57 3.57Z" />
      </svg>
    ),
  },
  {
    title: 'Community Support',
    text: 'Strengthening families and neighborhoods through partnerships, mentorship, and opportunity access.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 fill-kohGreen">
        <path d="M16 11c1.66 0 3-1.57 3-3.5S17.66 4 16 4s-3 1.57-3 3.5 1.34 3.5 3 3.5ZM8 11c1.66 0 3-1.57 3-3.5S9.66 4 8 4 5 5.57 5 7.5 6.34 11 8 11Zm0 2c-2.33 0-7 1.17-7 3.5V20h14v-3.5C15 14.17 10.33 13 8 13Zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.95 1.97 3.45V20h6v-3.5c0-2.33-4.67-3.5-7-3.5Z" />
      </svg>
    ),
  },
]

const featureIcons = [
  {
    label: 'Graduation Cap',
    meaning: 'Education programs',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
        <path d="M12 3 1 8l11 5 9-4.09V16h2V8L12 3Zm-7 8.18V16c0 2.76 3.13 5 7 5s7-2.24 7-5v-4.82l-7 3.18-7-3.18Z" />
      </svg>
    ),
  },
  {
    label: 'Book',
    meaning: 'Learning resources',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
        <path d="M4 4a2 2 0 0 0-2 2v11a3 3 0 0 0 3 3h14v-2H5a1 1 0 0 1 0-2h14V4H4Zm12 10H5c-.36 0-.7.06-1 .17V6h12v8Z" />
      </svg>
    ),
  },
  {
    label: 'Laptop',
    meaning: 'Digital skills and technology',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
        <path d="M4 5a2 2 0 0 0-2 2v9h20V7a2 2 0 0 0-2-2H4Zm0 13h16l2 2H2l2-2Z" />
      </svg>
    ),
  },
  {
    label: 'Group',
    meaning: 'Community support',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
        <path d="M16 11c1.66 0 3-1.57 3-3.5S17.66 4 16 4s-3 1.57-3 3.5 1.34 3.5 3 3.5ZM8 11c1.66 0 3-1.57 3-3.5S9.66 4 8 4 5 5.57 5 7.5 6.34 11 8 11Zm0 2c-2.33 0-7 1.17-7 3.5V20h14v-3.5C15 14.17 10.33 13 8 13Zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.95 1.97 3.45V20h6v-3.5c0-2.33-4.67-3.5-7-3.5Z" />
      </svg>
    ),
  },
  {
    label: 'Heart and Leaf',
    meaning: 'Hope and care',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
        <path d="M12 21s-8-4.35-8-10a4.5 4.5 0 0 1 8-2.83A4.5 4.5 0 0 1 20 11c0 5.65-8 10-8 10Zm3-8c1.66 0 3-1.57 3-3.5h-1.5c0 1.3-.76 2.45-1.9 2.97L15 13Z" />
      </svg>
    ),
  },
  {
    label: 'Light Bulb',
    meaning: 'Innovation and ideas',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
        <path d="M9 21h6v-1H9v1Zm3-19a7 7 0 0 0-4.95 11.95c.67.66 1.33 1.64 1.58 2.55h6.74c.25-.91.91-1.89 1.58-2.55A7 7 0 0 0 12 2Z" />
      </svg>
    ),
  },
  {
    label: 'Graph',
    meaning: 'Growth and progress',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
        <path d="M3 3v18h18v-2H5V3H3Zm13 4-4 4-3-3-4 4 1.4 1.4L9 10.8l3 3 5.4-5.4L16 7Z" />
      </svg>
    ),
  },
  {
    label: 'Handshake',
    meaning: 'Partnerships',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
        <path d="m11.4 12.6 1.2-1.2 2.1 2.1a1.5 1.5 0 1 0 2.1-2.1l-3.2-3.2a4 4 0 0 0-5.66 0L6 10.1a2 2 0 0 1-2.83 0L1 8l3-3 2.1 2.1a2 2 0 0 0 2.83 0l1.6-1.6a4 4 0 0 1 5.66 0L23 12.2l-2.2 2.2a2 2 0 0 1-2.83 0L14.8 11.2l-1.2 1.2 1.9 1.9a1.5 1.5 0 1 1-2.1 2.1l-2-1.9-2 2a1.5 1.5 0 0 1-2.1-2.1l1.9-1.8-1.5-1.5 1.4-1.4 3.3 3.3Z" />
      </svg>
    ),
  },
]

function ValueGrid() {
  return (
    <section id="programs" className="section-anchor-offset mx-auto w-full max-w-6xl px-4 py-16 md:px-6 md:py-20">
      <div data-reveal className="section-shell section-shell--warm p-6 md:p-9">
        <div className="text-center">
          <p data-reveal="text" className="section-eyebrow">
            <FontAwesomeIcon icon={faShapes} className="mr-2" />
            What We Do
          </p>
          <h3 data-reveal="text" className="section-title mt-3 text-center">From Learning To Livelihood</h3>
          <p className="section-subtitle">
            Opportunity Bridge delivers education, skills development, innovation pathways, and community support.
          </p>
        </div>

        <div data-stagger className="mt-10 grid gap-4 sm:grid-cols-2">
          {valueCards.map((card) => (
            <article
              key={card.title}
              data-reveal
              className="project-card group brand-card relative overflow-hidden border border-slate-100/80 p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_45px_rgba(75,46,26,0.2)]"
            >
              <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-kohOrange/80 via-kohYellow/80 to-kohBlue/70" />
              <div className="inline-flex rounded-full border border-amber-900/20 bg-kohWhite p-3 transition group-hover:scale-105">{card.icon}</div>
              <h4 className="mt-4 text-xl font-extrabold text-kohText">{card.title}</h4>
              <p className="mt-3 text-slate-600">{card.text}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-kohBlue/18 bg-white/50 p-5 md:p-6">
          <h4 className="text-center text-2xl font-extrabold text-kohBrown">
            <FontAwesomeIcon icon={faBookOpenReader} className="mr-2" />
            Feature Icons
          </h4>
          <p className="section-subtitle mt-2">Every icon communicates one core part of your mission.</p>
          <div data-stagger className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featureIcons.map((item) => (
              <article
                key={item.label}
                data-reveal
                className="project-card brand-card border border-slate-100/80 bg-white/80 p-5 transition duration-300 hover:-translate-y-1"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-kohBlue text-white shadow-lg shadow-kohBlue/25">
                  {item.icon}
                </div>
                <h5 className="mt-3 text-base font-extrabold text-kohText">{item.label}</h5>
                <p className="mt-1 text-sm text-slate-600">{item.meaning}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ValueGrid

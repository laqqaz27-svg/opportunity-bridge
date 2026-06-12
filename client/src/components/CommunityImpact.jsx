import ngoPartnershipsPhoto from '../assets/NGO Partnerships.jfif'
import refugeeEntrepreneursPhoto from '../assets/Refugee Entrepreneurs.jfif'
import studentAtWorkPhoto from '../assets/student at work.jfif'
import trainingProgramPhoto from '../assets/training program.jfif'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAddressBook, faHandshake, faImages } from '@fortawesome/free-solid-svg-icons'
import {
  SUPPORT_EMAIL,
  SUPPORT_PHONE,
  SUPPORT_PHONE_ALT,
  SUPPORT_PHONE_ALT_TEL,
  SUPPORT_PHONE_TEL,
} from '../config/support'

const impactItems = [
  {
    title: 'Youth at Work',
    text: 'Highlight stories of young professionals applying skills in meaningful jobs.',
    image: studentAtWorkPhoto,
  },
  {
    title: 'Training Programs',
    text: 'Show learning sessions, technical workshops, and vocational growth pathways.',
    image: trainingProgramPhoto,
  },
  {
    title: 'Refugee Entrepreneurs',
    text: 'Celebrate community businesses and social enterprises creating local value.',
    image: refugeeEntrepreneursPhoto,
  },
  {
    title: 'NGO Partnerships',
    text: 'Showcase organizations supporting families through employment and training.',
    image: ngoPartnershipsPhoto,
  },
]

function CommunityImpact() {
  return (
    <section id="contact" className="section-anchor-offset mx-auto w-full max-w-6xl px-4 py-16 md:px-6 md:py-20">
      <div data-reveal className="section-shell p-6 md:p-9">
        <div className="text-center">
          <p data-reveal="text" className="section-eyebrow">
            <FontAwesomeIcon icon={faImages} className="mr-2" />
            On The Ground
          </p>
          <h3 data-reveal="text" className="section-title mt-3 text-center">Community Impact Gallery</h3>
          <p className="section-subtitle">
            Authentic community imagery builds trust, emotional connection, and local identity.
          </p>
        </div>

        <div data-stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {impactItems.map((item) => (
            <article
              key={item.title}
              data-reveal
              className="project-card brand-card group overflow-hidden border border-slate-100/80 bg-white/85"
            >
              <div className="img-aspect img-aspect--video">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  className="img-zoom"
                />
              </div>
              <div className="p-4">
                <h4 className="text-base font-extrabold text-kohText">{item.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.text}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-4 rounded-2xl border border-kohBlue/30 bg-gradient-to-r from-kohBlue/10 via-white/60 to-kohGreen/10 p-6 md:grid-cols-[1.3fr_0.7fr] md:items-center">
          <div>
            <h4 className="text-xl font-extrabold text-kohBlue">
              <FontAwesomeIcon icon={faAddressBook} className="mr-2" />
              Contact Opportunity Bridge
            </h4>
            <p className="mt-2 text-slate-700">
              Reach out to collaborate on education, skills, innovation, and community programs.
            </p>
            <p className="mt-3 text-sm font-bold text-kohBrown">Email: {SUPPORT_EMAIL}</p>
            <p className="mt-1 text-sm font-bold text-kohBrown">
              Phone:{' '}
              <a href={`tel:${SUPPORT_PHONE_TEL}`} className="hover:underline">
                {SUPPORT_PHONE}
              </a>
            </p>
            <p className="mt-1 text-sm font-bold text-kohBrown">
              Alternate:{' '}
              <a href={`tel:${SUPPORT_PHONE_ALT_TEL}`} className="hover:underline">
                {SUPPORT_PHONE_ALT}
              </a>
            </p>
          </div>
          <div className="flex justify-start md:justify-end">
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="magnetic-btn btn-pill btn-animated-border btn-shimmer inline-flex items-center justify-center rounded-full bg-kohBlue px-6 py-3 text-sm font-bold text-white shadow-koh transition hover:bg-blue-800"
            >
              <FontAwesomeIcon icon={faHandshake} className="mr-2" />
              Start a Partnership
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CommunityImpact

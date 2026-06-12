import aminaPhoto from '../assets/amina.jfif'
import danielPhoto from '../assets/daniel.jfif'
import sarahPhoto from '../assets/sarah.jfif'

const stories = [
  {
    name: 'Sarah',
    role: 'Tailoring Graduate',
    quote: 'I found my first tailoring job through Kakuma Opportunity Hub and now I support my family every month.',
    image: sarahPhoto,
  },
  {
    name: 'Daniel',
    role: 'Youth Developer',
    quote: 'KOH connected me to a coding bootcamp and an internship that became my first paid role.',
    image: danielPhoto,
  },
  {
    name: 'Amina',
    role: 'Community Entrepreneur',
    quote: 'Through one listing, I got access to business mentorship and a grant to expand my small shop.',
    image: aminaPhoto,
  },
]

function SuccessStories() {
  return (
    <section id="get-involved" className="section-anchor-offset bg-transparent py-16">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div data-reveal className="section-shell section-shell--cool p-6 md:p-9">
          <div className="text-center">
            <p data-reveal="text" className="section-eyebrow">Voices Of Progress</p>
            <h3 data-reveal="text" className="section-title mt-3 text-center">Success Stories</h3>
            <p className="section-subtitle font-medium text-kohText">
              Real people, real progress, and practical outcomes from opportunities shared across Kakuma.
            </p>
          </div>

          <div data-stagger className="mt-10 grid gap-5 md:grid-cols-3">
            {stories.map((story) => (
              <article
                key={story.name}
                data-reveal
                className="project-card brand-card group overflow-hidden border border-slate-100/80 bg-white/85"
              >
                <div className="relative bg-kohWhite/80">
                  <div className="absolute inset-x-0 top-0 z-10 h-1.5 bg-gradient-to-r from-kohBlue/75 via-kohGreen/70 to-kohOrange/70" />
                  <div className="img-aspect img-aspect--portrait">
                    <img
                      src={story.image}
                      alt={story.name}
                      loading="lazy"
                      decoding="async"
                      className="img-zoom object-contain"
                    />
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm font-medium leading-relaxed text-slate-800">"{story.quote}"</p>
                  <p className="mt-5 text-base font-extrabold text-kohText">{story.name}</p>
                  <p className="text-sm font-semibold text-kohBlue">{story.role}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-kohOrange/30 bg-gradient-to-r from-kohOrange/10 via-kohYellow/10 to-kohBlue/10 p-5 text-center md:p-6">
            <p className="text-sm font-bold uppercase tracking-[0.08em] text-kohBrown">Get Involved</p>
            <p className="mt-2 font-medium text-kohText">
              Join as a volunteer, donor, mentor, NGO partner, or employer and help transform the next life story.
            </p>
            <p className="mt-3 text-sm font-semibold text-kohBlue">Your support powers the next success story.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SuccessStories

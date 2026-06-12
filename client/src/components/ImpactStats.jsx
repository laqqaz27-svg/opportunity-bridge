const stats = [
  { value: '12,500+', label: 'Lives Impacted', note: 'Through training, jobs, and mentorship support.' },
  { value: '4,200+', label: 'Youth Trained', note: 'Practical and digital skills for employment readiness.' },
  { value: '180+', label: 'Learning Centers and Partners', note: 'Schools, NGOs, and local institutions collaborating.' },
  { value: '72%', label: 'Program-to-Work Transition', note: 'Participants moving from learning into income pathways.' },
]

function ImpactStats() {
  return (
    <section id="impact" className="section-anchor-offset bg-transparent py-16">
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        <div data-reveal className="section-shell p-6 md:p-9">
          <div className="text-center">
            <p data-reveal="text" className="section-eyebrow">Impact Dashboard</p>
            <h3 data-reveal="text" className="section-title mt-3 text-center">Impact Statistics</h3>
            <p className="section-subtitle font-medium text-kohText">
              Real numbers build trust with donors, NGOs, investors, volunteers, and community members.
            </p>
          </div>

          <div data-stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <article
                key={stat.label}
                data-reveal
                className="stat-tile brand-card border border-amber-900/15 p-6"
              >
                <p className="text-3xl font-extrabold text-kohBlue">{stat.value}</p>
                <h4 className="mt-2 text-lg font-extrabold text-kohText">{stat.label}</h4>
                <p className="mt-2 text-sm font-medium leading-relaxed text-slate-800">{stat.note}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ImpactStats

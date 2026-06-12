import { useMemo } from 'react'

function OpportunityCard({ opportunity, canApply = false, onApply }) {
  const deadlineLabel = useMemo(() => {
    if (!opportunity.deadline) {
      return 'Open deadline'
    }

    const date = new Date(opportunity.deadline)
    if (Number.isNaN(date.getTime())) {
      return 'Open deadline'
    }

    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }, [opportunity.deadline])

  const urgencyClass = useMemo(() => {
    if (!opportunity.deadline) {
      return 'text-kohGreen'
    }

    const date = new Date(opportunity.deadline)
    const now = new Date()
    const days = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (days <= 7) {
      return 'text-kohOrange'
    }

    return 'text-kohGreen'
  }, [opportunity.deadline])

  const categoryColors = {
    jobs: 'bg-kohGreen/15 text-kohGreen',
    scholarships: 'bg-kohBlue/15 text-kohBlue',
    courses: 'bg-kohBlue/15 text-kohBlue',
    volunteering: 'bg-kohOrange/15 text-kohOrange',
    innovation: 'bg-violet-100 text-violet-700',
    mentorship: 'bg-indigo-100 text-indigo-700',
    ngos: 'bg-kohGreen/15 text-kohGreen',
    'remote-work': 'bg-sky-100 text-sky-700',
  }

  const categoryClass = categoryColors[opportunity.category] || 'bg-slate-100 text-slate-700'

  return (
    <article className="brand-card overflow-hidden border border-slate-200">
      <div className="relative h-36 w-full">
        <img
          src={opportunity.opportunityImage || '/favicon.svg'}
          alt={opportunity.title}
          className="h-full w-full object-cover"
        />
        <span className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold uppercase ${categoryClass}`}>
          {opportunity.category || 'jobs'}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-3">
          <img
            src={opportunity.organizationLogo || '/favicon.svg'}
            alt={`${opportunity.organization} logo`}
            className="h-10 w-10 rounded-full border border-slate-200 bg-white object-contain p-1"
          />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.07em] text-slate-500">Organization</p>
            <p className="text-sm font-bold text-kohText">{opportunity.organization}</p>
          </div>
        </div>

        <h3 className="mt-4 text-xl font-extrabold text-kohText">{opportunity.title}</h3>
        <p className="mt-2 line-clamp-3 text-sm text-slate-700">{opportunity.description}</p>

        <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
          <span className="rounded-full bg-slate-100 px-3 py-1">{opportunity.location || 'Kakuma'}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">{opportunity.mode || 'offline'}</span>
          <span className="rounded-full bg-slate-100 px-3 py-1">{opportunity.skillLevel || 'all levels'}</span>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <p className={`text-sm font-bold ${urgencyClass}`}>Deadline: {deadlineLabel}</p>
          {canApply && (
            <button
              type="button"
              onClick={() => onApply(opportunity._id)}
              className="rounded-full bg-kohOrange px-4 py-2 text-xs font-bold uppercase tracking-[0.05em] text-white transition hover:bg-amber-600"
            >
              Apply
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

export default OpportunityCard

import { useEffect, useMemo, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBullseye, faDonate, faGift, faHandshake, faHeart, faWallet } from '@fortawesome/free-solid-svg-icons'
import api from '../services/api'
import ngoPartnershipsPhoto from '../assets/NGO Partnerships.jfif'
import mpesaQrImage from '../assets/opportunity_bridge_mpesa_qr.png'
import studentAtWorkPhoto from '../assets/student at work.jfif'
import trainingProgramPhoto from '../assets/training program.jfif'

const impactOptions = [
  { amount: 5, impact: 'Internet access for 1 student' },
  { amount: 15, impact: 'Learning materials' },
  { amount: 30, impact: 'Digital skills training' },
  { amount: 50, impact: 'Sponsor a youth program' },
  { amount: 100, impact: 'Support community innovation' },
]

const sponsorPrograms = [
  'Sponsor a student',
  'Sponsor a computer lab',
  'Sponsor internet access',
  'Sponsor coding bootcamp',
  'Sponsor women empowerment',
]

const testimonials = [
  {
    name: 'Amina',
    story: 'After receiving digital training support, I started freelancing and now pay school fees for my siblings.',
    image: studentAtWorkPhoto,
  },
  {
    name: 'Daniel',
    story: 'A sponsored coding scholarship helped me secure my first tech internship in six months.',
    image: trainingProgramPhoto,
  },
  {
    name: 'Mariam Family',
    story: 'Community support programs gave our family stable learning and internet access for our children.',
    image: ngoPartnershipsPhoto,
  },
]

function DonatePage() {
  const [amount, setAmount] = useState(30)
  const [frequency, setFrequency] = useState('one-time')
  const [paymentMethod, setPaymentMethod] = useState('M-Pesa')
  const [message, setMessage] = useState('')
  const [donorName, setDonorName] = useState('')
  const [donorEmail, setDonorEmail] = useState('')
  const [donorPhone, setDonorPhone] = useState('')
  const [sponsorProgram, setSponsorProgram] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [loadingCheckout, setLoadingCheckout] = useState(false)
  const [paymentDetails, setPaymentDetails] = useState(null)

  const [raised, setRaised] = useState(7200)
  const [goal, setGoal] = useState(10000)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const { data } = await api.get('/donations/stats')
        if (typeof data.totalRaised === 'number') {
          setRaised(data.totalRaised)
        }
        if (typeof data.goal === 'number' && data.goal > 0) {
          setGoal(data.goal)
        }
      } catch (error) {
        // Keep graceful fallback values if backend stats are unavailable.
      }
    }

    loadStats()
  }, [])

  const progress = useMemo(() => Math.min(Math.round((raised / goal) * 100), 100), [raised, goal])

  const handleDonateSubmit = async (event) => {
    event.preventDefault()
    setLoadingCheckout(true)
    setStatusMessage('')
    setErrorMessage('')
    setPaymentDetails(null)

    try {
      const { data } = await api.post('/donations/checkout', {
        amount,
        currency: 'USD',
        paymentMethod,
        frequency,
        sponsorProgram,
        message,
        donorName,
        donorEmail,
        donorPhone,
      })

      setStatusMessage(data.message || 'Donation checkout initialized.')
      setPaymentDetails(data.payment || null)
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Unable to initialize donation checkout right now.')
    } finally {
      setLoadingCheckout(false)
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6">
      <section className="brand-card grid overflow-hidden border border-amber-900/20 md:grid-cols-[1.05fr_0.95fr]">
        <div className="relative min-h-[22rem]">
          <img src={studentAtWorkPhoto} alt="Young people learning coding together" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-amber-900/60 via-amber-900/20 to-transparent p-6 md:p-8">
            <p className="inline-flex rounded-full bg-kohOrange px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-white">
              Together we can create opportunities
            </p>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-white md:text-4xl">
              Help Build Futures Through Education, Skills, and Innovation.
            </h1>
            <p className="mt-3 max-w-md text-sm text-white/90 md:text-base">
              Your support powers student learning, youth coding pathways, and family-centered community programs.
            </p>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-extrabold text-kohText">Make a Donation</h2>
          <p className="mt-2 text-sm text-slate-600">Choose an amount, payment method, and dedication message.</p>

          <div className="mt-5 grid gap-2 sm:grid-cols-3">
            {impactOptions.map((option) => (
              <button
                key={option.amount}
                type="button"
                onClick={() => setAmount(option.amount)}
                className={`rounded-xl border px-3 py-2 text-left transition ${
                  amount === option.amount
                    ? 'border-kohBlue bg-kohBlue/10 text-kohBlue'
                    : 'border-slate-300 bg-white/80 text-slate-700 hover:border-kohBlue'
                }`}
              >
                <p className="text-base font-extrabold">${option.amount}</p>
                <p className="text-xs">{option.impact}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleDonateSubmit} className="mt-5 space-y-3">
            <input
              type="number"
              min="1"
              value={amount}
              onChange={(event) => setAmount(Number(event.target.value) || 1)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-kohBlue transition focus:ring-2"
              placeholder="Custom amount"
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={donorName}
                onChange={(event) => setDonorName(event.target.value)}
                placeholder="Your name"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-kohBlue transition focus:ring-2"
              />
              <input
                type="email"
                value={donorEmail}
                onChange={(event) => setDonorEmail(event.target.value)}
                placeholder="Your email"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-kohBlue transition focus:ring-2"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={donorPhone}
                onChange={(event) => setDonorPhone(event.target.value)}
                placeholder="Phone (required for M-Pesa)"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-kohBlue transition focus:ring-2"
              />
              <select
                value={sponsorProgram}
                onChange={(event) => setSponsorProgram(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-kohBlue transition focus:ring-2"
              >
                <option value="">General support</option>
                {sponsorPrograms.map((program) => (
                  <option key={program} value={program}>
                    {program}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <select
                value={frequency}
                onChange={(event) => setFrequency(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-kohBlue transition focus:ring-2"
              >
                <option value="one-time">One-time donation</option>
                <option value="monthly">Monthly donation</option>
              </select>
              <select
                value={paymentMethod}
                onChange={(event) => setPaymentMethod(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-kohBlue transition focus:ring-2"
              >
                <option>M-Pesa</option>
                <option>Visa/Mastercard</option>
                <option>PayPal</option>
                <option>Stripe</option>
              </select>
            </div>

            <textarea
              rows={3}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Leave a message of encouragement (optional)"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none ring-kohBlue transition focus:ring-2"
            />

            <button
              type="submit"
              disabled={loadingCheckout}
              className="w-full rounded-full bg-kohOrange px-5 py-3 text-sm font-bold uppercase tracking-[0.06em] text-white transition hover:bg-amber-600 disabled:opacity-60"
            >
              <FontAwesomeIcon icon={faDonate} className="mr-2" />
              {loadingCheckout ? 'Initializing Payment...' : 'Donate Now'}
            </button>

            {statusMessage && <p className="text-sm font-semibold text-emerald-700">{statusMessage}</p>}
            {errorMessage && <p className="text-sm font-semibold text-red-600">{errorMessage}</p>}
            {paymentDetails?.message && (
              <p className="text-sm text-slate-700">{paymentDetails.message}</p>
            )}
            {paymentDetails?.checkoutUrl && (
              <a
                href={paymentDetails.checkoutUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-full border border-kohBlue px-4 py-2 text-sm font-bold text-kohBlue"
              >
                Continue to PayPal
              </a>
            )}
            {paymentDetails?.clientSecret && (
              <p className="rounded-lg border border-kohBlue/30 bg-kohBlue/10 p-3 text-xs text-kohBlue">
                Stripe payment intent created. Client secret: {paymentDetails.clientSecret}
              </p>
            )}

            {(paymentMethod === 'M-Pesa' || paymentDetails?.mode === 'mpesa') && (
              <div className="rounded-2xl border border-kohGreen/30 bg-kohGreen/10 p-4">
                <p className="text-sm font-extrabold uppercase tracking-[0.08em] text-kohGreen">M-Pesa QR Donation</p>
                <p className="mt-1 text-xs text-slate-700">Scan the QR code below to complete your donation quickly.</p>
                <img
                  src={mpesaQrImage}
                  alt="M-Pesa donation QR code"
                  className="mt-3 h-52 w-52 rounded-xl border border-slate-200 bg-white object-contain p-2"
                />
                <p className="mt-2 text-xs text-slate-600">If the QR does not appear, add your image as client/public/mpesa-qr.png</p>
              </div>
            )}
          </form>
        </div>
      </section>

      <section className="mt-12 grid gap-5 md:grid-cols-2">
        <article className="brand-card border border-slate-100 p-6">
          <h3 className="text-xl font-extrabold text-kohBrown">
            <FontAwesomeIcon icon={faWallet} className="mr-2" />
            Where Your Money Goes
          </h3>
          <div className="mt-4 space-y-3 text-sm font-semibold text-slate-700">
            <p>40% Education</p>
            <p>30% Skills Training</p>
            <p>20% Technology Access</p>
            <p>10% Operations</p>
          </div>
        </article>

        <article className="brand-card border border-slate-100 p-6">
          <h3 className="text-xl font-extrabold text-kohBrown">
            <FontAwesomeIcon icon={faBullseye} className="mr-2" />
            Goal: Build a Learning Center
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            ${raised.toLocaleString()} raised of ${goal.toLocaleString()}
          </p>
          <div className="mt-4 h-4 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-kohGreen" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.08em] text-kohGreen">{progress}% completed</p>
        </article>
      </section>

      <section className="mt-12">
        <h3 className="text-2xl font-extrabold text-kohBrown">
          <FontAwesomeIcon icon={faHandshake} className="mr-2" />
          Sponsor Programs
        </h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sponsorPrograms.map((program) => (
            <article key={program} className="brand-card border border-slate-100 p-5">
              <p className="text-lg font-extrabold text-kohText">{program}</p>
              <button type="button" className="mt-3 rounded-full bg-kohBlue px-4 py-2 text-xs font-bold text-white">
                <FontAwesomeIcon icon={faGift} className="mr-2" />
                Sponsor This Program
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h3 className="text-2xl font-extrabold text-kohBrown">
          <FontAwesomeIcon icon={faHeart} className="mr-2" />
          Stories & Testimonials
        </h3>
        <p className="mt-2 text-slate-600">Real stories from students, youth, and families transformed by opportunity.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {testimonials.map((item) => (
            <article key={item.name} className="brand-card overflow-hidden border border-slate-100">
              <img src={item.image} alt={item.name} className="h-40 w-full object-cover" />
              <div className="p-5">
                <p className="text-sm text-slate-700">"{item.story}"</p>
                <p className="mt-3 text-sm font-extrabold text-kohBlue">{item.name}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12 brand-card border border-slate-100 p-6">
        <h3 className="text-xl font-extrabold text-kohBrown">Supported Payment Methods</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {['M-Pesa', 'Visa/Mastercard', 'PayPal', 'Stripe'].map((method) => (
            <span key={method} className="rounded-full border border-slate-300 bg-white/80 px-3 py-1 text-sm font-semibold text-slate-700">
              {method}
            </span>
          ))}
        </div>
      </section>
    </main>
  )
}

export default DonatePage

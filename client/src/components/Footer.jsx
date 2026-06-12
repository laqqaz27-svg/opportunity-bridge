import { Link } from 'react-router-dom'
import {
  SUPPORT_EMAIL,
  SUPPORT_PHONE,
  SUPPORT_PHONE_ALT,
  SUPPORT_PHONE_ALT_TEL,
  SUPPORT_PHONE_TEL,
} from '../config/support'

const paymentMethods = ['M-Pesa', 'Visa/Mastercard', 'PayPal', 'Stripe']

function Footer() {
  return (
    <footer id="footer-donate" className="mt-16 border-t border-amber-900/20 px-4 pb-6 pt-10 md:px-6">
      <div className="footer-shell mx-auto w-full max-w-6xl rounded-3xl p-6 md:p-9">
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.9fr_0.9fr]">
          <div>
            <p className="section-eyebrow">Support The Mission</p>
            <h3 className="mt-3 text-2xl font-extrabold text-kohBrown">Opportunity Bridge</h3>
            <p className="mt-3 max-w-md text-sm text-slate-700">
              Together we can create opportunities for learners, families, and innovators across Kakuma.
            </p>
            <Link
              to="/donate"
              className="magnetic-btn btn-pill btn-animated-border btn-shimmer mt-5 inline-flex rounded-full bg-gradient-to-r from-kohOrange to-amber-500 px-5 py-2.5 text-sm font-bold text-white shadow-koh transition hover:brightness-105"
            >
              Donate Now
            </Link>
          </div>

          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-[0.08em] text-kohBlue">Donation Links</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>
                <Link to="/donate" className="transition hover:text-kohBlue">
                  Sponsor a Student
                </Link>
              </li>
              <li>
                <Link to="/donate" className="transition hover:text-kohBlue">
                  Sponsor a Coding Bootcamp
                </Link>
              </li>
              <li>
                <Link to="/donate" className="transition hover:text-kohBlue">
                  Support Women Empowerment
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-extrabold uppercase tracking-[0.08em] text-kohBlue">Transparency & Payments</h4>
            <p className="mt-3 text-sm text-slate-700">
              40% Education, 30% Skills Training, 20% Technology Access, 10% Operations.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {paymentMethods.map((method) => (
                <span
                  key={method}
                  className="rounded-full border border-slate-300/90 bg-white/75 px-3 py-1 text-xs font-semibold text-slate-700"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-amber-900/15 pt-4 text-xs font-medium text-slate-600">
          Built for dignity, inclusion, and measurable opportunity.
          <span className="ml-1">
            Support:{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="font-semibold text-kohBlue hover:underline">
              {SUPPORT_EMAIL}
            </a>
            {' | '}
            <a href={`tel:${SUPPORT_PHONE_TEL}`} className="font-semibold text-kohBlue hover:underline">
              {SUPPORT_PHONE}
            </a>
            {' | '}
            <a href={`tel:${SUPPORT_PHONE_ALT_TEL}`} className="font-semibold text-kohBlue hover:underline">
              {SUPPORT_PHONE_ALT}
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer

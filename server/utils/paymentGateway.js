const Stripe = require('stripe')

const getStripeClient = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    return null
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY)
}

const createStripeIntent = async ({ donationId, amount, currency, donorEmail, description }) => {
  const stripe = getStripeClient()
  if (!stripe) {
    return {
      mode: 'manual',
      message: 'Stripe is not configured yet. Add STRIPE_SECRET_KEY to enable card payments.',
    }
  }

  const intent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: currency.toLowerCase(),
    receipt_email: donorEmail || undefined,
    description,
    metadata: {
      donationId: String(donationId),
    },
    automatic_payment_methods: {
      enabled: true,
    },
  })

  return {
    mode: 'stripe',
    reference: intent.id,
    clientSecret: intent.client_secret,
    status: intent.status,
  }
}

const createMpesaInstruction = ({ amount }) => {
  const business = process.env.MPESA_BUSINESS_SHORTCODE || 'Not configured'
  return {
    mode: 'mpesa',
    message: `Use M-Pesa PayBill ${business} and enter amount ${amount}.`,
  }
}

const createPaypalInstruction = () => {
  const paypalUrl = process.env.PAYPAL_DONATE_URL || ''
  return {
    mode: 'paypal',
    checkoutUrl: paypalUrl,
    message: paypalUrl
      ? 'Continue to PayPal using the provided checkout link.'
      : 'Set PAYPAL_DONATE_URL to enable direct PayPal redirect.',
  }
}

const createPaymentSession = async ({ donationId, amount, currency, paymentMethod, donorEmail }) => {
  if (paymentMethod === 'Stripe' || paymentMethod === 'Visa/Mastercard') {
    return createStripeIntent({
      donationId,
      amount,
      currency,
      donorEmail,
      description: 'Opportunity Bridge donation',
    })
  }

  if (paymentMethod === 'PayPal') {
    return createPaypalInstruction()
  }

  return createMpesaInstruction({ amount })
}

module.exports = {
  createPaymentSession,
}

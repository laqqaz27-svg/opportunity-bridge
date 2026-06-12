# Opportunity Bridge

Opportunity Bridge is a full-stack platform that connects job seekers, employers, training opportunities, and community support in one place. The project includes a React client and an Express/MongoDB API for authentication, opportunities, applications, and donations.

## Live Application

 Frontend https://opportunity-bridge-1.onrender.com
 Backend https://opportunity-bridge.onrender.com
 

## Core Features

- User registration, login, email verification, and password recovery
- Role-based access for users, employers, and admins
- Opportunity feed for jobs and training programs
- Employer workflow for posting opportunities
- Protected dashboards and profile management
- Donation support flow through the backend donation API

## Tech Stack

### Client

- React 19
- Vite
- React Router
- Axios
- Firebase
- Tailwind CSS

### Server

- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication
- Nodemailer
- Cloudinary
- Stripe

## Project Structure

```text
Opportunity Bridge/
|-- client/
|   |-- src/
|   |-- public/
|   `-- package.json
|-- server/
|   |-- config/
|   |-- controllers/
|   |-- middleware/
|   |-- models/
|   |-- routes/
|   |-- utils/
|   `-- package.json
`-- README.md
```

## Local Development

### 1. Install dependencies

```bash
cd client
npm install
```

```bash
cd server
npm install
```

### 2. Configure environment variables

Create a `.env` file in `server/` with the required backend values:

```env
MONGO_URI=
JWT_SECRET=
CLIENT_ORIGIN=http://localhost:5173
PORT=5000

# Optional integrations
GOOGLE_CLIENT_ID=
SUPPORT_EMAIL=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
SMTP_SECURE=false
EMAIL_FROM=
EMAIL_SENDER_NAME=Opportunity Bridge
REPLY_TO_EMAIL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
STRIPE_SECRET_KEY=
PAYPAL_DONATE_URL=
MPESA_BUSINESS_SHORTCODE=
DONATION_GOAL=10000
```

Create a `.env` file in `client/` for frontend runtime values:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=
VITE_SUPPORT_EMAIL=support@opportunitybridge.org
VITE_SUPPORT_PHONE=+254790363465
VITE_SUPPORT_PHONE_ALT=+254787075475
```

### 3. Start the app

Run the API:

```bash
cd server
npm run dev
```

Run the client:

```bash
cd client
npm run dev
```

The client runs on `http://localhost:5173` by default and connects to the backend through `VITE_API_BASE_URL`.

## Available Scripts

### Client

- `npm run dev` starts the Vite dev server
- `npm run build` creates a production build
- `npm run preview` previews the production build locally
- `npm run lint` runs ESLint

### Server

- `npm run dev` starts the API with Nodemon
- `npm start` starts the API with Node

## API Areas

- `/api/auth`
- `/api/jobs`
- `/api/applications`
- `/api/donations`

## Deployment

The current deployed frontend is available at:

https://opportunity-bridge.onrender.com

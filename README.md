# 3D Portfolio

A Next.js portfolio with an interactive 3D keyboard background, scroll-driven animations, and a Resend-powered contact form.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
| --- | --- | --- |
| `RESEND_API_KEY` | Yes | API key from [Resend](https://resend.com/api-keys) |
| `RESEND_FROM_EMAIL` | Yes | Verified sender address in Resend, e.g. `Portfolio Contact <hello@yourdomain.com>` |
| `CONTACT_EMAIL` | Yes | Inbox that receives form submissions |
| `NEXT_PUBLIC_CONTACT_EMAIL` | No | Email shown in the contact form subtitle. Use an obfuscated format like `you(at)example.com` if you prefer |

### 3. Set up Resend

1. Create a free account at [resend.com](https://resend.com).
2. Add and verify your domain under **Domains**, or use Resend's test sender (`onboarding@resend.dev`) while developing.
3. Create an API key under **API Keys**.
4. Add the key and email values to `.env.local`.

**Notes:**

- `RESEND_FROM_EMAIL` must use a verified domain in production.
- With the default test sender, Resend only delivers to the email address tied to your Resend account.
- `CONTACT_EMAIL` is where submissions are delivered. `NEXT_PUBLIC_CONTACT_EMAIL` is only for display in the UI.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and scroll to the **Contact** section to test the form.

## Contact Form

The contact section includes:

- **Heading:** "LET'S WORK TOGETHER"
- **Fields:** full name, email address, message
- **API route:** `POST /api/contact`

### Request format

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "message": "I'd like to discuss a project."
}
```

### Success response

```json
{ "success": true }
```

### Error responses

The API returns `400` for validation errors and `500`/`502` when email delivery fails.

## Usage in production

1. Set the same environment variables in your hosting provider (e.g. Vercel project settings).
2. Verify your sending domain in Resend before going live.
3. Deploy as usual:

```bash
npm run build
npm start
```

## Project structure

```
app/
  api/contact/route.ts    # Resend email handler
  components/
    utils/Contact.tsx     # Contact form UI
    styles/Contact.css    # Contact section styles
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Run production server |
| `npm run lint` | Run ESLint |

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Resend Documentation](https://resend.com/docs)

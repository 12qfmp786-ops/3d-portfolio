# 3D Portfolio

A Next.js portfolio with an interactive 3D keyboard background, scroll-driven animations, and a Web3Forms-powered contact form.

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
| `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` | Yes | Access key from [Web3Forms](https://web3forms.com) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | No | Email shown in the contact form subtitle. Use an obfuscated format like `you(at)example.com` if you prefer |

### 3. Set up Web3Forms

1. Go to [web3forms.com](https://web3forms.com).
2. Enter the email address that should **receive** form submissions.
3. Copy the **Access Key** sent to your inbox.
4. Add it to `.env.local` as `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`.

**Notes:**

- Web3Forms free tier requires **client-side** submission (handled in `Contact.tsx`).
- The access key is public by design — Web3Forms restricts usage by domain.
- Submissions are delivered to the email you used when creating the access key.
- Free tier includes 250 submissions per month.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and scroll to the **Contact** section to test the form.

## Contact Form

The contact section includes:

- **Heading:** "LET'S WORK TOGETHER"
- **Fields:** full name, email address, message
- **Submission:** posts directly to Web3Forms from the browser

### Request payload

```json
{
  "access_key": "your-access-key",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "message": "I'd like to discuss a project.",
  "subject": "Portfolio contact from Jane Doe"
}
```

## Usage in production

1. Set `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` in your hosting provider (e.g. Vercel project settings).
2. Add your production domain in the Web3Forms dashboard if domain restriction is enabled.
3. Deploy as usual:

```bash
npm run build
npm start
```

## Project structure

```
app/
  components/
    utils/Contact.tsx     # Contact form UI + Web3Forms submission
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
- [Web3Forms Documentation](https://docs.web3forms.com)

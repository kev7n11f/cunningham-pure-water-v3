# Cunningham Pure Water LLC Website

A stunning, modern website for Cunningham Pure Water LLC - Louisiana's only authorized Wellsys dealer.

## Features

- **Stunning Water Effects**: Scroll-triggered animations, water splash effects, and floating bubbles
- **Modern Design**: Dark theme with water-inspired blue gradient colors and glassmorphism effects
- **Fully Responsive**: Works beautifully on desktop, tablet, and mobile devices
- **SEO Optimized**: Meta tags, sitemap, and robots.txt included
- **Contact Form**: Ready-to-use contact form (backend integration needed)
- **Framer Motion Animations**: Smooth scroll-triggered animations throughout

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Deployment**: Vercel

## Deployment to Vercel

### Option 1: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel deploy --prod
```

### Option 2: Vercel Dashboard

1. Push this code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Vercel will auto-detect Next.js and deploy

### Option 3: Direct Upload

1. Run `npm run build`
2. Upload the project folder to Vercel dashboard

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Customization

### Contact Information

Edit the phone number and email in `src/app/page.tsx`:
- Look for the Contact Section
- Update phone: `(318) 555-1234` → your actual number
- Update email: `info@cunninghampurewater.com` → your actual email

### Form Backend

The contact form currently logs to console. To add backend functionality:

1. **Vercel Functions**: Create an API route at `src/app/api/contact/route.ts`
2. **Email Service**: Integrate with Resend, SendGrid, or similar
3. **Database**: Store leads in Neon PostgreSQL

Example API route for form submission:

```typescript
// src/app/api/contact/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json();
  
  // Send email, store in database, etc.
  // ...
  
  return NextResponse.json({ success: true });
}
```

### Colors

Brand colors are defined in `src/app/globals.css`:
- `--burgundy`: #7B2D3D (Cunningham script color)
- `--navy`: #1E3A5F (Pure Water color)
- `--water-deep`: #4A9ED0 (Primary accent)

## File Structure

```
cunningham-pure-water/
├── public/
│   ├── logo.png          # Company logo
│   ├── favicon.svg       # Water droplet favicon
│   ├── robots.txt        # SEO robots file
│   └── sitemap.xml       # SEO sitemap
├── src/
│   └── app/
│       ├── globals.css   # Global styles & animations
│       ├── layout.tsx    # Root layout with SEO metadata
│       └── page.tsx      # Main page component
├── package.json
└── README.md
```

## Domain Setup

After deployment, configure your custom domain:
1. In Vercel dashboard, go to your project settings
2. Add domain: `cunninghampurewater.com` (or your chosen domain)
3. Update DNS records as instructed by Vercel

## License

© 2024 Cunningham Pure Water LLC. All rights reserved.

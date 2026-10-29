This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Exporting event feedback

Feedback answers are anonymous in the export. Use these steps to pull them into Google Sheets for board meetings:

1. In the Supabase dashboard, open the **SQL Editor** and run one of these:
   - `select * from feedback_export;` gives every response: date, event, type, rating, would come again, and the three written answers.
   - `select * from feedback_summary;` gives one row per event: response count, average rating, and % who would come again.
2. Click **Export → CSV**.
3. In Google Sheets, go to **File → Import → Upload**, then choose **Replace current sheet**. Keeping one tab per export works well.

Save both queries as SQL Editor snippets so each export takes one click. The views can only be read from the dashboard. Signed-in members can't read them through the app API.

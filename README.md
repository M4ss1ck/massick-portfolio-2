# Massick Portfolio

This is a portfolio project built with Next.js, showcasing various projects and skills.

It is live at [massick.dev](https://massick.dev).

## Features

- Built with Next.js
- TypeScript
- Tailwind CSS
- Payload CMS
- Easy deployment on Vercel

## Quick Start

First, you need to set up a PostgreSQL database. On local development, you can use Docker:

```bash
docker run --name my-postgres-db -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres
```

Then, create a `.env` file in the root of the project with the following content:

```bash
DATABASE_URL=DATABASE_URI=postgres://postgres:mysecretpassword@localhost:5432/postgres
PAYLOAD_SECRET=your-secret
```

To run the development server:

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

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

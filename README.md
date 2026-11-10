# Meyyol's Sports Day

Meyyol's Sports Day is planned as a multi-tenant school sports-day management and results platform. The repository is currently a Next.js starter; product authorization, database schema/RLS, storage policies, and operational security controls are not evidenced as implemented.

The Phase 1.8 documentation records approved requirements and open decisions. See [docs/PRD.md](docs/PRD.md), [docs/FOUNDER_DECISIONS.md](docs/FOUNDER_DECISIONS.md), and [docs/OPEN_DECISIONS.md](docs/OPEN_DECISIONS.md) for the authoritative product decisions and acceptance criteria.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Database design](docs/DATABASE.md)
- [Roles and authorization](docs/RBAC.md)
- [Security requirements](docs/SECURITY.md)
- [Data retention and recovery](docs/DATA_RETENTION.md)
- [Testing strategy](docs/TESTING.md)
- [Deployment requirements](docs/DEPLOYMENT.md)
- [Incident response](docs/INCIDENT_RESPONSE.md)
- [Pilot readiness checklist](docs/PILOT_CHECKLIST.md)
- [Documentation changelog](docs/CHANGELOG.md)

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

## Generic Next.js starter deployment guidance (not a Meyyol decision)

Vercel references in this README, including the starter font and deployment links, are generic Next.js boilerplate and do not represent a Meyyol provider selection. Meyyol's production hosting provider has not been selected, provider selection requires technical evaluation against [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md), and no production deployment decision has been approved. Any selected deployment must meet the approved security requirements.

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

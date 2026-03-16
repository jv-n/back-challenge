This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, download the dependencies:
```bash
pnpm install
# or
npm install
# or
yarn install
```

Then add the enviroment variables below (as it's only a development enviroment to acess my skills the key and values of the .env file are avaiable here):
```
POSTGRES_URL="postgresql://prisma.lgjrefeivrtyddvyixyl:password123@aws-1-sa-east-1.pooler.supabase.com:5432/postgres"
DIRECT_URL="postgresql://prisma.lgjrefeivrtyddvyixyl:password123@aws-1-sa-east-1.pooler.supabase.com:5432/postgres"

NEXTAUTH_URL="http://localhost:3000"
AUTH_SECRET="+dSDeQSBwzp2ex8gxzlNL1yQ50XfflZKZG1mEq20UW0="

NEXT_PUBLIC_SUPABASE_URL="https://lgjrefeivrtyddvyixyl.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnanJlZmVpdnJ0eWRkdnlpeHlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNjUxMTEsImV4cCI6MjA4ODk0MTExMX0.6mDx7JbBrUdZ2Y57deuXDVvC5H5yzutUizuNy6wD4C4"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnanJlZmVpdnJ0eWRkdnlpeHlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM2NTExMSwiZXhwIjoyMDg4OTQxMTExfQ.jwuSCbYGKVWJfYMXQ4ajx6z4h1Q986jQncSQ6AWwrpw"
```
Then run the app with:

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

## AI Usage

Utilizei o v0 para a construção da interface (front-end) da plataforma, auxiliando e acelerando meu tempo já que não precisei estilizar componentes, entretanto tive que corrigir erros de tipagem e componentes de UI desnecessários e deatualizados, bem como a compatibilidade com a API que construí, o próprio v0 porém, acelerou esse processo ao me auxiliar nessa construção.

Utilizei o próprio v0 junto com o Claude, para debuggar e revisar erros de código e erros de produção, tanto que apesar de rodar 100% em ambiente local, o app ainda não está 100% no deploy: https://jv-back-challenge.vercel.app

### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!





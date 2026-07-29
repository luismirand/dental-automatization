# Production Frontend: Vercel

The landing is a static Astro application and can be deployed on Vercel without
a server adapter.

## Git integration

1. In Vercel, choose **Add New → Project**.
2. Import the GitHub repository.
3. Set **Root Directory** to `apps/web-landing`.
4. Confirm framework preset `Astro`.
5. Set production branch to `main`.
6. Enable automatic production deployments.

Expected commands:

```text
Install Command: npm ci
Build Command: npm run build
Output Directory: dist
```

Vercel will provide a production `*.vercel.app` domain. No purchased domain is
required for this demo.

## Environment variables

After the Oracle/Coolify backend has a stable HTTPS hostname, create this Vercel
production variable:

```text
PUBLIC_WEBCHAT_WEBHOOK_URL=https://<n8n-host>/webhook/webchat
```

This value is public browser configuration. Never add API keys, database
credentials or n8n credentials to a `PUBLIC_*` variable.

Use the production n8n webhook path, not `/webhook-test/`.

## Deployment behavior

```text
Pull request / non-main branch → Vercel Preview
Merge or push to main          → Vercel Production
```

GitHub CI should pass before merging to `main`.

## Smoke test

After deployment:

1. Open the Vercel production URL.
2. Confirm the page has no console errors.
3. Open WebChat and send a test message.
4. Confirm the request targets the HTTPS n8n hostname.
5. Confirm the response renders and persists in PostgreSQL.
6. Open the Cal.com widget.
7. Check the landing on mobile and desktop widths.

If the environment variable changes, redeploy the current `main` commit because
Astro public variables are embedded during the static build.

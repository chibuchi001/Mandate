# Mandate — Define Your Agent's Authority

> **Auth0 "Authorized to Act" Hackathon**
> Auth0 End-to-End: Universal Login + Token Vault · Groq AI (Llama 3.3 70B) · Next.js 14

## What It Does

Mandate is an AI executive assistant where you define exactly what the agent can do. Auth0 handles everything — user authentication via Universal Login and service authorization via Token Vault. Connect Google and Slack through OAuth, set permission boundaries per-scope, approve or reject every action, and export a full audit trail as a PDF consent receipt.

## How Auth0 Is Used

**User Authentication** — `@auth0/nextjs-auth0` handles sign-in, sessions, and user profiles. The `/app` route is protected by `withMiddlewareAuthRequired`. Users sign in through Auth0 Universal Login.

**Service Connections** — clicking "Connect" on Google or Slack redirects through Auth0's social connection OAuth flow. Auth0 manages the OAuth handshake with the external provider and stores the resulting tokens in Token Vault.

**Token Vault (RFC 8693)** — `token-vault.ts` implements the federated connection access token exchange. When the agent needs to call Google Calendar or Slack, it exchanges the user's Auth0 token for a provider-specific access token via the `urn:auth0:params:oauth:grant-type:token-exchange:federated-connection-access-token` grant type.

**Step-Up Auth** — critical operations (merging PRs, admin actions) trigger a re-authentication modal simulating Auth0's step-up flow.

## Features

- Auth0 Universal Login for user authentication
- Auth0 Token Vault for service token management (Google, Slack)
- 4-tier risk classification (Auto / Confirm / Approve / Step-Up)
- Custom risk rules editor per scope
- Granular scope toggles per service
- Token health monitoring (active / expiring / expired / revoked)
- Consent receipt PDF export
- Error handling with retry
- Multi-turn AI conversation (Groq Llama 3.3 70B)
- Step-up authentication modal
- Mobile responsive
- Graceful degradation on service revocation
- Real-time audit logging

## Tech Stack

| Layer | Technology |
|-------|-----------|
| User Auth | Auth0 (`@auth0/nextjs-auth0`) |
| Service Auth | Auth0 Token Vault (RFC 8693) |
| AI | Groq (Llama 3.3 70B) via OpenAI-compatible API |
| Frontend | Next.js 14, React 18, Tailwind CSS, Zustand |
| PDF | jsPDF + jspdf-autotable |

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

### Auth0 Configuration

1. Create a Regular Web App in Auth0 Dashboard
2. Settings:
   - Allowed Callback URLs: `http://localhost:3000/api/auth/callback`
   - Allowed Logout URLs: `http://localhost:3000`
   - Allowed Web Origins: `http://localhost:3000`
3. Social Connections: add Google (with Calendar/Gmail scopes) and Slack (with channels:read, chat:write)
4. Enable Token Vault on each social connection (toggle "Connected Accounts for Token Vault")
5. `.env.local`:
   ```
   AUTH0_SECRET='openssl rand -hex 32'
   AUTH0_BASE_URL='http://localhost:3000'
   AUTH0_ISSUER_BASE_URL='https://YOUR_TENANT.auth0.com'
   AUTH0_CLIENT_ID='...'
   AUTH0_CLIENT_SECRET='...'
   AUTH0_DOMAIN='YOUR_TENANT.auth0.com'
   GROQ_API_KEY='gsk_...'
   ```

### Groq AI

Free API key at [console.groq.com](https://console.groq.com). Without it, demo mode runs with simulated responses.

## Project Structure

```
middleware.ts                        # Auth0 withMiddlewareAuthRequired
src/app/
  page.tsx                           # Landing (public, auth-aware)
  app/page.tsx                       # Dashboard (Auth0 protected)
  layout.tsx                         # Auth0 UserProvider
  api/auth/[...auth0]/route.ts       # Auth0 login/logout/callback
  api/agent/route.ts                 # Groq AI + Auth0 session
  api/execute/route.ts               # Tool execution via Token Vault
src/components/
  chat/ChatPanel.tsx                 # Chat + AI + demo fallback
  dashboard/ServicesPanel.tsx        # OAuth connect via Auth0 social connections
  dashboard/ActionsPanel.tsx         # Approval queue + retry + step-up
  dashboard/AuditPanel.tsx           # Log + PDF consent receipt
  dashboard/RiskRulesPanel.tsx       # Risk level editor
  shared/Header.tsx                  # Auth0 user profile + health dots
src/lib/
  token-vault.ts                     # Auth0 Token Vault RFC 8693 exchange
  grok-agent.ts                      # Groq/Llama integration
  store.ts                           # Zustand state
  consent-receipt.ts                 # PDF generation
```

## How It Works

1. User signs in via Auth0 Universal Login
2. Clicks "Connect" on Google → Auth0 OAuth flow → tokens stored in Token Vault
3. Asks agent: "What's in my calendar?"
4. Agent creates a plan: List Calendar Events (Auto risk)
5. Auto-risk actions execute immediately via `/api/execute` → Token Vault exchange → Google Calendar API
6. Results appear in the Actions panel
7. Write operations (Confirm/Approve) require explicit user approval
8. Step-Up operations require re-authentication
9. All actions logged → exportable as PDF consent receipt

## Bonus Blog Post

## Bonus Blog Post

Building Mandate taught me that authorization UX is the whole product when it comes to AI agents.

Auth0 handles everything in this project — user login via Universal Login and service tokens via Token Vault's RFC 8693 exchange. Having a single identity provider for both layers simplified the architecture dramatically. The user signs in once with Auth0, and that same session enables Token Vault to exchange credentials for Google and Slack.

The hard part was the UX. Four risk levels — Auto, Confirm, Approve, Step-Up — give enough granularity without choice paralysis. Making these configurable per scope was the key insight. Maybe you trust Slack posts enough to auto-approve them. The Risk Rules editor encodes your trust model into the authorization layer.

The consent receipt feature emerged from a compliance question: if an AI agent sends email on your behalf, who's accountable? Mandate logs every action, approval, and scope change — exportable as a PDF. This turns debugging into compliance.

Graceful degradation was the most surprising discovery. Disconnect Slack mid-conversation and the agent doesn't crash — it tells you what changed and asks to reconnect. This pattern is missing from every agent framework but essential for trust.

The OAuth redirect flow for connecting services means the page reloads — I solved this by persisting connection state so services stay connected across redirects. It's a small UX detail but it matters: users shouldn't have to reconnect services every time they navigate.

Auth0's unified approach — user identity and service authorization through one platform — made this possible in a hackathon timeframe. Token Vault handles the hard parts (token refresh, secure storage, exchange). Mandate is where trust gets built.

## License

MIT
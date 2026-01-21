# Ask AI - Real-time Streaming with Trigger.dev

A minimal "Ask AI" application that demonstrates real-time token streaming using Trigger.dev Realtime Streams v2 and the Vercel AI SDK. Submit a question through a simple UI and watch the AI response stream in live, token by token.

## Features

- 🚀 Real-time token streaming via Trigger.dev Realtime Streams v2
- 🤖 OpenAI GPT-4o-mini integration via Vercel AI SDK
- ⚡ Next.js 14+ App Router with TypeScript
- 🔐 Scoped public access tokens for secure client-side subscriptions
- 📝 Loading, streaming, and error states in the UI

## Prerequisites

Before you begin, ensure you have the following:

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **Trigger.dev account** - [Sign up at trigger.dev](https://cloud.trigger.dev)
- **OpenAI API key** - [Get one at platform.openai.com](https://platform.openai.com/api-keys)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example environment file:

```bash
cp .env.example .env
```

Then fill in your environment variables in `.env`:

```bash
# Get your secret key from: https://cloud.trigger.dev -> Your Project -> API Keys
# Use tr_dev_xxx for development
TRIGGER_SECRET_KEY=tr_dev_your_secret_key_here

# Get your API key from: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-your_openai_api_key_here

# Optional: Public API key for frontend (we use auth.createPublicToken instead)
NEXT_PUBLIC_TRIGGER_PUBLIC_API_KEY=tr_pub_your_public_key_here
```

### 3. Configure Trigger.dev project

Update `trigger.config.ts` with your project ref:

```typescript
project: "proj_xxxxxxxxxxxxx", // Replace with your project ref from the dashboard
```

You can find your project ref at: **https://cloud.trigger.dev** → Your Project → Project Settings

### 4. Initialize Trigger.dev (if needed)

If you haven't set up a Trigger.dev project yet:

```bash
npx trigger.dev@latest init
```

This will guide you through creating a new project and automatically configure your `trigger.config.ts`.

## Run

You'll need **two terminal windows** to run this application:

### Terminal 1: Start Next.js development server

```bash
npm run dev
```

This starts the Next.js app at [http://localhost:3000](http://localhost:3000).

### Terminal 2: Start Trigger.dev dev server

```bash
npx trigger.dev dev
```

This connects your local tasks to the Trigger.dev platform and enables real-time streaming.

### Using the app

1. Open [http://localhost:3000](http://localhost:3000) in your browser
2. Enter a question in the text area
3. Click "Ask AI"
4. Watch the AI response stream in real-time!

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Browser   │────▶│  API Route  │────▶│ Trigger.dev │────▶│   OpenAI    │
│  (React UI) │     │ /api/ask    │     │   Task      │     │ GPT-4o-mini │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
       ▲                                       │
       │                                       │
       └───────── Realtime Streams v2 ─────────┘
                  (token by token)
```

### Flow

1. **User submits question** - The React form POSTs to `/api/ask`
2. **API triggers task** - The route triggers the `ask-ai` task and creates a scoped public access token
3. **Task streams response** - The task calls OpenAI via Vercel AI SDK and pipes tokens to Realtime Streams
4. **UI receives tokens** - The `useRealtimeStream` hook receives chunks in real-time
5. **Live updates** - The UI displays each token as it arrives, showing the response building character by character

### Key Files

| File | Description |
|------|-------------|
| `trigger/ask-ai.ts` | Trigger.dev task that calls OpenAI and streams the response |
| `trigger/streams.ts` | Realtime Streams v2 stream definition |
| `app/api/ask/route.ts` | API route that triggers the task and returns access token |
| `app/components/AskAI.tsx` | React component that displays streaming response |
| `app/page.tsx` | Main page with question form |
| `trigger.config.ts` | Trigger.dev configuration |

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [Trigger.dev](https://trigger.dev/) - Background jobs and real-time streaming
- [Vercel AI SDK](https://sdk.vercel.ai/) - AI integration library
- [OpenAI](https://openai.com/) - GPT-4o-mini model
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling

## License

MIT

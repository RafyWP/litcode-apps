
# TikTok Video Anchor

A simple and efficient web application designed to help users create a TikTok Pixel for their advertising accounts. This tool is particularly useful for those who need a pixel ID for integration with Google Tag Manager (GTM) but do not have a standard e-commerce platform that would typically generate one automatically.

The application guides the user through a secure OAuth 2.0 flow to connect with their TikTok Ads account, select an advertiser profile, and generate a new pixel with a custom name.

## Core Features

- **Secure TikTok OAuth**: Uses the standard TikTok for Business OAuth 2.0 flow to securely connect to your account.
- **Advertiser Account Selection**: Automatically fetches and lists your available advertiser accounts.
- **Pixel Creation**: Allows you to create a new TikTok Pixel with a specified name under your chosen advertiser account.
- **Instant Pixel ID**: Immediately displays the newly created Pixel ID for you to copy and use.
- **Clean, Responsive UI**: Built with modern components for a seamless experience on any device.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **UI Library**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN/UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## Getting Started

Follow these instructions to set up and run the project locally.

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- A TikTok for Business account
- A registered application in the [TikTok Developer Portal](https://business-api.tiktok.com/portal/)

### 2. Configure Your TikTok App

Before running the project, you need to configure your application in the TikTok Developer Portal:

1.  Go to **My Apps** and select your application.
2.  **Set the Redirect URI**: In your app's settings, find the "Redirect URI" field and set it to the one you will use in your environment configuration (e.g., `http://localhost:9002/apps/tiktok-video-anchor`).
3.  **Enable Permissions (Scopes)**: Go to the "Permissions" section and ensure the following scopes are enabled:
    *   `bc.read` (Ad Account Management)
    *   `cm.manage` (Pixel Management)

### 3. Installation and Setup

First, clone the repository and navigate into the project directory:

```bash
git clone <repository_url>
cd <project_directory>
```

Install the necessary dependencies:

```bash
npm install
```

### 4. Environment Variables

Create a file named `.env.local` in the root of the project and add your TikTok application credentials. You can find your `App ID` and `Secret` in the TikTok Developer Portal.

**Crucially, you need to define `TIKTOK_APP_ID` for server-side actions and `NEXT_PUBLIC_TIKTOK_APP_ID` for the client-side code. Both should have the same value.**

```env
# Used by server-side actions ONLY.
TIKTOK_APP_ID="YOUR_TIKTOK_APP_ID"
TIKTOK_SECRET="YOUR_TIKTOK_SECRET"

# Prefixed with NEXT_PUBLIC_ to be accessible on the client-side (browser).
# Used to build the authorization URL.
NEXT_PUBLIC_TIKTOK_APP_ID="YOUR_TIKTOK_APP_ID"
NEXT_PUBLIC_TIKTOK_REDIRECT_URI="http://localhost:9002/apps/tiktok-video-anchor"
```

**Note**:
- Replace `"YOUR_TIKTOK_APP_ID"` and `"YOUR_TIKTOK_SECRET"` with your actual credentials.
- The `NEXT_PUBLIC_TIKTOK_REDIRECT_URI` must exactly match the URI you configured in the TikTok Developer Portal.

### 5. Run the Development Server

Start the development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser to see the application.

## How to Use the Application

1.  **Authorize**: Click the "Authorize with TikTok" button.
2.  **Log In**: You will be redirected to TikTok. Log in with your TikTok for Business credentials and grant the requested permissions.
3.  **Redirect**: After successful authorization, you will be redirected back to the application. It will automatically fetch an access token.
4.  **Select Advertiser**: Choose the desired advertiser account from the dropdown menu.
5.  **Name Your Pixel**: Enter a descriptive name for your new pixel.
6.  **Generate**: Click "Generate Pixel".
7.  **Copy ID**: The new Pixel ID will be displayed. You can copy it and start the process over if needed.

# Razorpay Integration Setup

This guide allows you to run the complete payment system with Subscription support (31-day billing cycle).

## 1. Environment Setup

Add the following keys to your `.env` file in the project root:

```env
# Existing Supabase Keys...

# Razorpay Keys (Get these from razorpay.com -> Settings -> API Keys)
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=your_secret_...

# Supabase Service Role Key (Found in Supabase Project Settings -> API)
# Required for the backend to update user profiles securely
SUPABASE_SERVICE_ROLE_KEY=ey...

# Webhook Secret (Optional for local dev, but recommended)
WEBHOOK_SECRET=your_webhook_secret
```

## 2. Initialize Plans using Node.js Script

We have created a script `server/init_plans.js` to automatically create the "Plus" (₹49) and "Teams" (₹99) monthly plans in your Razorpay account.

Run this command:
```bash
node server/init_plans.js
```

The script will output two Plan IDs (e.g., `plan_N...`). **Copy these IDs** and add them to your `.env` file:

```env
RAZORPAY_PLAN_ID_PLUS=plan_...
RAZORPAY_PLAN_ID_TEAMS=plan_...
```

## 3. Start the Backend Server

Start the Node.js Express server which handles the payment creation and verification (running on port 3000):

```bash
node server/server.js
```

## 4. Run the Frontend

In a separate terminal, run your Vite app (port 8080):

```bash
npm run dev
```

We have configured `vite.config.ts` to proxy API requests (`/api/...`) to `http://localhost:3000`.

## 5. Verify Integration
1. Go to **Plus** page.
2. Click **Subscribe via Razorpay**.
3. Complete the payment.
4. The user profile in Supabase will be updated to `is_premium: true` and `subscription_status: 'active'`.

## Notes
- **Webhooks**: For live updates (renewals, failures), you need to expose `http://your-domain/api/webhook` to Razorpay Dashboard. For local development, use tools like `ngrok`.
- **Production**: Deploy the contents of `server/` to a Node.js host (e.g., Render, Railway, or integrate into Next.js API routes if you migrate).

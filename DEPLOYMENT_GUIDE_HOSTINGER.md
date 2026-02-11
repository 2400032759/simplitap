---
description: Deploying Simplify Tap Identity to Hostinger
---

# Deployment Guide for Hostinger

This guide covers deploying the React Frontend and Node.js Backend to Hostinger.

## Prerequisites

-   A Hostinger account with a plan that supports Node.js (Business Shared Hosting, Cloud Hosting, or VPS).
-   Access to hPanel.
-   Access to your domain's DNS settings.

## Part 1: Backend Deployment (Node.js)

Since the frontend is a Single Page Application (SPA), it needs a live API server to talk to. We will deploy the backend first.

### 1.1 Create a Subdomain
1.  Log in to **Hostinger hPanel**.
2.  Go to **Websites** -> **Manage**.
3.  Search for **Subdomains** in the sidebar.
4.  Create a new subdomain, e.g., `api.simplifytap.com` (or whatever your domain is).
5.  Wait a few minutes for it to propagate.

### 1.2 Setup Node.js Application
1.  In hPanel, go to **Advanced** -> **Node.js**.
2.  Click **Create Application**.
3.  **Application Root**: `public_html/api` (This folder will be created inside your subdomain's root, or just map it to where you want). Actually, simpler: select the subdomain you created (`api.simplifytap.com`) from the dropdown if available, or just use the main domain and a specific folder like `domains/api.simplifytap.com/public_html`.
4.  **Application Startup File**: `server/server.js` (We will upload the code structure later). For now, just `server.js`.
5.  **Node.js Version**: Select **18** or **20** (Recommended).
6.  Click **Create**.

### 1.3 Upload Backend Code
1.  Go to **Files** -> **File Manager**.
2.  Navigate to the directory you chose for the Node.js app (e.g., `domains/api.simplifytap.com/public_html`).
3.  Upload the following files/folders from your local `server` folder:
    -   `server.js`
    -   `init_49_plan.cjs` (if needed to run once)
    -   `package.json` (Copy this from the root `package.json` but strip out frontend dependencies to keep it light, or just upload the root `package.json` if you're lazy - it's fine). **Crucial**: Ensure `razorpay`, `express`, `cors`, `dotenv`, `body-parser` are in `dependencies`.
    -   Create a `.env` file with your production secrets:
        ```env
        RAZORPAY_KEY_ID=rzp_live_...
        RAZORPAY_KEY_SECRET=...
        RAZORPAY_PLAN_ID_PLUS=...
        RAZORPAY_PLAN_ID_TEAMS=...
        RAZORPAY_WEBHOOK_SECRET=...
        PORT=3000 (Hostinger overrides this internally usually, but good to have)
        ```

### 1.4 Install Dependencies & Start
1.  Go back to the **Node.js** section in hPanel.
2.  Click **NPM Install** (This runs `npm install` on the server).
3.  Click **Restart** (or Start).
4.  Your backend should now be live at `https://api.simplifytap.com`. Test it by visiting `https://api.simplifytap.com/api/health` (if you have a health route) or just checking logs.

## Part 2: Frontend Deployment (React)

Now we deploy the frontend logic, pointing it to the new backend.

### 2.1 Update Environment Variables
1.  Create a file named `.env.production` in your local project root.
2.  Add the backend URL:
    ```env
    VITE_API_URL=https://api.simplifytap.com
    VITE_RAZORPAY_KEY_ID=rzp_live_...
    ```
    *(Note: No trailing slash on the URL)*

### 2.2 Local Build
1.  Open your terminal in the project root.
2.  Run the build command:
    ```bash
    npm run build
    ```
3.  This creates a `dist` folder containing your optimized website.

### 2.3 Upload to Hostinger
1.  In hPanel, go to **Files** -> **File Manager**.
2.  Navigate to `public_html` (for your main domain).
3.  Delete default files (like `default.php`).
4.  Upload **all files and folders** from inside your local `dist` folder to `public_html`.
    -   You should see `index.html`, `assets/`, etc. directly in `public_html`.

### 2.4 Setup .htaccess for React Router
Since this is a Single Page App, we need to redirect all 404s to `index.html` so React can handle routing.
1.  In `public_html`, look for `.htaccess`. If not there, create it.
2.  Edit `.htaccess` and add:
    ```apache
    <IfModule mod_rewrite.c>
      RewriteEngine On
      RewriteBase /
      RewriteRule ^index\.html$ - [L]
      RewriteCond %{REQUEST_FILENAME} !-f
      RewriteCond %{REQUEST_FILENAME} !-d
      RewriteRule . /index.html [L]
    </IfModule>
    ```
3.  Save.

## Part 3: Verification

1.  Visit `https://simplifytap.com`.
2.  Try to log in (Supabase auth should work fine).
3.  Try to initiate a subscription upgrade. The frontend should call `https://api.simplifytap.com/api/create-subscription`.
4.  If it fails, check the Browser Console (F12) -> Network tab to see if the request is being blocked (CORS) or failing.

## Troubleshooting

-   **CORS Issues**: If you see CORS errors in the console, verify your `server.js` allows the production domain.
    In `server.js`:
    ```javascript
    app.use(cors({
        origin: ["https://simplifytap.com", "https://www.simplifytap.com"],
        credentials: true
    }));
    ```
-   **500 Errors**: Check the `Node.js` section in hPanel -> **Error Logs**.

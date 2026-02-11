# SMTP Email Setup for Team Invites

To enable team invitation emails, you need to configure your SMTP settings in the `.env` file. We use `nodemailer` to send emails.

## 1. Add Environment Variables

Open your `.env` file in the root directory and add the following variables:

```env
# --- SMTP EMAIL CONFIGURATION ---
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SENDER_EMAIL="SimplifyTap Team <noreply@simplifytap.com>"
```

### For Gmail Users:
1. Go to your Google Account > Security.
2. Enable 2-Step Verification if not already enabled.
3. Search for "App Passwords".
4. Create a new App Password for "Mail" and use it as `SMTP_PASS`. Do NOT use your regular password.

## 2. Restart the Server

After updating the `.env` file, you must restart your backend server for changes to take effect.

```bash
# In a separate terminal
node server/server.js
```

## 3. Test It

Go to the Teams dashboard, add a member, and they should now receive an email!

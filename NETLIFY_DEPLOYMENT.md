# Netlify Deployment Guide

This guide explains how to deploy your ISO19650 Dashboard to Netlify to enable the WorkflowMax OAuth proxy function.

## Why Netlify?

The WorkflowMax integration requires a **serverless function** to handle OAuth token exchange and avoid CORS (Cross-Origin Resource Sharing) browser restrictions. Netlify provides:

- ✅ Free hosting (same as GitHub Pages)
- ✅ Free serverless functions
- ✅ Automatic HTTPS
- ✅ Easy GitHub integration
- ✅ Custom domain support

## Quick Setup (5 minutes)

### Step 1: Create Netlify Account

1. Go to: **https://app.netlify.com/signup**
2. Sign up with **GitHub** (easiest option)
3. Authorize Netlify to access your repositories

### Step 2: Create New Site

1. Click **"Add new site"** → **"Import an existing project"**
2. Choose **"Deploy with GitHub"**
3. Find and select your **BaileyISO19650Dashboard** repository
4. Select branch: **`claude/iso19650-dashboard-klrLz`**

### Step 3: Configure Build Settings

Netlify should auto-detect the settings from `netlify.toml`, but verify:

```
Build command: (leave empty)
Publish directory: .
Functions directory: netlify/functions
```

Click **"Deploy site"**

### Step 4: Wait for Deployment

- First deployment takes 1-2 minutes
- You'll get a random URL like: `https://random-name-12345.netlify.app`

### Step 5: Update WorkflowMax OAuth App

**Important:** You need to update your WorkflowMax OAuth app redirect URI!

1. Go to Xero Developer Portal: https://developer.xero.com/app/manage
2. Click on your **"BP ISO Dashboard"** app
3. Update the **Redirect URI** to:
   ```
   https://YOUR-NETLIFY-URL.netlify.app/oauth-callback.html
   ```
   (Replace `YOUR-NETLIFY-URL` with your actual Netlify URL)
4. **Save** the changes

### Step 6: Test the Connection

1. Open your Netlify dashboard URL
2. Navigate to **WorkflowMax Sync**
3. Enter your Client ID
4. Click **"Connect to WorkflowMax"**
5. Authorize
6. It should work now! ✅

---

## Custom Domain (Optional)

If you want to use your own domain instead of `.netlify.app`:

### Option 1: Custom Subdomain

1. In Netlify dashboard, go to **Domain settings**
2. Click **"Add custom domain"**
3. Enter your subdomain (e.g., `iso19650.baileypartnership.com`)
4. Follow DNS setup instructions
5. Netlify provides free HTTPS certificate

### Option 2: Keep GitHub Pages + Netlify Functions

You can keep GitHub Pages for the main site and only use Netlify for the function:

1. Deploy to both GitHub Pages and Netlify
2. Keep main dashboard on GitHub Pages
3. Update WorkflowMax API to use Netlify function URL:
   ```javascript
   tokenProxy: 'https://YOUR-NETLIFY-URL.netlify.app/.netlify/functions/token-exchange'
   ```

---

## How It Works

### Architecture

```
Browser (Dashboard)
    ↓ OAuth Authorization
Xero Login Page
    ↓ Redirect with code
Dashboard oauth-callback.html
    ↓ Send code to proxy
Netlify Function (/.netlify/functions/token-exchange)
    ↓ Exchange code
Xero Token Endpoint
    ↓ Return tokens
Netlify Function
    ↓ Return to dashboard
Browser stores tokens
    ↓ Make API calls
WorkflowMax API
```

### Why We Need the Proxy

**Without Proxy (Direct from Browser):**
```
Browser → Xero Token Endpoint
❌ CORS Error: Blocked by browser security
```

**With Proxy (Through Netlify Function):**
```
Browser → Netlify Function → Xero Token Endpoint
✅ Works: Server-side request, no CORS restrictions
```

---

## Security

### Is This Secure?

✅ **Yes!** The serverless function:
- Only proxies token exchange (doesn't store anything)
- Validates all requests
- Uses HTTPS (encrypted)
- Read-only access (can't modify WorkflowMax)
- Open source (you can review the code)

### What Data Flows Through It?

- Authorization code (one-time use, expires quickly)
- Access tokens (stored in browser, not on server)
- Refresh tokens (stored in browser, not on server)

**Nothing is stored** on the server - it's just a pass-through proxy.

---

## Troubleshooting

### "Function not found" Error

**Cause:** Functions directory not deployed correctly

**Solution:**
1. Check `netlify.toml` is in repository root
2. Re-deploy the site
3. Check Netlify build logs for errors

### "Authorization failed" After Deployment

**Cause:** Redirect URI not updated in WorkflowMax app

**Solution:**
1. Update redirect URI in Xero Developer Portal
2. Must match exactly: `https://YOUR-URL.netlify.app/oauth-callback.html`

### Function Returns Error

**Cause:** Issue with token exchange request

**Solution:**
1. Check Netlify function logs (Functions → token-exchange → Logs)
2. Verify Client ID is correct
3. Check that authorization code hasn't expired (try again)

---

## Costs

**Netlify Free Tier Includes:**
- 100GB bandwidth/month (plenty for this use)
- 125,000 function invocations/month
- Unlimited sites
- Free HTTPS certificates

**For Bailey Partnership:**
With ~10 users syncing projects weekly, you'll use:
- ~40 function calls/month (well under limit)
- ~100MB bandwidth/month (well under limit)

**Cost: FREE** ✅

---

## Alternative: GitHub Pages + Separate Function

If you prefer to keep GitHub Pages:

1. Deploy **just the function** to Netlify (or Vercel/Cloudflare Workers)
2. Keep main site on GitHub Pages
3. Update `workflowmax-api.js` to point to function URL
4. Update both redirect URIs (one for each domain)

---

## Support

### Netlify Documentation
- Functions: https://docs.netlify.com/functions/overview/
- Deployment: https://docs.netlify.com/site-deploys/overview/

### Need Help?
- Check Netlify build logs for deployment issues
- Check function logs for runtime errors
- Verify redirect URI matches exactly in WorkflowMax app

---

## Summary

1. ✅ Sign up for Netlify (free)
2. ✅ Connect GitHub repository
3. ✅ Deploy (auto-configured via netlify.toml)
4. ✅ Update redirect URI in WorkflowMax app
5. ✅ Test connection
6. ✅ Done!

**Total time:** 5-10 minutes
**Cost:** Free
**Benefit:** WorkflowMax integration works! 🎉

---

**Ready to deploy?** Follow Steps 1-6 above and you'll be syncing WorkflowMax projects in no time!

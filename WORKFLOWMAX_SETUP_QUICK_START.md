# WorkflowMax Integration - Quick Start

## ✅ What's Been Created

Your ISO19650 Dashboard now has **read-only WorkflowMax integration** to automatically import project data!

## 🚀 Setup in 3 Steps

### Step 1: Create OAuth App in WorkflowMax (5 minutes)

1. Log into WorkflowMax
2. Go to: **Settings → Apps → My Apps → Create New App**
3. Fill in these exact values:

```
App Name: BP ISO Dashboard

Company URL: https://archiflux.github.io/BaileyISO19650Dashboard

Redirect URI: https://archiflux.github.io/BaileyISO19650Dashboard/oauth-callback.html

Scopes: workflowmax
```

> **Note:** App Name must be 20 characters or less. "BP ISO Dashboard" = 17 chars ✓

4. Click **Save**
5. **Copy the Client ID** (you'll need this)
6. *(Optional)* Copy the Client Secret

> ⚠️ **Important:** The Redirect URI must be EXACTLY as shown above!

### Step 2: Connect Dashboard (2 minutes)

1. Open your ISO19650 Dashboard
2. Go to: **Project Management → WorkflowMax Sync** (Section 3.1)
3. Paste your **Client ID** from Step 1
4. Click **"Connect to WorkflowMax"**
5. Log into WorkflowMax when prompted
6. Click **"Authorize"** to grant read-only access
7. You'll be redirected back - you're now connected! ✓

### Step 3: Import Your Projects (1 minute)

1. Click **"Sync Projects Now"** to import all active projects
2. Or click **"Import"** on individual projects
3. View synced projects in **Active Projects** page
4. Done! All your WorkflowMax data is now in the dashboard

## 📊 What Gets Imported Automatically

From your WorkflowMax custom fields, the integration automatically maps:

✅ **ISO 19650 - Project Identifier** → ISO Number (primary identifier!)
✅ **Information Manager** → BIM Manager
✅ **RIBA Stage (Current)** → Project Phase (auto-converted)
✅ **Framework Appointed (Under)** → Bailey Role
✅ **Site Address** → Project Location
✅ **ACC Link** → CDE Link
✅ **BSR Registration Number** → Preserved
✅ **Responsible Person (RRO)** → Preserved
✅ **Building Height** → Preserved
✅ **Principal Accountable Person** → Preserved
✅ **All other custom fields** → Stored in customFields

Plus standard fields:
- Project Name, Number, Description
- Client Name
- Project Lead (from Job Manager)
- Start Date, Budget

## 🔒 Security Guarantee

- ✅ **READ-ONLY** - Cannot modify WorkflowMax data
- ✅ **Secure OAuth 2.0** - Industry standard authentication
- ✅ **No Third Parties** - Direct connection only
- ✅ **Browser-Based** - Data stays local
- ✅ **Disconnect Anytime** - Full control

## 🔄 Keeping Data Fresh

### Re-Sync Projects
WorkflowMax changes won't appear automatically. To update:

1. Go to **WorkflowMax Sync → Synced Projects**
2. Click **"Re-sync"** on any project
3. Or click **"Sync Projects Now"** to update all

### Best Practice
- Sync weekly or when project details change in WorkflowMax
- Re-sync before creating BEP or RACI matrices
- Export data regularly as backup

## ⚠️ Known Limitation: CORS Issue

You may see this error: "Token exchange failed: CORS error"

**Why?** Browsers block direct token exchange for security.

**Solution Options:**

1. **Quick Fix (Manual Token):**
   - Complete OAuth in WorkflowMax
   - Copy access token manually
   - Enter in dashboard settings

2. **Proper Fix (Serverless Function):**
   - Deploy a simple proxy function on Vercel/Netlify/AWS Lambda
   - Proxy the token exchange request
   - This is the recommended long-term solution

I can help set up the serverless function if you encounter this issue.

## 📱 Where to Find It

**In Dashboard:**
- Navigation: **3.1 WorkflowMax Sync**
- Homepage: **Quick Actions → "Sync from WorkflowMax"** (yellow button)

**Documentation:**
- Full Guide: `WORKFLOWMAX_INTEGRATION.md`
- This Quick Start: `WORKFLOWMAX_SETUP_QUICK_START.md`

## 💡 Usage Tips

1. **First Sync:** Import all active projects to populate dashboard
2. **Project Updates:** Re-sync after WorkflowMax changes
3. **ISO Numbers:** Make sure "ISO 19650 - Project Identifier" is filled in WorkflowMax
4. **Team Assignment:** Assign "Information Manager" in WorkflowMax for auto-mapping
5. **Backup:** Export synced projects regularly using Export tool

## 🎯 What Happens Next

After syncing, your WorkflowMax projects appear in:
- ✅ **Project List** with WorkflowMax tag
- ✅ **Dashboard Metrics** (total projects count)
- ✅ **Recent Activity** feed
- ✅ Ready for RACI matrix generation
- ✅ Ready for BEP creation

## 🔧 Troubleshooting

**No projects appearing?**
- Check projects are "In Progress" status in WorkflowMax
- Verify connection is still active
- Try re-syncing

**Authorization fails?**
- Double-check Client ID
- Verify Redirect URI matches exactly
- Check app is enabled in WorkflowMax

**Custom fields missing?**
- Field names must match exactly in WorkflowMax
- Check spelling: "ISO 19650 - Project Identifier"
- Re-sync project to pick up new fields

## 📞 Need Help?

1. Check `WORKFLOWMAX_INTEGRATION.md` for detailed troubleshooting
2. Browser console (F12) shows detailed error messages
3. Contact IT support for serverless function setup

---

**Quick Start Complete!** 🎉

You can now:
1. Sync projects from WorkflowMax automatically
2. Stop manual data entry
3. Keep projects up-to-date with WorkflowMax
4. Focus on ISO19650 compliance, not data entry

**Ready to sync your first project?**
👉 Go to: https://archiflux.github.io/BaileyISO19650Dashboard/pages/tools/workflowmax-sync.html

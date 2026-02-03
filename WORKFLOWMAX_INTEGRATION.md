# WorkflowMax Integration Guide

This document explains how to integrate your ISO19650 Dashboard with WorkflowMax for automatic project data synchronization.

## Overview

The WorkflowMax integration is **READ-ONLY** and will never modify your WorkflowMax data. It only reads project information to populate the ISO19650 dashboard, eliminating manual data entry.

## Benefits

✅ **Automatic Project Import** - No manual data entry required
✅ **ISO19650 Number Sync** - Uses your custom "ISO 19650 - Project Identifier" field
✅ **Team Member Mapping** - Automatically assigns Project Lead, Information Manager, etc.
✅ **RIBA Stage Conversion** - Maps RIBA stages to ISO19650 project phases
✅ **Custom Field Support** - Imports all your custom fields (Site Address, BSR Number, etc.)
✅ **Always Up-to-Date** - Re-sync projects anytime to get latest data
✅ **Secure** - Uses OAuth 2.0 with PKCE for secure authorization

## What Gets Imported

From your WorkflowMax projects, the following data is automatically imported:

### Basic Information
- **Project Name** → Job Name
- **Project Number** → Job Number
- **Client Name** → Client Name
- **Description** → Job Description
- **Start Date** → Job Start Date
- **Project Value** → Budget or Works Value custom field

### ISO19650 Specific
- **ISO Number** → "ISO 19650 - Project Identifier" custom field
- **Information Manager** → "Information Manager" custom field
- **ACC Link** → "ACC Link" custom field

### Custom Fields
All your custom fields are preserved including:
- Site Address
- BSR Registration Number
- Responsible Person (RRO)
- Building Height
- Number of Properties
- Principal Accountable Person
- RIBA Stage (Current)
- Framework Appointed (Under)
- Project Sector
- Architectural Lead
- Principal Designer (CDM)
- Principal Designer (BSA)
- Contract Type
- Contractor
- Funder
- And many more...

### Automatic Mapping
- **RIBA Stage** → ISO19650 Project Phase
  - RIBA 0-1 → Tender/Appointment
  - RIBA 2-4 → Mobilisation/Production
  - RIBA 5-6 → Delivery/Close-out

- **Framework Appointed** → Bailey Role
  - Lead/Principal → Lead Appointed Party
  - Consultant → Consultant
  - Other → Appointed Party

## Setup Instructions

### Step 1: Create OAuth App in WorkflowMax

1. Log into your WorkflowMax account
2. Navigate to: **Settings → Apps → My Apps**
3. Click **"Create New App"**
4. Fill in the following details:

| Field | Value |
|-------|-------|
| **App Name** | `BP ISO19650 Dashboard` |
| **Company/Application URL** | `https://archiflux.github.io/BaileyISO19650Dashboard` |
| **Redirect URI** | `https://archiflux.github.io/BaileyISO19650Dashboard/oauth-callback.html` |
| **Scopes** | `workflowmax` (Read-only access) |

5. Click **"Save"** or **"Create"**
6. WorkflowMax will display your **Client ID** and **Client Secret**
7. **Copy these values** - you'll need them in the next step

> **Important:** The Redirect URI must match exactly as shown above, including the `/oauth-callback.html` path.

### Step 2: Connect Dashboard to WorkflowMax

1. In your ISO19650 Dashboard, go to **Project Management → WorkflowMax Sync**
2. In the "Setup" section, enter your OAuth credentials:
   - **Client ID**: Paste the Client ID from WorkflowMax
   - **Client Secret**: (Optional - can be left blank if using PKCE flow)
3. Click **"Connect to WorkflowMax"**
4. You'll be redirected to WorkflowMax login page
5. **Log in** with your WorkflowMax credentials
6. **Authorize** the app to access your WorkflowMax data (read-only)
7. You'll be redirected back to the dashboard
8. Connection is complete! ✓

### Step 3: Sync Your Projects

1. Once connected, you'll see a list of all active WorkflowMax projects
2. Click **"Sync Projects Now"** to import all active projects, or
3. Click **"Import"** next to individual projects to import them one by one
4. Projects will appear in the "Synced Projects" section
5. You can view them in **Active Projects** page

## Usage

### Initial Sync
After connecting, sync all your active projects to populate the dashboard with existing project data.

### Re-Sync Projects
You can re-sync projects anytime to update them with the latest WorkflowMax data:
- Go to **WorkflowMax Sync → Synced Projects**
- Click **"Re-sync"** on any project
- Or click **"Sync Projects Now"** to update all projects

### View Synced Projects
All synced projects are tagged with `source: WorkflowMax` and display:
- Last synced timestamp
- WorkflowMax Job Number
- Full project details with all custom fields

## Data Flow

```
WorkflowMax
    ↓ (Read-only OAuth)
ISO19650 Dashboard
    ↓ (LocalStorage)
Browser Database
```

1. **WorkflowMax** stores your master project data
2. **OAuth Connection** provides read-only access
3. **Dashboard** imports and maps the data
4. **Browser Database** stores a local copy for offline access
5. **Re-sync** updates the local copy with latest WorkflowMax data

## Security & Privacy

### Read-Only Access
- The integration uses OAuth 2.0 with **read-only** scopes
- It **cannot** create, update, or delete WorkflowMax data
- It can **only** read project information

### Data Storage
- OAuth tokens are stored in browser LocalStorage
- All project data is stored locally in your browser
- No data is sent to any third-party servers
- The connection is between your browser and WorkflowMax only

### Token Management
- Access tokens expire after a set period (usually 30-60 minutes)
- Refresh tokens allow automatic re-authentication
- You can disconnect and clear all tokens anytime

### PKCE (Proof Key for Code Exchange)
- Uses PKCE extension for enhanced security
- Protects against authorization code interception
- Recommended for browser-based applications

## Troubleshooting

### "Authorization Failed" Error
**Cause:** OAuth credentials may be incorrect or expired

**Solution:**
1. Double-check your Client ID
2. Make sure the Redirect URI matches exactly
3. Verify the app is enabled in WorkflowMax
4. Try disconnecting and reconnecting

### "CORS Error" or "Token Exchange Failed"
**Cause:** Browser security restrictions on token exchange

**Solution:**
This is a known limitation of client-side OAuth. You have two options:

1. **Use a Serverless Proxy** (Recommended):
   - Deploy a simple serverless function (AWS Lambda, Vercel, Netlify Functions)
   - Proxy the token exchange request through the function
   - This avoids CORS restrictions

2. **Manual Token Entry**:
   - Complete OAuth flow in WorkflowMax directly
   - Manually copy the access token
   - Enter it in the dashboard settings

### "No Projects Found"
**Cause:** No projects with "In Progress" status

**Solution:**
- Check that you have projects with "In Progress" status in WorkflowMax
- Update project statuses in WorkflowMax if needed
- The sync only imports active projects

### Custom Fields Not Appearing
**Cause:** Field names may have changed in WorkflowMax

**Solution:**
- Check that your custom field names match exactly
- The integration looks for specific field names (e.g., "ISO 19650 - Project Identifier")
- Update field names in WorkflowMax or contact support for custom mapping

## Limitations

1. **Active Projects Only**: Only imports projects with "In Progress" status
2. **Manual Re-Sync**: Changes in WorkflowMax require manual re-sync
3. **Browser-Specific**: Connection and data are browser-specific
4. **No Webhooks**: Real-time updates not supported (requires manual sync)
5. **CORS Restrictions**: Token exchange may require serverless proxy

## Best Practices

1. **Regular Syncs**: Sync projects regularly (weekly or when project data changes)
2. **Backup Data**: Use the Export feature to backup your synced projects
3. **Clean Naming**: Use consistent naming in WorkflowMax for better import
4. **ISO Numbers**: Always fill in "ISO 19650 - Project Identifier" field in WorkflowMax
5. **Team Assignment**: Assign Information Manager in WorkflowMax for automatic mapping

## Field Mapping Reference

| WorkflowMax Field | Dashboard Field | Notes |
|-------------------|-----------------|-------|
| Job Name | Project Name | Direct mapping |
| Job Number | Project Number | Direct mapping |
| Client Name | Client Name | Direct mapping |
| Description | Project Description | Direct mapping |
| Start Date | Project Start Date | Date format preserved |
| Budget | Project Value | Numeric value |
| Manager | Project Lead | Person name |
| Status | Project Status | Mapped to phase |
| **Custom: ISO 19650 - Project Identifier** | **ISO Number** | **Primary identifier** |
| **Custom: Information Manager** | **BIM Manager** | Team assignment |
| **Custom: RIBA Stage (Current)** | **Project Phase** | Automatically mapped |
| **Custom: Framework Appointed (Under)** | **Bailey Role** | Automatically mapped |
| Custom: Site Address | Project Location | Text field |
| Custom: ACC Link | CDE Link | URL |
| (All other custom fields) | customFields object | Preserved for reference |

## Support

If you encounter issues with the WorkflowMax integration:

1. Check this guide for troubleshooting steps
2. Verify your OAuth app settings in WorkflowMax
3. Check browser console for error messages (F12)
4. Try disconnecting and reconnecting
5. Contact IT support if issues persist

## Future Enhancements

Potential future improvements:
- [ ] Real-time sync via webhooks
- [ ] Bi-directional sync (write back to WorkflowMax)
- [ ] Custom field mapping configuration
- [ ] Batch sync scheduling
- [ ] Integration with other project management systems

---

**Version**: 1.0
**Last Updated**: February 2025
**Integration Type**: Read-Only OAuth 2.0

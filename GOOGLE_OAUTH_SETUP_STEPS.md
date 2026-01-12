# Google OAuth Setup - Step by Step (Hindi)

## Problem
Error: `401: deleted_client` — purana OAuth client delete ho gaya hai Google Cloud me

## Solution: Naya OAuth Client Banao

### Step 1: Google Cloud Console Open Karo
1. Ye link open karo: https://console.cloud.google.com/
2. Apna Google account se login karo
3. Agar pehli baar hai, toh **"Terms of Service"** accept karo

### Step 2: Project Select/Create Karo
1. Top bar me **project selector** click karo
2. Ya toh existing project select karo, ya **"NEW PROJECT"** button se naya banao
3. Project name do (e.g., "Calculator Loop") aur **CREATE** click karo

### Step 3: OAuth Consent Screen Configure Karo
1. Left menu me **"APIs & Services" → "OAuth consent screen"** click karo
2. **User Type**: **External** select karo → **CREATE** button click karo
3. **App information** fill karo:
   - App name: `Calculator Loop` (ya koi bhi naam)
   - User support email: Apna email
   - Developer contact: Apna email
4. **SAVE AND CONTINUE** click karo
5. **Scopes** page: Skip kar do (optional) → **SAVE AND CONTINUE**
6. **Test users**: Skip kar do → **SAVE AND CONTINUE**
7. **Summary** page: **BACK TO DASHBOARD** click karo

### Step 4: OAuth Client ID Banao (IMPORTANT!)
1. Left menu me **"APIs & Services" → "Credentials"** click karo
2. Top me **"+ CREATE CREDENTIALS"** button click karo
3. **"OAuth client ID"** select karo
4. **Application type**: **Web application** select karo
5. **Name**: Koi naam do (e.g., "Calculator Loop Web Client")
6. **Authorized JavaScript origins** me add karo:
   ```
  https://calculatorloop.com
   ```
7. **Authorized redirect URIs** me add karo (ZARURI!):
   ```
     https://calculatorloop.com/api/auth/callback/google
     
   ```
   - **Note**: Ye `/api/auth/callback/google` path bilkul exact hona chahiye!
8. **CREATE** button click karo

### Step 5: Credentials Copy Karo
1. Dialog box me **Client ID** aur **Client Secret** dikhega
2. Dono ko copy karo aur safe jagah save karo
3. Example:
   ```
   Client ID: 123456789-abc123def456.apps.googleusercontent.com
   Client Secret: GOCSPX-xxxxxxxxxxxxxxx
   ```

### Step 6: .env File Me Update Karo
1. VS Code me `.env` file open karo
2. Ye lines dhundo:
   ```env
   GOOGLE_CLIENT_ID="..."
   GOOGLE_CLIENT_SECRET="..."
   ```
3. Naye credentials paste karo:
   ```env
   GOOGLE_CLIENT_ID="YOUR_NEW_CLIENT_ID_HERE"
   GOOGLE_CLIENT_SECRET="YOUR_NEW_CLIENT_SECRET_HERE"
   ```
4. File save karo (Ctrl+S)

### Step 7: Dev Server Restart Karo
1. Terminal me Ctrl+C dabake purana server stop karo
2. Phir run karo:
   ```bash
   npm run dev
   ```
3. Wait karo jab tak "Ready" na dikhe

### Step 8: Test Karo
1. Browser me jao: http://localhost:3000/login
2. **"Google"** button click karo
3. Apna Google account select karo
4. **"Allow"** / **"Continue"** button click karo
5. Successfully login hona chahiye! ✅

---

## Troubleshooting

### Agar phir bhi error aaye:

**Error: redirect_uri_mismatch**
- Google Cloud Console me **Authorized redirect URIs** check karo
- Exactly ye hona chahiye: `http://localhost:3000/api/auth/callback/google`
- Case-sensitive hai, spacing check karo

**Error: deleted_client (phir se)**
- Step 4 me **NAYA** OAuth client banaya ya purana edit kiya?
- Purana delete karke **bilkul fresh** banao

**Google button disabled hai UI me**
- `.env` file check karo ki `GOOGLE_CLIENT_ID` aur `GOOGLE_CLIENT_SECRET` dono filled hain
- Server restart karo (`npm run dev`)

---

## Production Deployment Ke Liye (Baad Me)

Jab production me deploy karo (e.g., Vercel), toh:
1. Google Cloud Console me wapas jao
2. **Authorized redirect URIs** me production URL add karo:
   ```
   https://yourdomain.com/api/auth/callback/google
   ```
3. Production environment me bhi `GOOGLE_CLIENT_ID` aur `GOOGLE_CLIENT_SECRET` set karo

---

## Support

Agar koi step samajh nahi aaye, toh screenshot bhejo ya specific error message bolo!

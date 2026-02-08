# Google Cloud SQL Setup Guide

Great! You are on the Google Cloud SQL Dashboard. Follow these steps to get your `DATABASE_URL`:

## 1. Get Public IP
1. Click on the instance ID **`calculatorloop`**.
2. On the **Overview** page, look for **"Connect to this instance"**.
3. Copy the **Public IP address** (e.g., `34.xxx.xxx.xxx`).

## 2. Get Database Name
1. Go to the **Databases** tab (left menu).
2. Note the database name. It is likely `postgres` (default) or `calculator_loop` if you created one.

## 3. Get User & Password
1. Go to the **Users** tab (left menu).
2. Note the username (usually `postgres`).
3. If you don't know the password:
   - Click the **3 dots** next to the user.
   - Select **Change password**.
   - Set a new password and note it down.

## 4. Allow Connection (Crucial!)
1. Go to **Connections** (left menu).
2. Click the **Networking** tab.
3. Scroll to **Authorized networks**.
4. Click **Add Network**.
5. **Name**: `My PC`.
6. **Network**: Search "what is my ip" on Google. Copy that IP and paste it here.
7. Click **Done** and then **Save**.

## 5. Construct URL
Combine the info into this format:
```
postgresql://USER:PASSWORD@PUBLIC_IP:5432/DATABASE_NAME
```

**Example:**
`postgresql://postgres:MySecurePass123@34.123.45.67:5432/postgres`

## Next Step
Copy this URL and paste it into your `.env` file as `DATABASE_URL`.

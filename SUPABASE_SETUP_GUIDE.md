# Supabase Setup Guide

Since you want to switch to Supabase, here are the steps to get your **Connection String**:

## 1. Create Project
1. Go to [supabase.com](https://supabase.com) and log in.
2. Click **"New Project"**.
3. Choose your organization.
4. **Name**: `calculator-loop` (or anything you like).
5. **Database Password**: **IMPORTANT** - Create a strong password and **COPY IT** immediately. You'll need it for the URL.
6. **Region**: Choose one close to you (e.g., Mumbai, Singapore).
7. Click **"Create new project"**.

## 2. Get Connection String
1. Wait a moment for the project to set up.
2. Go to **Project Settings** (Gear icon at the bottom left).
3. Click on **Database** in the side menu.
4. Scroll down to **Connection parameters** / **Connection string**.
5. Click on the **URI** tab.
6. Make sure **"Mode: Transaction"** (6543) is selected (or "Session" 5432, usually Prisma uses Session mode properly with `directUrl`).
   - *Actually, for Prisma with Next.js on Vercel, we ideally want the Session pool (5432) for the direct connection and Transaction pool (6543) for the pooled connection, but for now let's just get the standard Session connection string.*
   - **Simpler Step:** Copy the String that looks like:
     `postgresql://postgres.xxxx:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres`
   - *Replace `[YOUR-PASSWORD]` with the password you set in Step 1.*

## 3. Provide Details
Please provide the full **Connection String**.

It should look something like:
`postgresql://postgres.vtwxyz:mypassword@aws-0-ap-south-1.pooler.supabase.com:5432/postgres`

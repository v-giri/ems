# Comprehensive Setup & Deployment Guide for EMS

This guide will walk you through setting up the Employee Management System (EMS) project entirely from scratch, obtaining the necessary third-party API keys, running the project locally, and finally deploying it to the internet using Vercel.

---

## Part 1: Prerequisites

Before you begin, ensure you have the following installed on your machine:

1. **Node.js**: Download and install Node.js (v18 or higher recommended) from [nodejs.org](https://nodejs.org/).
2. **Git**: Download and install Git from [git-scm.com](https://git-scm.com/).
3. **Code Editor**: A code editor like [Visual Studio Code](https://code.visualstudio.com/) (VS Code).

---

## Part 2: Project Setup locally

1. **Clone the Project Repository**
   Open your terminal (or command prompt) and run:
   ```bash
   git clone <your-github-repo-url>
   cd EMS
   ```
   *(If you don't have it on GitHub yet, just open the EMS folder in your terminal).*

2. **Install Dependencies**
   Run the following command in the `EMS` folder to install all required packages:
   ```bash
   npm install
   ```
   *Note: This might take a minute or two.*

3. **Create the Environment Variables File**
   In the root of your `EMS` folder, you will see a file named `.env.example`. 
   Create a new file in the same location and name it exactly `.env`.

---

## Part 3: Getting Your API Keys & Connection Strings

To make the app work, we need a Database, Authentication Secret, and File Upload keys.

### A. Neon Database (PostgreSQL) Setup
Neon is a serverless Postgres provider that works perfectly with Vercel and Prisma.

1. **Sign Up / Log In**
   - Go to [neon.tech](https://neon.tech/) and create a free account (you can sign up with GitHub or Google).
2. **Create a New Project**
   - Once logged in, click the **"New Project"** button.
   - **Name:** Enter a name for your project (e.g., `ems-database`).
   - **Postgres Version:** Leave it as the default (usually 15 or 16).
   - **Region:** Select the region closest to where you will deploy your Vercel app (e.g., `US East (N. Virginia)` or `Europe (Frankfurt)`).
   - Click **"Create Project"**.
3. **Get Your Connection String**
   - After creation, you will be taken to your project dashboard.
   - Look for the **"Connection Details"** widget on the main dashboard page.
   - In the dropdown menu, make sure **"Node.js"** or **"Prisma"** is selected.
   - Check the box that says **"Pooled connection"** (this is highly recommended for serverless environments like Vercel).
   - Click the **"Copy"** icon next to the connection string. It will look something like this:
     `postgresql://neondb_owner:YOUR_PASSWORD@ep-cold-shadow-123456.us-east-2.aws.neon.tech/neondb?sslmode=require`
4. **Add to your Environment Variable**
   - Open your `.env` file in VS Code.
   - Paste the connection string you just copied as the value for `DATABASE_URL`:
   ```env
   DATABASE_URL="postgresql://neondb_owner:YOUR_PASSWORD@ep-cold-shadow-123456.us-east-2.aws.neon.tech/neondb?sslmode=require"
   ```

### B. NextAuth Configuration
NextAuth needs a secret key to encrypt browser cookies and tokens securely.
1. Open your terminal and run this command to generate a random secret:
   ```bash
   openssl rand -base64 32
   ```
2. Copy the output and paste it into your `.env` file:
   ```env
   NEXTAUTH_SECRET="the_random_string_you_generated"
   NEXTAUTH_URL="http://localhost:3000"
   ```

### C. UploadThing (File Uploads for Documents)
1. Go to [uploadthing.com](https://uploadthing.com/) and log in (usually with GitHub).
2. Create a new App/Project.
3. Navigate to the **API Keys** section in your UploadThing dashboard.
4. Copy your Secret and App ID, and add them to your `.env` file:
   ```env
   UPLOADTHING_SECRET="sk_live_xxxxxx"
   UPLOADTHING_APP_ID="xxxxxx"
   ```

**Your `.env` file should now look exactly like this (but with actual values):**
```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="base64-random-string"
NEXTAUTH_URL="http://localhost:3000"
UPLOADTHING_SECRET="sk_live_..."
UPLOADTHING_APP_ID="..."
```

---

## Part 4: Database Migrations & Initial Data

Now that the app can connect to the database, we need to create the tables and add an Admin user.

1. **Push the Schema to the Database**
   This command reads the `prisma/schema.prisma` file and creates the required tables in your Neon database.
   ```bash
   npx prisma db push
   ```

2. **Seed the Database (Create an Admin)**
   Run the seed script to automatically create an initial administrator account.
   ```bash
   npm run prisma.seed
   ```
   *The default admin account created will be:*
   * **Email:** `admin@ems.com`
   * **Password:** `admin123`

---

## Part 5: Running the App Locally

Start your local development server:
```bash
npm run dev
```

1. Open your web browser and go to `http://localhost:3000`.
2. You will be redirected to the `/login` page.
3. Login using `admin@ems.com` and `admin123`.
4. You should now see the Admin Dashboard! You can start creating employee accounts from the "Employees" tab.

---

## Part 6: Deployment to Vercel (Going Live)

When you are ready to show your final year project to the world, use Vercel for free hosting.

### Step A: Push code to GitHub
If your code isn't on GitHub yet:
1. Go to [GitHub](https://github.com/) and create a new repository (name it `EMS`).
2. Run these commands in your local `EMS` terminal:
   ```bash
   git add .
   git commit -m "Initial commit for Vercel deployment"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

### Step B: Connect to Vercel
1. Go to [vercel.com](https://vercel.com/) and sign in with GitHub.
2. Click **Add New...** -> **Project**.
3. Import your `EMS` GitHub repository.
4. Leave the Framework Preset as `Next.js`.

### Step C: Add Environment Variables in Vercel
Before clicking "Deploy", open the **Environment Variables** section.
Add every variable from your `.env` file exactly as they are named.

* `DATABASE_URL` -> Value
* `NEXTAUTH_SECRET` -> Value
* `UPLOADTHING_SECRET` -> Value
* `UPLOADTHING_APP_ID` -> Value
* `NEXTAUTH_URL` -> Wait! Instead of `http://localhost:3000`, Vercel provides dynamic URLs. For NextAuth on Vercel, **you can actually skip adding `NEXTAUTH_URL` ENTIRELY.** Vercel auto-configures it! Keep `NEXTAUTH_URL` *out* of your Vercel variables.

### Step D: Deploy
1. Click **Deploy**.
2. Vercel will install dependencies, run the `npm run build` command, and publish your site.
3. In about 2-3 minutes, your site will be live! Vercel will give you a live URL (e.g., `https://ems-project.vercel.app`).

### Step E: Update NextAuth URL (Optional, but safe)
If you ever buy a custom domain (like `my-ems.com`), you must define `NEXTAUTH_URL` exactly as `https://my-ems.com` in your Vercel Environment Variables.

---
**🎉 Congratulations! Your Employee Management System is fully operational and deployed!**

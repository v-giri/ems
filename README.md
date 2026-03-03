# Employee Management System (EMS)

A comprehensive Employee Management System built as a final-year college project. This application provides strict Role-Based Access Control (RBAC) to separate Admin functionalities from Employee features.

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router) with TypeScript
- **Styling:** Tailwind CSS & Shadcn UI
- **Database:** PostgreSQL (Hosted on Neon.tech)
- **ORM:** Prisma
- **Authentication:** NextAuth.js (Auth.js) using JWT and Bcrypt
- **File Storage:** UploadThing (for document uploads)

## 🌟 Features

### Admin Role
- **Dashboard:** Overview of system activity.
- **Employees:** Full CRUD capabilities for employee records.
- **Leave Requests:** Approve or reject pending employee leaves.
- **Tasks:** Assign new tasks to employees and track their status.
- **Payroll:** Generate payslips and mark them as paid.
- **Documents:** Securely upload files (PDF, DOCX) and assign them to specific employees.

### Employee Role
- **Dashboard:** Personal overview and quick check-in actions.
- **Attendance:** Record daily Check-In and Check-Out times.
- **Leave Requests:** Submit new leave requests and track their status.
- **Tasks:** View assigned tasks and update their progress (TODO -> IN_PROGRESS -> DONE).
- **Payroll:** View historical payslips.

## 📦 Local Setup Instructions

Follow these steps to run the project locally for evaluation:

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd EMS
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory based on `.env.example`:
   ```env
   DATABASE_URL="your_neon_postgres_connection_string"
   NEXTAUTH_SECRET="any_random_secure_string"
   NEXTAUTH_URL="http://localhost:3000"
   
   # Required for document uploads
   UPLOADTHING_SECRET="your_uploadthing_secret"
   UPLOADTHING_APP_ID="your_uploadthing_app_id"
   ```

4. **Initialize Database & Run Migrations:**
   ```bash
   npx prisma db push
   ```

5. **Seed the Database (Create initial Admin user):**
   ```bash
   npm run prisma.seed
   ```
   *Note: This creates the default admin user `admin@ems.com` with password `admin123`.*

6. **Start the Development Server:**
   ```bash
   npm run dev
   ```

7. **Access the Application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Default Credentials (for testing)

After running the seed script, you can log in with:
- **Email:** admin@ems.com
- **Password:** admin123

# Employee Management System (EMS) - User Guide

Welcome to the Employee Management System! This guide will help you understand how to use the different features of the application, depending on your assigned role.

---

## 🔐 Getting Started (Login)

1. Open the application URL in your web browser.
2. You will be greeted by the Login screen.
3. Enter your assigned **Email Address** and **Password**.
   - *If you are a new employee, your system Administrator will provide you with your initial login credentials.*
4. Click **Log In**. The system will automatically direct you to your specific dashboard based on your role (Admin or Employee).

---

## 👨‍💼 Administrator Guide

As an Administrator, you have full control over the system, employees, and their records.

### 1. The Admin Dashboard
Upon logging in, you will see a summary of the system. Use the **left sidebar** to navigate between different management tools.

### 2. Managing Employees (`/admin/employees`)
- **View:** See a list of all active employees, their departments, and salaries.
- **Add New:** Click the **"Add Employee"** button. Fill in their Name, Email, Department, initial Password, and Salary. Click Save. They can now log in using these credentials.
- **Edit:** Click the "pencil" icon next to an employee to update their details or change their password.
- **Delete:** Click the "trash or remove" icon to permanently remove an employee from the system.

### 3. Leave Requests (`/admin/leaves`)
- You will see a list of all leave requests submitted by employees.
- Review the Employee Name, Dates, and Reason.
- For requests marked as `PENDING`, click **Approve** or **Reject**. The employee will see this updated status on their dashboard.

### 4. Assigning Tasks (`/admin/tasks`)
- Click **"Assign Task"**.
- Select the Employee from the dropdown list.
- Enter a Title, Description, and Due Date.
- Click **Assign**. The task will immediately appear on that employee's task board.
- You can delete tasks the same way you delete employees if they are no longer relevant.

### 5. Managing Payroll (`/admin/payroll`)
- To generate a new payslip, click **"Process Payroll"**.
- Select the Employee (their base salary will auto-fill as a suggestion for the Net Amount, but you can change it).
- Enter the Pay Period (e.g., "October 2023").
- Click **Process**. 
- The payslip is generated with a status of `Pending`. Once you have physically paid the employee, click **"Mark Paid"** to update the record.

### 6. Document Management (`/admin/documents`)
- Use this feature to securely share important files (like tax forms, contracts, or handbooks) with specific employees.
- Click **"Upload Document"**.
- Select the Employee the document belongs to.
- Drag and drop your file (PDF or DOCX, max 4MB) into the upload box.
- The file is securely saved and can be downloaded at any time.

---

## 👩‍💻 Employee Guide

As an Employee, you have access to your personal portal to manage your daily work, requests, and view your records.

### 1. The Employee Dashboard (`/employee`)
Upon logging in, your main dashboard allows you to record your daily attendance quickly.
- **Check In:** Click this button when you start your workday. Your time is recorded.
- **Check Out:** Click this button when you finish your workday.
*Note: You can only check in and check out once per day.*

### 2. Attendance History (`/employee/attendance`)
- View a table of your daily attendance records.
- See your exact Check-in and Check-out times, and whether you were marked `PRESENT` or `ABSENT`.

### 3. Leave Requests (`/employee/leaves`)
- **Request Time Off:** Click **"New Request"**.
- Select your Start Date and End Date.
- Provide a clear Reason for the leave.
- Click **Submit**.
- The request will appear in your history as `PENDING`. Once the Administrator reviews it, the status will change to `APPROVED` or `REJECTED`.

### 4. My Tasks (`/employee/tasks`)
- View all tasks assigned to you by the Administrator, including descriptions and due dates.
- Keep the Administrator updated by changing the status of your tasks:
  - `TODO`: You haven't started yet.
  - `IN_PROGRESS`: You are actively working on it.
  - `DONE`: You have completed the task.

### 5. My Payroll (`/employee/payroll`)
- View your entire history of generated payslips.
- Check the Pay Period, Net Amount, and whether the Admin has marked it as `Paid` or `Pending`.

---

## 🚪 Logging Out
When you are finished using the system, click the **"Sign Out"** button at the bottom of the left sidebar to securely end your session.

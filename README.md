# 🚗 Vehicle Insurance Management System (VIMS)

[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/Frontend-React%20%7C%20Tailwind-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%7C%20Mongoose-emerald?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Aesthetic](https://img.shields.io/badge/UI%2FUX-Glassmorphism-orange?style=for-the-badge)](https://framer.com/)

A high-fidelity, full-stack vehicle insurance management platform built using the **MERN** stack. Designed for modern insurance providers, VIMS simulates a real-world lifecycle—from vehicle registration and policy application to premium payments and claims management.

---

## 🧠 1. Product Overview

VIMS is a dual-role digital platform that bridges the gap between vehicle owners and insurance administrators. It features a premium, animated glassmorphic interface that delivers an elite user experience while maintaining strict data integrity and secure authorization.

### 👥 User Roles
*   **👤 Customer**: Manage your fleet, apply for tailor-made insurance, make secure payments, and file incident reports (claims).
*   **🛡️ Admin**: Oversee global system health, audit transactions, manage the customer repository, and validate/approve insurance claims.

---

## ⚙️ 2. Tech Stack

### **Frontend**
- **Core**: React 18
- **Styling**: Tailwind CSS (Custom Design System)
- **Animations**: Framer Motion (Page transitions, Micro-interactions)
- **Icons**: Lucide React
- **Notifications**: SweetAlert2 (Glassmorphism Styled)
- **HTTP Client**: Axios (with Centralized Interceptors & Standardized Response Parsing)

### **Backend**
- **Runtime**: Node.js & Express
- **Database**: MongoDB (Mongoose ODM)
- **Auth**: JWT (JSON Web Tokens) stored in **httpOnly Cookies**
- **Security**: CORS, Cookie-Parser, BcryptJS
- **Logging**: Morgan & Custom NestJS-style console logger
- **File Storage**: Multer (Local storage for vehicle/incident images)

---

## 🔄 3. System Workflow

VIMS follows a strict, logical business flow to ensure financial and legal compliance:

### **A. Digital Onboarding**
1. User registers as a **Customer** or **Admin**.
2. Customers complete their profile to unlock management features.

### **B. Asset Registry**
1. Customer adds their vehicle(s) (Brand, Model, Reg Number, Photo).
2. Assets are immediately available for insurance applications.

### **C. Protection Lifecycle**
1. **Apply**: Customer selects a vehicle and coverage type (Comprehensive, Third-Party, etc.). 
2. **Pending**: Policy is created with a `pending payment` status.
3. **Pay**: Customer authorizes a digital payment. VIMS automatically generates an official **Digital Receipt**.
4. **Activate**: Upon payment success, the policy status instantly flips to `active`.

### **D. Claims Management**
1. **File**: If an incident occurs, the customer files a claim against an `active` policy, providing evidence images and justification.
2. **Review**: Admin reviews the claim in the "Incident Validation Queue".
3. **Resolve**: Admin approves or rejects the claim, updating the customer's ledger in real-time.

---

## 🎨 4. Design Philosophy (Elite UI/UX)

VIMS is built with a **Premium Dark Theme** by default (Slate/Orange/Rose palette):
- **Glassmorphism**: Translucent cards and navigation bars with backdrop blurs.
- **Dynamic Feedback**: Skeleton loaders for all data-fetching states.
- **Micro-Animations**: Hover-scaling, rotating icons, and smooth layout shifts using Framer Motion.
- **Standardized Responses**: Every API call returns a consistent structure:
  ```json
  {
    "success": true,
    "message": "Operation successful",
    "data": { ... },
    "meta": { ... }
  }
  ```

---

## 🛠️ 5. Setup & Installation

### **Prerequisites**
- Node.js (v18+)
- MongoDB (Local or Atlas)
- pnpm / npm / yarn

### **Backend Setup**
1. Navigate to `/backend`.
2. Install dependencies: `pnpm install`
3. Create a `.env` file:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_super_secret_key
   ```
4. Start the server: `pnpm start`

### **Frontend Setup**
1. Navigate to `/frontend`.
2. Install dependencies: `pnpm install`
3. Start the dev server: `pnpm start`
4. Access via: `http://localhost:3000`

---

## 🧾 6. Documentation & Standardized Logging

VIMS features a **NestJS-style Backend Logger** for senior-grade debugging:
- `🛰️ 11:45:00 PM [GET] /api/insurance - 200 (15ms)`
- `✅ [API-Response] Message: Policies fetched successfully`

---

### **🛡️ Security Notice**
JWTs are stored in `httpOnly` cookies to mitigate XSS attacks. All sensitive customer paths are protected by the `protect` middleware, ensuring that data is served only to authenticated owners.

---

**Built with ❤️ and Precision.**
*Stay Safe, Stay Insured.*

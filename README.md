# 🚀 Dotix Job Scheduler & Automation Engine

A high-performance mini automation engine built for **Dotix Technologies**.
This system allows users to create, schedule, execute, and monitor background jobs with real-time status updates and automated outbound webhook notifications.

---

## 🌐 Live Deployment URLs

* **GitHub Repository:**
  [https://github.com/Saichandanyadav/chandan-system-job-scheduler](https://github.com/Saichandanyadav/chandan-system-job-scheduler)

* **Backend API (Production):**
  [https://chandan-system-job-scheduler-production.up.railway.app/api/jobs](https://chandan-system-job-scheduler-production.up.railway.app/api/jobs)

* **Frontend Application (Production):**
  [https://chandan-system-job-scheduler.vercel.app/](https://chandan-system-job-scheduler.vercel.app/)

---

## 📂 Project Directory Layout

```text
/dotix-automation-system
├── /backend
│   ├── /config
│   ├── /controllers
│   ├── /models
│   ├── /routes
│   ├── index.js
│   ├── .env
│   └── package.json
├── /frontend
│   ├── /app
│   ├── /components
│   ├── /lib
│   ├── .env.local
│   └── package.json
└── README.md
```

---

## 🛠️ Tech Stack

### Frontend

* Next.js 14 (App Router)
* Tailwind CSS
* Shadcn UI + Lucide Icons
* React Hooks (`useState`, `useEffect`)
* TypeScript

### Backend

* Node.js
* Express.js
* Sequelize ORM
* Axios (Outbound Webhooks)

### Database

* MySQL

---

## 🏗️ Architecture & Execution Flow

The system follows an **Event-Driven Asynchronous Architecture**:

1. **Job Creation**
   User creates a task → saved with `pending` status.

2. **Job Execution**
   Clicking **Run** updates status to `running`.

3. **Simulated Processing**
   Backend simulates workload using a 3-second `setTimeout`.

4. **Completion & Webhook Trigger**
   Status updates to `completed`, and an outbound `POST` request is sent to the configured webhook URL.

---

## 📊 Database Schema

| Field       | Type     | Attributes                          |
| ----------- | -------- | ----------------------------------- |
| `id`        | Integer  | Primary Key, Auto Increment         |
| `taskName`  | String   | Required                            |
| `payload`   | JSON     | Required                            |
| `priority`  | Enum     | Low, Medium, High                   |
| `status`    | Enum     | pending, running, completed, failed |
| `createdAt` | DateTime | Auto-generated                      |
| `updatedAt` | DateTime | Auto-generated                      |

---

## 🔌 API Documentation

### Job Management APIs

* `POST /api/jobs`
  Creates a new job.

* `GET /api/jobs`
  Fetches all jobs.
  Supports filters: `?status=pending&priority=High`

* `GET /api/jobs/:id`
  Fetches job details by ID.

### Job Execution API

* `POST /api/run-job/:id`
  Executes a job and triggers webhook on completion.

---

## 🪝 Webhook Integration

Once a job reaches `completed` status, the backend automatically fires a webhook.

**Sample Webhook Payload:**

```json
{
  "jobId": 8,
  "taskName": "send email",
  "priority": "Medium",
  "payload": {
    "email": "user@example.com",
    "name": "Client_01",
    "action": "sync"
  },
  "completedAt": "2026-01-08T09:24:50.167Z"
}
```

Webhook testing is performed using **webhook.site** for real-time verification.

---

## ⚙️ Local Setup Instructions

### Database Setup

* Ensure MySQL is running
* Create database: `job_scheduler_db`

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
PORT=5000
DB_NAME=job_scheduler_db
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=3306
WEBHOOK_URL=https://webhook.site/<your-id>
```

Run backend:

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Run frontend:

```bash
npm run dev
```

---

## 🤖 AI Usage Disclosure

AI assistance was used to improve system architecture, backend logic, and documentation clarity.

* **AI Tool Used:** Gemini
* **Model:** Gemini 2.0 Flash

### Assisted Areas:

* Asynchronous job execution logic
* Sequelize + MySQL data modeling
* Error handling and production readiness
* API documentation structuring
* UI workflow optimizations

---

## ✅ Key Features Implemented

* Job creation and management
* Priority-based scheduling
* Real-time status updates
* Webhook automation
* Backend simulation engine
* Production deployment (Railway + Vercel)
* Responsive UI with modern design
* Clean architecture and scalable structure

---

## 👨‍💻 Developer Details

**Name:** Sai Chandan Gundaboina
**Role:** Full Stack Developer

* **GitHub:** [https://github.com/Saichandanyadav](https://github.com/Saichandanyadav)
* **LinkedIn:** [https://www.linkedin.com/in/saichandanyadav/](https://www.linkedin.com/in/saichandanyadav/)
* **Email:** [saichandhanyadav2002@gmail.com](mailto:saichandhanyadav2002@gmail.com)

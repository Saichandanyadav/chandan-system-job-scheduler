# 🚀 Dotix Job Scheduler & Automation Engine

A high-performance mini-automation engine built for Dotix Technologies. This system allows users to create, schedule, and monitor background tasks with real-time status updates and automated outbound webhook notifications.

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
````

---

## 🛠️ Tech Stack

### Frontend

* Next.js 14 (App Router)
* Tailwind CSS
* Shadcn UI + Lucide Icons
* React Hooks (useState, useEffect)
* TypeScript

### Backend

* Node.js
* Express.js
* Sequelize (MySQL)
* Axios (for outbound webhooks)

### Database

* MySQL

---

## 🏗️ Architecture & Logic

The system follows an **Event-Driven Asynchronous Pattern**:

1. Job Creation: User submits a task, saved with `pending` status.
2. Job Execution: Clicking "Run" sets status to `running`.
3. Simulated Processing: Backend uses a 3-second `setTimeout` to mimic workload.
4. Completion & Webhook: Status becomes `completed` and an outbound `POST` request is triggered to the configured Webhook URL.

---

## 📊 Database Schema

| Field       | Type     | Attributes                                  |
| ----------- | -------- | ------------------------------------------- |
| `id`        | Integer  | Primary Key, Auto-Increment                 |
| `taskName`  | String   | Not Null                                    |
| `payload`   | JSON     | Not Null                                    |
| `priority`  | Enum     | 'Low', 'Medium', 'High'                     |
| `status`    | Enum     | 'pending', 'running', 'completed', 'failed' |
| `createdAt` | DateTime | Auto-generated                              |
| `updatedAt` | DateTime | Auto-generated                              |

---

## 🔌 API Documentation

### Job Management

* `POST /api/jobs` — Creates a new job.
* `GET /api/jobs` — Lists all jobs. Query params: `?status=pending&priority=High`.
* `GET /api/jobs/:id` — Returns specific job details.

### Job Runner

* `POST /api/run-job/:id` — Triggers status transition and webhook.

---

## 🪝 Webhook Integration

When a job reaches `completed`, the backend triggers a `POST` request to `WEBHOOK_URL`.

**Payload:**

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

---

## ⚙️ Setup Instructions

### Database

Ensure MySQL is running and create a database `job_scheduler_db`.

### Backend

```bash
cd backend
npm install
# Add .env with:
# PORT=5000
# DB_NAME=job_scheduler_db
# DB_USER=root
# DB_PASSWORD=
# DB_HOST=
# DB_PORT=
# WEBHOOK_URL=https://webhook.site/<your-id>
npm run dev
```

### Frontend

```bash
cd frontend
npm install
# Add .env.local with:
# NEXT_PUBLIC_API_URL=http://localhost:5000/api
npm run dev
```

---

## 🤖 AI Usage Log

AI assistance was used to refine architectural patterns, optimize backend logic, and ensure strict TypeScript typing.

* **AI Tools Used:** Gemini
* **Model Name:** Gemini 2.0 Flash
* **Assisted With:**

  * Background task runner async logic
  * Sequelize → TypeScript interface mapping
  * Error handling improvements
  * Dashboard UI refinements

**Prompts Examples:**

1. Define strict TypeScript interfaces for Job entities compatible with Sequelize JSON.
2. Optimize Express job runner async state transitions for webhook reliability.
3. Review Sequelize/MySQL config for production readiness.
4. Generate structured technical documentation including API endpoints and webhook payloads.

---

## ✅ Key Features Implemented

* Job creation, listing, and detail view.
* Real-time job status updates.
* Priority and status filters.
* Job execution simulation.
* Webhook integration and logging.
* Responsive and clean UI using Tailwind + Shadcn UI.
* Backend production-readiness with environment configs and error handling.

---

## 👨‍💻 Developer Details

**Name:** Sai Chandan Gundaboina
**Role:** Full Stack Developer
**GitHub:** [https://github.com/Saichandanyadav](https://github.com/Saichandanyadav)
**LinkedIn:** [https://www.linkedin.com/in/saichandanyadav/](https://www.linkedin.com/in/Saichandanyadav/)
**Email:** [saichandhanyadav2002@gmail.com](mailto:saichandhanyadav2002@gmail.com)

```

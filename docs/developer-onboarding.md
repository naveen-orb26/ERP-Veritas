# 📄 **ERP-Veritas – Developer Onboarding Guide (Minimal Version)**

This document provides a simple, high-level checklist to set up and run ERP-Veritas in a local development environment.

Since the project is currently developed solo, this guide includes only the essentials.
As the project grows, more details can be added.

---

# 1. Prerequisites (Software to Install)

Install the following tools on your development machine:

### **Core Tools**

* Python (recommended: latest stable 3.x)
* PostgreSQL database
* Node.js + npm (for frontend, later)
* Git (for version control)

### **Useful Apps (Optional but Recommended)**

* VS Code or any code editor
* pgAdmin or TablePlus (PostgreSQL GUI)
* Postman / Thunder Client (API testing)
* Docker Desktop (for future LAN/cloud setups)

---

# 2. Cloning the Repository

To get the project:

* Clone the GitHub repo: **ERP-Veritas**
* Ensure you are on the `main` branch for the latest stable version

---

# 3. Project Folder Structure Overview

After cloning, the repository looks like:

```
ERP-Veritas/
│
├── backend/                ← Django backend (empty for now)
├── frontend/               ← React frontend (planned)
├── docs/                   ← Documentation
├── infra/                  ← Deployment templates (later)
├── sample-data/            ← Testing datasets (later)
├── scripts/                ← Utility scripts (later)
│
├── .env.example            ← Environment variable list
└── README.md               ← Project overview
```

---

# 4. Environment Variables

All configuration values must be stored in a `.env` file.

An example is provided at:

```
.env.example
```

Copy it to `.env` and fill the required values when backend setup begins.

---

# 5. Setting Up the Backend (High-Level Only)

Actual backend setup instructions will be added once development starts.

General steps will include:

1. Create a Python virtual environment
2. Install backend dependencies
3. Set environment variables
4. Run database migrations
5. Start the development server

Detailed commands will be added later during backend initialization.

---

# 6. Setting Up the Frontend (Later)

The frontend folder is reserved for the React web application.

Later steps will include:

1. Installing node modules
2. Running the frontend dev server
3. Connecting frontend to backend API

This section will be filled when frontend development begins.

---

# 7. Development Workflow

* Use **feature branches** for any new work
* Commit changes locally
* Push feature branches to GitHub
* Merge into `main` when stable

Branch naming:

```
feature/<yourname>/<task>
fix/<yourname>/<bug>
```

---

# 8. Updating Documentation

Any change to:

* API endpoints
* Database schema
* Architecture
* Process flows

must be reflected in `/docs`.

We will update documentation as development progresses.

---

Here is the **exact paragraph** you should add at the **bottom of**:

```
docs/developer-onboarding.md
```

You can paste this as a new section titled **“Documentation Update Policy”**.

---

# 📘 **Documentation Update Policy**

To keep ERP-Veritas consistent and maintainable, all design or code changes that affect documentation must be updated immediately. This includes changes to:

* API endpoints
* Database schema or model attributes
* ER diagrams
* New modules or components
* Changes to architecture
* Naming conventions
* Any workflow or business logic that affects documentation

**Whenever such a change occurs, ChatGPT will explicitly notify the developer using this format:**

```
DOCS UPDATE — <file>
Reason: <why the file needs updating>
Suggested update: <short description of what to add or edit>
```

The developer must then update the corresponding file in `/docs` before continuing with new development.

This ensures the documentation stays accurate, aligned with the codebase, and easy for future contributors to understand.

---

# ✔ END OF MINIMAL ONBOARDING GUIDE

---


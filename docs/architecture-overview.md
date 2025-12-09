
# ⭐ **2️⃣ Architecture Overview**


This document explains **how the system is structured**, how backend, frontend, DB, storage, and network interact.
It is NOT technical code — it’s conceptual architecture and diagrams in text.

---

# 📄 **ERP-Veritas – Architecture Overview**

ERP-Veritas is a modular ERP system built to support:

* Local development
* LAN/Wi-Fi deployment
* Future migration to cloud (AWS)
* Future mobile app integration

The architecture is designed to be clean, layered, and scalable.

---

# 1. High-Level Architecture Diagram (Text Version)

```
                        ┌───────────────────────┐
                        │       Frontend         │
                        │    (React Web App)     │
                        └─────────────▲──────────┘
                                      │ HTTPS/REST API
                                      │
                        ┌─────────────┴──────────┐
                        │        Backend          │
                        │ Django + DRF (API Layer)│
                        │                         │
                        │  11 Independent Modules │
                        └─────────────▲──────────┘
                                      │
                      ┌───────────────┴──────────────┐
                      │         PostgreSQL DB         │
                      │ (Central relational database) │
                      └───────────────▲──────────────┘
                                      │
                             ┌────────┴────────┐
                             │   File Storage   │
                             │  (Local Media)   │
                             │  (S3-ready)      │
                             └──────────────────┘
```

---

# 2. Layered System Structure

ERP-Veritas is divided into four main layers:

### **1. Presentation Layer**

* React-based web frontend
* Communicates only with backend via REST API
* No direct database access

### **2. API Layer (Backend)**

* Django REST Framework
* Exposes endpoints for all modules
* Handles authentication & authorization
* Implements business logic rules

### **3. Data Layer**

* PostgreSQL stores all structured data
* Django models → Migrations → Tables
* ER diagram matches the final ERP schema
* Strict relational integrity with FK constraints

### **4. Storage Layer**

* Stores files like:

  * Product images
  * Customer PO uploads
  * Invoice PDFs
* Local filesystem during Phase 0–1
* Replaceable with S3 in future

---

# 3. Modular Backend Architecture

Each ERP module is a separate Django app:

```
backend/
│
├── product_master/
├── customers/
├── sales/
├── production/
├── packing/
├── finished_stock/
├── dispatch/
├── invoicing/
├── purchases/
├── users/
└── reporting/
```

### Module Independence

* Each module contains its own models, API endpoints, business rules, and serializers.
* Modules share data only via foreign keys and SR Number references.
* This enables:

  * Easier debugging
  * Clean separation of concerns
  * Future microservice migration if needed

---

# 4. Deployment Architecture (Current & Future)

### **Phase 0–1: Local Development**

* Backend runs on localhost
* Frontend runs on localhost
* PostgreSQL installed locally
* Media stored in local `/media` folder

### **Phase 2: LAN/WiFi**

* Backend exposed on a local IP (e.g., `192.168.x.x`)
* Frontend can be served locally or from backend
* Teammates connect using the same WiFi network

### **Phase 3: Cloud Migration (Not now)**

* Docker containers for backend + frontend
* AWS ECS/ECR for compute
* AWS RDS for PostgreSQL
* AWS S3 for file storage
* CloudFront CDN layer for frontend
* IAM-based secure access

*(This section is documented for future readiness.)*

---

# 5. Security Architecture

### **Authentication**

* JWT tokens (API)
* Django sessions (admin panel)

### **Authorization**

* Role-based access control (RBAC)
* Roles: employee, manager, owner, admin

### **Audit Logging**

1. User actions
2. Module affected
3. Reference ID
4. Timestamp

### **Data Integrity**

* All important fields validated both in frontend and backend
* Foreign key constraints maintained strictly
* Status fields use controlled choices/enums

---

# 6. Future Extensibility

### Designed to allow:

* Mobile app integration (same API)
* Additional modules:

  * Barcode scanning
  * Raw material usage tracking
  * Machine monitoring
* Cloud migration without refactor
* Multi-company or multi-factory support (future)

---

# 7. Summary

ERP-Veritas architecture focuses on:

* Modularity
* Scalability
* Clean separation of layers
* Long-term maintainability
* LAN→Cloud transition readiness

This architecture ensures the ERP remains flexible for years, while still simple enough to maintain and extend.

---

# ✔ END OF ARCHITECTURE OVERVIEW DOCUMENT

---

# 📌 **Documentation Update Reminder**


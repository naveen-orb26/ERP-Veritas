# ⭐ **2️⃣ Architecture Overview**

This document explains **how the system is structured**, how backend, frontend, database, storage, and network interact.
It is conceptual architecture — not implementation-level code.

---

# 📄 **ERP-Veritas – Architecture Overview**

ERP-Veritas is a modular ERP system designed for manufacturing units producing apparel trims and accessories.

The architecture supports:

* Local development
* LAN/Wi-Fi deployment
* Future cloud migration (AWS-ready)
* Future mobile app integration

The design emphasizes modularity, clean separation of concerns, and long-term maintainability.

---

# 1. High-Level Architecture Diagram (Text Version)

```
                        ┌──────────────────────────┐
                        │        Frontend          │
                        │      (React Web App)     │
                        └──────────────▲───────────┘
                                       │ HTTPS / REST API
                                       │
                        ┌──────────────┴───────────┐
                        │         Backend          │
                        │   Django + DRF (API)     │
                        │                          │
                        │   Modular ERP Services   │
                        └──────────────▲───────────┘
                                       │
                     ┌─────────────────┴─────────────────┐
                     │          PostgreSQL DB             │
                     │   Central Relational Database      │
                     └─────────────────▲─────────────────┘
                                       │
                          ┌────────────┴────────────┐
                          │      File Storage       │
                          │   (Local → S3 Ready)    │
                          └─────────────────────────┘
```

---

# 2. Layered System Structure

ERP-Veritas follows a layered architecture for clarity and scalability.

---

## 2.1 Presentation Layer

* React-based web frontend
* Communicates only via REST API
* No direct database access
* UI handles input validation and user experience
* Business rules are not enforced here (backend owns logic)

---

## 2.2 API Layer (Backend)

* Django REST Framework (DRF)
* Exposes endpoints per module
* Handles:

  * Authentication
  * Authorization
  * Business logic
  * Cross-module state validation
* Enforces lifecycle constraints:

  * Sales → Production
  * Production → Packing
  * Packing → Dispatch / Stock
* Central coordination point of ERP behavior

---

## 2.3 Data Layer

* PostgreSQL relational database
* Django ORM manages:

  * Models
  * Migrations
  * Schema evolution
* ER diagram strictly matches finalized ERP schema
* Strong relational integrity via foreign keys
* Derived values (e.g., pending quantities) are computed — not redundantly stored

---

## 2.4 Storage Layer

Handles unstructured files:

* Product images
* Customer PO uploads
* Invoice PDFs
* Supporting documents

Phase-wise strategy:

* Phase 0–1 → Local `/media` folder
* Future → AWS S3 integration
* Storage backend abstracted for portability

---

# 3. Modular Backend Architecture

Each ERP domain is implemented as an independent Django app.

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

---

## 3.1 Module Independence Principles

* Each module contains:

  * Models
  * Serializers
  * Views / ViewSets
  * Business logic
* Modules communicate via:

  * Foreign keys
  * Controlled state transitions
* No module directly manipulates another module’s internal logic.
* Cross-module effects are triggered through validated workflows.

---

## 3.2 Business Rule Ownership

* Each module owns its lifecycle constraints.
* Example:

  * Sales controls fulfillment logic.
  * Production controls manufacturing stages.
  * Dispatch updates fulfillment quantities.
* State transitions are reference-based, not tightly coupled.
* Business behavior is designed to become configuration-driven where feasible.

---

# 4. Deployment Architecture

---

## Phase 0–1: Local Development

* Backend: localhost
* Frontend: localhost
* PostgreSQL: local installation
* Media files: local `/media` directory
* Single-machine development

---

## Phase 2: LAN / WiFi Deployment

* Backend exposed on internal IP (e.g., `192.168.x.x`)
* PostgreSQL hosted on central system
* Users connect via internal network
* Controlled access inside organization

---

## Phase 3: Cloud Migration (Future)

Designed but not currently implemented.

Planned components:

* Docker containers (backend + frontend)
* AWS ECS / EC2 for compute
* AWS RDS for PostgreSQL
* AWS S3 for file storage
* CloudFront CDN for frontend delivery
* IAM-based secure access

Cloud readiness is ensured by abstraction layers and modular architecture.

---

# 5. Security Architecture

---

## 5.1 Authentication

* JWT tokens for API access
* Django session-based admin access (internal tools)
* Token validation enforced per request

---

## 5.2 Authorization

Role-Based Access Control (RBAC):

* employee
* manager
* owner
* admin

Access decisions enforced at API level.

---

## 5.3 Audit Logging

System records:

1. User identity
2. Module affected
3. Reference ID
4. Timestamp
5. Action performed

Ensures operational traceability.

---

## 5.4 Data Integrity

* Backend validation mandatory
* FK constraints enforced
* Controlled status enums
* Locking mechanisms (`is_locked`) prevent invalid state mutation
* Fulfillment updates only via Dispatch logic

---

# 6. Extensibility Strategy

ERP-Veritas is structured for controlled expansion.

Future capabilities include:

* Mobile application using same REST API
* Barcode scanning integration
* Raw material usage tracking
* Machine monitoring
* Multi-company support
* Multi-factory support
* Finance automation layer
* Configuration-driven business rules

Schema designed to allow extensions without structural redesign.

---

# 7. Architectural Principles

ERP-Veritas is built on:

* Clear module ownership
* Strong relational modeling
* Minimal redundancy
* Controlled state transitions
* Layer isolation
* Future-proof extensibility
* LAN → Cloud portability
* Maintainable growth model

---

# 8. Summary

ERP-Veritas architecture ensures:

* Modular development
* Clean separation of layers
* Controlled business rule enforcement
* Reliable data integrity
* Long-term scalability
* Gradual upgrade capability

The system is designed to grow from a small manufacturing ERP into a scalable operational platform without structural rework.

---

# ✔ END OF ARCHITECTURE OVERVIEW DOCUMENT

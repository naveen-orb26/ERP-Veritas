# 📄 **ERP-Veritas – Naming Conventions**

This document defines the naming rules used across the ERP-Veritas backend, frontend, database, API contracts, and documentation.

Consistent naming ensures:

* Predictability
* Clean model/API design
* Easy onboarding for new developers
* Uniformity across all modules
* Fewer naming conflicts and confusion

---

# 1. **General Principles**

* Use **lowercase with underscores** for all database table names and fields.
* Use **CamelCase** for class names (e.g., Django models, serializers).
* Use **kebab-case** for frontend folder names and URLs.
* Prefer **short, meaningful names** over long descriptions.
* Avoid abbreviations unless industry standard (e.g., GST, PO, AWB).

---

# 2. **Database Naming Conventions**

### **2.1 Table Names**

* Always **lowercase**
* Use **snake_case**
* For Django apps, table names auto-prefix with app label unless overridden.

**Examples:**

```
product
customer
sales_order
finished_stock_packet
raw_stock_movement
```

---

### **2.2 Column (Field) Names**

* Use lowercase with underscores
* Use clear, descriptive names
* Use `_id` suffix for FK references (Django handles internally)

**Examples:**

```
sr_number
order_quantity
dispatch_date
accepted_quantity
```

---

### **2.3 Primary Keys**

* Always named `id` (auto-generated integer or UUID if chosen later).

---

### **2.4 Foreign Keys**

* Named after the referenced model, e.g.:

```
customer (FK)
sales_order (FK)
purchase_invoice (FK)
packet (FK)
```

---

# 3. **Backend (Django) Naming Conventions**

### **3.1 Django App Names**

Use lowercase, simple words matching modules:

```
product_master
customers
sales
production
packing
finished_stock
dispatch
invoicing
purchases
users
reporting
```

---

### **3.2 Model Names**

Use **CamelCase**, singular, descriptive.

Examples:

```
Product
Customer
CustomerPO
SalesOrder
Production
Packet
FinishedStockPacket
SalesInvoice
Supplier
PurchaseOrder
```

---

### **3.3 Serializer Names**

Append `Serializer` to model name:

```
ProductSerializer
SalesOrderSerializer
PaymentSerializer
```

---

### **3.4 View Names**

Use `<ModelName>ViewSet` for REST API endpoints:

```
ProductViewSet
CustomerViewSet
SalesOrderViewSet
```

---

### **3.5 File Naming**

Use lowercase with underscores:

```
models.py
serializers.py
views.py
urls.py
tests.py
admin.py
```

---

# 4. **API Naming Conventions**

### **4.1 URL Endpoints (REST style)**

Use plural nouns, lowercase, hyphen-separated.

Examples:

```
/api/products/
/api/customers/
/api/sales-orders/
/api/production/
/api/packets/
/api/finished-stock/
/api/dispatch/
/api/invoices/
/api/payments/
```

---

### **4.2 HTTP Methods**

* `GET /items/` → list
* `POST /items/` → create
* `GET /items/{id}/` → retrieve
* `PUT /items/{id}/` → full update
* `PATCH /items/{id}/` → partial update
* `DELETE /items/{id}/` → delete

---

### **4.3 Response Structure**

Always use snake_case for API JSON keys.

Example:

```
{
  "sr_number": "16L-WHITE",
  "product_name": "White Button",
  "units_per_packet": 10
}
```

---

# 5. **Frontend Naming Conventions**

### **5.1 React Component Names**

PascalCase:

```
ProductList.jsx
CustomerForm.jsx
SalesOrderPage.jsx
```

### **5.2 Folder Names**

Use kebab-case:

```
product-master/
customer-module/
sales-order/
```

---

# 6. **File Storage Naming**

### **6.1 Image and Document Paths**

Use lowercase with underscores, include sr_number or reference ID where possible.

Examples:

```
media/products/sr_16l_white.jpg
media/customer_po/po_7842.pdf
media/invoices/inv_2025_001.pdf
```

---

# 7. **Status Fields & Enum Rules**

Statuses should be:

* uppercase strings
* simple words
* controlled via choices

Examples:

```
open
in_progress
completed
cancelled
in_stock
consumed
unpaid
partial
paid
```

---

# 8. Special Naming Notes

### **8.1 SR Number**

SR Number must remain:

* unique
* uppercase or consistent format
* treated as universal product identity
* not changed once created

### **8.2 Batch Number**

Batch numbers follow a structured format (defined later in production docs).

---

# 9. Summary

Naming consistency helps maintain:

* predictable APIs
* clean database design
* readable frontend code
* professional documentation

All contributors must follow these conventions throughout the project.

---

# ✔ END OF NAMING CONVENTIONS DOCUMENT

---



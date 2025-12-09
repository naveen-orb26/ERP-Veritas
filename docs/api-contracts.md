# 📄 **ERP-Veritas – API Contract Plan (Outline Version)**

This document provides a high-level outline of all planned API endpoints for ERP-Veritas.
Each module exposes a set of REST endpoints following:

```
/api/<module-name>/
```

This outline defines *what* endpoints will exist;
detailed request/response structures will be added later.

---

# 1. GENERAL API RULES (Outline)

* Base URL: `/api/`
* All endpoints use REST conventions
* All requests return JSON
* Authentication required for most endpoints
* Use consistent naming conventions (see naming-conventions.md)

Full specifications for authentication, error formats, and pagination will be added later.

---

# 2. PRODUCT MASTER – API OUTLINE

```
GET    /api/products/           → List products
POST   /api/products/           → Create product
GET    /api/products/{id}/      → Get product details
PATCH  /api/products/{id}/      → Update product
DELETE /api/products/{id}/      → Deactivate product (soft delete)
```

---

# 3. CUSTOMER & SALES – API OUTLINE

## 3.1 Customer

```
GET    /api/customers/
POST   /api/customers/
GET    /api/customers/{id}/
PATCH  /api/customers/{id}/
```

## 3.2 Customer Purchase Orders

```
GET    /api/customer-po/
POST   /api/customer-po/
GET    /api/customer-po/{id}/
PATCH  /api/customer-po/{id}/
```

## 3.3 Sales Orders

```
GET    /api/sales-orders/
POST   /api/sales-orders/
GET    /api/sales-orders/{id}/
PATCH  /api/sales-orders/{id}/
```

---

# 4. PRODUCTION – API OUTLINE

```
GET    /api/production/
POST   /api/production/
GET    /api/production/{id}/
PATCH  /api/production/{id}/
```

---

# 5. PACKING – API OUTLINE

```
GET    /api/packets/
POST   /api/packets/
GET    /api/packets/{id}/
PATCH  /api/packets/{id}/
```

---

# 6. FINISHED GOODS STOCK – API OUTLINE

## 6.1 Surplus Stock

```
GET    /api/finished-stock/
POST   /api/finished-stock/
GET    /api/finished-stock/{id}/
PATCH  /api/finished-stock/{id}/
```

## 6.2 Stock Movements

```
GET    /api/finished-stock-movements/
POST   /api/finished-stock-movements/
GET    /api/finished-stock-movements/{id}/
```

---

# 7. DISPATCH – API OUTLINE

```
GET    /api/dispatch/
POST   /api/dispatch/
GET    /api/dispatch/{id}/
PATCH  /api/dispatch/{id}/
```

---

# 8. INVOICE & PAYMENTS – API OUTLINE

## 8.1 Sales Invoice

```
GET    /api/invoices/
POST   /api/invoices/
GET    /api/invoices/{id}/
PATCH  /api/invoices/{id}/
```

## 8.2 Invoice Line Items

(Handled inside invoice object, but listed for clarity)

```
(Added inside /api/invoices/ endpoints)
```

## 8.3 Payments

```
GET    /api/payments/
POST   /api/payments/
GET    /api/payments/{id}/
```

---

# 9. PURCHASE & RAW MATERIAL – API OUTLINE

## 9.1 Supplier

```
GET    /api/suppliers/
POST   /api/suppliers/
GET    /api/suppliers/{id}/
PATCH  /api/suppliers/{id}/
```

## 9.2 Purchase Orders

```
GET    /api/purchase-orders/
POST   /api/purchase-orders/
GET    /api/purchase-orders/{id}/
PATCH  /api/purchase-orders/{id}/
```

## 9.3 Purchase Invoices

```
GET    /api/purchase-invoices/
POST   /api/purchase-invoices/
GET    /api/purchase-invoices/{id}/
PATCH  /api/purchase-invoices/{id}/
```

## 9.4 GRN

```
GET    /api/grn/
POST   /api/grn/
GET    /api/grn/{id}/
PATCH  /api/grn/{id}/
```

## 9.5 Raw Stock Movement

```
GET    /api/raw-stock-movements/
POST   /api/raw-stock-movements/
GET    /api/raw-stock-movements/{id}/
```

---

# 10. USERS & ACCESS CONTROL – API OUTLINE

```
POST   /api/auth/login/
POST   /api/auth/logout/          (optional)
GET    /api/users/
POST   /api/users/
GET    /api/users/{id}/
PATCH  /api/users/{id}/
```

---

# 11. REPORTING – API OUTLINE

(Reports return aggregated data; no CRUD)

```
GET    /api/reports/monthly-invoices/
GET    /api/reports/sales-by-product/
GET    /api/reports/outstanding-payments/
GET    /api/reports/customer-sales/
GET    /api/reports/dispatch-summary/
GET    /api/reports/surplus-stock/
GET    /api/reports/raw-material-stock/
GET    /api/reports/order-progress/
```

---

# ✔ END OF API CONTRACT OUTLINE

---


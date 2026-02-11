# 📄 **ERP-Veritas – API Contract Plan (Final Outline Version)**

This document provides a high-level outline of all planned API endpoints for ERP-Veritas.
Each module exposes RESTful endpoints under:

```
/api/<module-name>/
```

This outline defines endpoint structure and lifecycle actions.
Detailed request/response schemas will be defined separately.

---

# 1. GENERAL API RULES

* Base URL: `/api/`
* All endpoints return JSON
* Authentication required for all operational endpoints
* REST conventions followed (GET, POST, PATCH, DELETE)
* Soft deletes used where applicable
* Lifecycle state validation enforced at backend
* Fulfillment updates controlled via Dispatch module only

---

# 2. PRODUCT MASTER – API OUTLINE

```
GET    /api/products/
POST   /api/products/
GET    /api/products/{id}/
PATCH  /api/products/{id}/
DELETE /api/products/{id}/        → Soft deactivate
```

---

# 3. CUSTOMER MODULE – API OUTLINE

## 3.1 Customers

```
GET    /api/customers/
POST   /api/customers/
GET    /api/customers/{id}/
PATCH  /api/customers/{id}/
```

---

## 3.2 Customer Purchase Orders

```
GET    /api/customer-po/
POST   /api/customer-po/
GET    /api/customer-po/{id}/
PATCH  /api/customer-po/{id}/
```

---

# 4. SALES MODULE – API OUTLINE

## 4.1 Sales Orders (Header)

```
GET    /api/sales-orders/
POST   /api/sales-orders/
GET    /api/sales-orders/{id}/
PATCH  /api/sales-orders/{id}/
POST   /api/sales-orders/{id}/confirm/
POST   /api/sales-orders/{id}/hold/
POST   /api/sales-orders/{id}/cancel/
POST   /api/sales-orders/{id}/lock/
POST   /api/sales-orders/{id}/unlock/
```

Notes:

* Structural edits restricted when `is_locked = true`
* Status transitions validated at backend

---

## 4.2 Sales Order Lines (Product-Level Demand)

```
GET    /api/sales-orders/{id}/lines/
POST   /api/sales-orders/{id}/lines/

GET    /api/sales-order-lines/{line_id}/
PATCH  /api/sales-order-lines/{line_id}/
DELETE /api/sales-order-lines/{line_id}/
```

Notes:

* Fulfillment fields cannot be edited manually
* `fulfilled_quantity` updated only via Dispatch

---

## 4.3 Sales Order Edit Logs

```
GET    /api/sales-orders/{id}/edit-logs/
```

(Write operations handled internally during updates)

---

# 5. PRODUCTION MODULE – API OUTLINE

Production operates at `SalesOrderLine` level.

```
GET    /api/production/
POST   /api/production/
GET    /api/production/{id}/
PATCH  /api/production/{id}/
POST   /api/production/{id}/start/
POST   /api/production/{id}/complete/
POST   /api/production/{id}/cancel/
```

Notes:

* Must reference `sales_order_line_id`
* Quantity validation enforced
* Production cannot exceed ordered quantity unless explicitly allowed

---

# 6. PACKING MODULE – API OUTLINE

Packets are created from Production batches.

```
GET    /api/packets/
POST   /api/packets/
GET    /api/packets/{id}/
PATCH  /api/packets/{id}/
```

Allocation handled via:

```
POST   /api/packets/{id}/allocate/
```

Allocation supports:

* ORDER allocation (requires `sales_order_line_id`)
* STOCK allocation

Notes:

* Allocation determines downstream flow
* Allocation is editable with proper validation

---

# 7. FINISHED GOODS STOCK – API OUTLINE

## 7.1 Stock Packets

```
GET    /api/finished-stock/
POST   /api/finished-stock/
GET    /api/finished-stock/{id}/
PATCH  /api/finished-stock/{id}/
```

---

## 7.2 Stock Movements

```
GET    /api/finished-stock-movements/
POST   /api/finished-stock-movements/
GET    /api/finished-stock-movements/{id}/
```

Notes:

* Movement entries are append-only
* Must reference `product_id`
* Reference metadata required for traceability

---

# 8. DISPATCH MODULE – API OUTLINE

Dispatch fulfills SalesOrderLine quantities.

```
GET    /api/dispatch/
POST   /api/dispatch/
GET    /api/dispatch/{id}/
PATCH  /api/dispatch/{id}/
```

Required on creation:

* `sales_order_line_id`
* `quantity_dispatched`

Notes:

* Dispatch automatically updates `fulfilled_quantity`
* Dispatch cannot exceed pending quantity
* Partial dispatch supported

---

# 9. INVOICE & PAYMENTS MODULE – API OUTLINE

## 9.1 Sales Invoices

```
GET    /api/invoices/
POST   /api/invoices/
GET    /api/invoices/{id}/
PATCH  /api/invoices/{id}/
```

---

## 9.2 Invoice Line Items

Invoice items included within invoice payload.

Optional standalone endpoints (if required):

```
GET    /api/invoice-items/{id}/
PATCH  /api/invoice-items/{id}/
```

Must reference:

* `product_id`

---

## 9.3 Payments

```
GET    /api/payments/
POST   /api/payments/
GET    /api/payments/{id}/
PATCH  /api/payments/{id}/
```

Notes:

* Payment linked to `sales_invoice_id`
* Status update handled at invoice level

---

# 10. PURCHASE & RAW MATERIAL – API OUTLINE

## 10.1 Suppliers

```
GET    /api/suppliers/
POST   /api/suppliers/
GET    /api/suppliers/{id}/
PATCH  /api/suppliers/{id}/
```

---

## 10.2 Purchase Orders

```
GET    /api/purchase-orders/
POST   /api/purchase-orders/
GET    /api/purchase-orders/{id}/
PATCH  /api/purchase-orders/{id}/
```

---

## 10.3 Purchase Invoices

```
GET    /api/purchase-invoices/
POST   /api/purchase-invoices/
GET    /api/purchase-invoices/{id}/
PATCH  /api/purchase-invoices/{id}/
```

---

## 10.4 GRN

```
GET    /api/grn/
POST   /api/grn/
GET    /api/grn/{id}/
PATCH  /api/grn/{id}/
```

---

## 10.5 Raw Stock Movements

```
GET    /api/raw-stock-movements/
POST   /api/raw-stock-movements/
GET    /api/raw-stock-movements/{id}/
```

---

# 11. USERS & ACCESS CONTROL – API OUTLINE

```
POST   /api/auth/login/
POST   /api/auth/logout/

GET    /api/users/
POST   /api/users/
GET    /api/users/{id}/
PATCH  /api/users/{id}/
```

---

# 12. REPORTING – API OUTLINE

(Reports return aggregated read-only data)

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

# ✔ END OF FINAL API CONTRACT OUTLINE

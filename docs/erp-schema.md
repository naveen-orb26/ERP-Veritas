# 📄 **ERP-Veritas – Final ERP Schema**

*A modular ERP system for manufacturing units producing buttons and apparel accessories.*

---

# 1. PRODUCT MASTER MODULE

### **Purpose**

Defines core product identity (SR Number) and basic characteristics.

### **Table: Product**

| Field                    | Description                         |
| ------------------------ | ----------------------------------- |
| id (PK)                  | Auto ID                             |
| sr_number (unique)       | Universal product identity          |
| product_name             | Name of product                     |
| category                 | button / elastic / tape / accessory |
| size_or_variant          | e.g., 16L, 24L                      |
| color                    | Product color                       |
| base_unit                | GROSS / PCS / METER / ROLL / SET    |
| units_per_base_unit      | e.g., 144 for GROSS                 |
| default_units_per_packet | Default packaging quantity          |
| description              | Text                                |
| image_path               | Product image                       |
| is_active                | Active/inactive flag                |
| created_at               | Timestamp                           |

### **Notes**

* `sr_number` is the universal product identifier across the ERP.
* Products are never deleted; only deactivated using `is_active`.

---

# 2. CUSTOMER MODULE

## 2.1 Customer Master

### **Table: Customer**

| Field                  | Description                                   |
| ---------------------- | --------------------------------------------- |
| id (PK)                | Auto-generated database ID                    |
| vendor_id (unique)     | Business reference identifier                 |
| name                   | Customer legal name                           |
| billing_address        | Billing address (text)                        |
| billing_gst_number     | GST used for invoicing                        |
| shipping_address       | Shipping address (text)                       |
| shipping_gst_number    | GST used for shipping                         |
| contact_numbers (JSON) | List of contact phone numbers                 |
| contact_emails (JSON)  | List of email addresses                       |
| gst_number             | Primary GST ID (optional, unique if provided) |
| credit_terms           | Default credit period (e.g., 30 days)         |
| is_active              | Deactivation flag                             |

### **Notes**

• `vendor_id` is the business-facing identifier (not the PK).
• Customer name may repeat.
• GST numbers are optional but must be unique if provided.
• Customers are never deleted — only deactivated.
• `contact_numbers` and `contact_emails` are stored as JSON arrays.

---

## 2.2 Customer Purchase Orders

### **Table: CustomerPO**

| Field                  | Description                |
| ---------------------- | -------------------------- |
| id (PK)                | Auto ID                    |
| po_number (unique)     | Customer-issued PO number  |
| customer (FK)          | Linked customer            |
| po_date                | PO date                    |
| uploaded_document_path | Uploaded PO file reference |
| remarks                | Notes                      |

### **Notes**

• CustomerPO is an operational reference entity.
• It does not trigger production automatically.
• It may later be tightly integrated with SalesOrder if required.

---

# 3. SALES MODULE

## 3.1 Sales Order (Header)

### **Table: SalesOrder**

| Field                  | Description                                                            |
| ---------------------- | ---------------------------------------------------------------------- |
| id (PK)                | Auto ID                                                                |
| customer (FK)          | Linked customer                                                        |
| customer_po_id         | Reference to Customer PO (temporary integer, FK later)                 |
| created_by (FK)        | User who created the order                                             |
| order_date             | Order creation date                                                    |
| expected_delivery_date | Final committed delivery date                                          |
| priority_flag          | Advisory priority flag                                                 |
| is_locked              | Prevents editing once production begins                                |
| status                 | Draft / Confirmed / On Hold / Partially Fulfilled / Closed / Cancelled |
| subtotal_amount        | Manual subtotal (informational)                                        |
| tax_amount             | Manual tax amount                                                      |
| total_amount           | Subtotal + tax                                                         |
| remarks                | General notes                                                          |
| created_at             | Timestamp                                                              |
| updated_at             | Timestamp                                                              |

---

## 3.2 Sales Order Line

### **Table: SalesOrderLine**

| Field              | Description                            |
| ------------------ | -------------------------------------- |
| id (PK)            | Auto ID                                |
| sales_order (FK)   | Parent Sales Order                     |
| product (FK)       | Product reference                      |
| quantity           | Ordered quantity                       |
| fulfilled_quantity | Quantity dispatched against this line  |
| unit_price         | Manual unit price                      |
| line_total         | quantity × unit_price (manual for now) |
| remarks            | Line-level notes                       |

---

## 3.3 Sales Order Edit Log

### **Table: SalesOrderEditLog**

| Field            | Description            |
| ---------------- | ---------------------- |
| id (PK)          | Auto ID                |
| sales_order (FK) | Associated Sales Order |
| field_name       | Field modified         |
| old_value        | Previous value         |
| new_value        | Updated value          |
| changed_by (FK)  | User who made change   |
| changed_at       | Timestamp              |

---

### Operational Logic Notes (Sales Module)

• SalesOrder supports multiple products via SalesOrderLine.
• Fulfillment is tracked per line using `fulfilled_quantity`.
• Order-level fulfillment is derived from aggregation of line fulfillment.
• Pending quantity is dynamically computed (not stored).
• Status auto-updates based on fulfillment progress.
• ON_HOLD and CANCELLED statuses are protected from auto-update logic.
• `is_locked` prevents modification once production starts.
• Financial totals are manual for now; automation planned later.

---

# 4. PRODUCTION MODULE

### **Table: Production**

| Field                 | Description                                           |
| --------------------- | ----------------------------------------------------- |
| id (PK)               | Auto ID                                               |
| sales_order_line (FK) | Linked SalesOrderLine (product-level demand)          |
| product (FK)          | Product reference                                     |
| batch_number          | Generated batch code                                  |
| planned_quantity      | Planned production quantity                           |
| produced_quantity     | Actual produced quantity                              |
| current_stage         | Draft / Planned / In Progress / Completed / Cancelled |
| created_at            | Timestamp                                             |
| updated_at            | Timestamp                                             |
| remarks               | Notes                                                 |

### **Notes**

* Production operates at SalesOrderLine level.
* No stage history maintained (as per current requirement).
* Batch numbers generated per day/order logic.

---

# 5. PACKING MODULE

### **Table: Packet**

| Field                           | Description                         |
| ------------------------------- | ----------------------------------- |
| id (PK)                         | Internal packet ID                  |
| production (FK)                 | Linked production batch             |
| product (FK)                    | Product reference                   |
| units_in_packet                 | Quantity inside packet              |
| manufacture_date                | Date                                |
| batch_number                    | From production                     |
| allocation_type                 | ORDER / STOCK                       |
| sales_order_line (FK, nullable) | If allocated to specific order line |
| remarks                         | Notes                               |

### **Notes**

* Packets are atomic (no split/merge).
* Allocation determines whether packet fulfills an order or goes to stock.

---

# 6. FINISHED GOODS STOCK MODULE

## 6.1 Surplus Stock

### **Table: FinishedStockPacket**

| Field               | Description         |
| ------------------- | ------------------- |
| id (PK)             | Auto ID             |
| packet (FK)         | Packet              |
| product (FK)        | Product             |
| units_in_packet     | Quantity            |
| added_to_stock_date | Date                |
| status              | IN_STOCK / CONSUMED |

---

## 6.2 Stock Movement

### **Table: FinishedStockMovement**

| Field         | Description                                     |
| ------------- | ----------------------------------------------- |
| id (PK)       | Auto ID                                         |
| product (FK)  | Product                                         |
| movement_type | SURPLUS_IN / STOCK_OUT / RETURN_IN / RETURN_OUT |
| quantity      | Quantity                                        |
| date          | Movement date                                   |
| reference_id  | Linked document                                 |
| remarks       | Notes                                           |

---

# 7. DISPATCH MODULE

### **Table: Dispatch**

| Field                 | Description           |
| --------------------- | --------------------- |
| id (PK)               | Auto ID               |
| sales_order_line (FK) | Linked SalesOrderLine |
| quantity_dispatched   | Quantity              |
| awb_number            | Tracking              |
| transporter           | Transporter name      |
| dispatch_date         | Final dispatch date   |
| remarks               | Notes                 |

### **Notes**

* Dispatch updates `fulfilled_quantity` in SalesOrderLine.
* No packet-level listing for operational simplicity.

---

# 8. INVOICE & PAYMENTS MODULE

## 8.1 Sales Invoice (Header)

### **Table: SalesInvoice**

| Field          | Description             |
| -------------- | ----------------------- |
| id (PK)        | Auto ID                 |
| invoice_number | Invoice number          |
| customer (FK)  | Customer                |
| invoice_date   | Date                    |
| due_date       | Date                    |
| total_amount   | Amount                  |
| pdf_path       | PDF file path           |
| status         | unpaid / partial / paid |
| remarks        | Notes                   |

---

## 8.2 SalesInvoiceItem

### **Table: SalesInvoiceItem**

| Field        | Description    |
| ------------ | -------------- |
| id (PK)      | Auto ID        |
| invoice (FK) | Invoice header |
| product (FK) | Product        |
| quantity     | Quantity       |
| rate         | Rate           |
| amount       | Total          |
| remarks      | Notes          |

---

## 8.3 Payment

### **Table: Payment**

| Field              | Description |
| ------------------ | ----------- |
| id (PK)            | Auto ID     |
| customer (FK)      | Customer    |
| sales_invoice (FK) | Invoice     |
| amount_paid        | Amount      |
| payment_date       | Date        |
| payment_mode       | Mode        |
| remarks            | Notes       |

---

# 9. PURCHASE & RAW MATERIAL MODULE

## 9.1 Supplier

### **Table: Supplier**

| Field           | Description   |
| --------------- | ------------- |
| id (PK)         | Auto ID       |
| name            | Supplier name |
| address         | Address       |
| gst_number      | GST           |
| payment_terms   | Terms         |
| contact_numbers | JSON          |
| contact_emails  | JSON          |
| is_active       | Active flag   |

---

## 9.2 Purchase Order

### **Table: PurchaseOrder**

| Field              | Description |
| ------------------ | ----------- |
| id (PK)            | Auto ID     |
| po_number (unique) | Supplier PO |
| supplier (FK)      | Supplier    |
| po_date            | Date        |
| remarks            | Notes       |

---

## 9.3 Purchase Invoice

### **Table: PurchaseInvoice**

| Field               | Description      |
| ------------------- | ---------------- |
| id (PK)             | Auto ID          |
| supplier (FK)       | Supplier         |
| purchase_order (FK) | PurchaseOrder    |
| invoice_number      | Number           |
| invoice_date        | Date             |
| total_amount        | Amount           |
| pdf_path            | Invoice PDF path |
| status              | Status           |
| remarks             | Notes            |

---

## 9.4 GRN (Goods Receipt Note)

### **Table: GRN**

| Field                 | Description     |
| --------------------- | --------------- |
| id (PK)               | Auto ID         |
| purchase_invoice (FK) | PurchaseInvoice |
| product (FK)          | Product         |
| received_quantity     | Received qty    |
| accepted_quantity     | Accepted qty    |
| received_date         | Date            |
| remarks               | Notes           |

---

## 9.5 Raw Material Stock Movement

### **Table: RawStockMovement**

| Field         | Description                                                           |
| ------------- | --------------------------------------------------------------------- |
| id (PK)       | Auto ID                                                               |
| product (FK)  | Product                                                               |
| movement_type | PURCHASE_IN / ADJUSTMENT_IN / ADJUSTMENT_OUT / RETURN_IN / RETURN_OUT |
| quantity      | Qty                                                                   |
| date          | Movement date                                                         |
| reference_id  | Linked reference                                                      |
| remarks       | Notes                                                                 |

---

# 10. USERS & ACCESS CONTROL

## User

| Field         | Description                        |
| ------------- | ---------------------------------- |
| id (PK)       | Auto ID                            |
| username      | Username                           |
| password_hash | Hashed password                    |
| role          | employee / manager / owner / admin |
| is_active     | Active flag                        |

---

## ActivityLog

| Field        | Description   |
| ------------ | ------------- |
| id (PK)      | Auto ID       |
| user (FK)    | User          |
| action       | Action text   |
| module       | Module name   |
| reference_id | Linked record |
| timestamp    | Timestamp     |
| remarks      | Notes         |

---

# 11. REPORTING MODULE

### Includes reports for:

* Monthly invoicing
* Sales by product
* Outstanding payments
* Customer-wise sales
* Dispatch summary
* Surplus stock summary
* Raw material stock
* Order progress

*(Implemented as queries/aggregations, not separate tables.)*

---

# 12. BACKUP SYSTEM

### Features:

* Daily local backup
* Weekly external backup
* Cloud backup (future S3 integration)
* Encrypted archives optional
* Backup logs stored for audit

---

# END OF FINAL ERP SCHEMA

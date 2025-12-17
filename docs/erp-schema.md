Absolutely — from now on, **any time our work affects documentation**, I will notify you clearly:

> **“This update requires a docs change in: <file>”**

So your documentation will **always stay in sync** with your ERP.

---

# ⭐ Now let’s create the **Final ERP Schema Document**

This will go inside:

```
/docs/erp-schema.md
```

Below is the **clean, structured, documentation-ready version** of your schema.
You can copy & paste it directly into the file.

---

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
| color                    | product color                       |
| base_unit                | GROSS / PCS / METER / ROLL / SET    |
| units_per_base_unit      | e.g., 144 for GROSS                 |
| default_units_per_packet | Default packaging quantity          |
| description              | Text                                |
| image_path               | Product image                       |
| is_active                | Active/inactive flag                |
| created_at               | Timestamp                           |

### **Notes**

* `sr_number` is the universal product identifier across the whole ERP.
* `is_active` indicates if the product is currently offered.

---

# 2. CUSTOMER & SALES MODULE

## 2.1 Customer Master

### **Table: Customer**

| Field                  | Description            |
| ---------------------- | ---------------------- |
| id (PK)                | Auto ID                |
| name                   | Customer name          |
| billing_address        | Text                   |
| shipping_address       | Text                   |
| contact_numbers (JSON) | Variable phone numbers |
| contact_emails (JSON)  | Variable email list    |
| gst_number             | GST ID                 |
| credit_terms           | e.g., 30 days          |
| is_active              | Active flag            |

---

## 2.2 Customer Purchase Orders

### **Table: CustomerPO**

| Field                  | Description        |
| ---------------------- | ------------------ |
| id (PK)                | Auto ID            |
| po_number (unique)     | Customer PO number |
| customer (FK)          | Customer           |
| po_date                | Date               |
| uploaded_document_path | PO file            |
| remarks                | Notes              |

---

## 2.3 Proforma Invoice (Optional)

### **Table: ProformaInvoice**

| Field         | Description |
| ------------- | ----------- |
| id (PK)       | Auto ID     |
| customer (FK) | Customer    |
| pi_number     | PI number   |
| pi_date       | Date        |
| remarks       | Notes       |

---

## 2.4 Sales Order

### **Table: SalesOrder**

| Field                  | Description                                |
| ---------------------- | ------------------------------------------ |
| id (PK)                | Auto ID                                    |
| customer (FK)          | Customer                                   |
| customer_po (FK)       | Customer PO                                |
| sr_number              | Product SR number                          |
| order_quantity         | Base units                                 |
| priority_flag          | YES / NO                                   |
| order_date             | Date                                       |
| expected_delivery_date | Date                                       |
| status                 | open / in-progress / completed / cancelled |
| remarks                | Notes                                      |

---

# 3. PRODUCTION MODULE

### **Table: Production**

| Field            | Description              |
| ---------------- | ------------------------ |
| id (PK)          | Auto ID                  |
| sales_order (FK) | Linked sales order       |
| sr_number        | Product                  |
| current_stage    | Current production stage |
| batch_number     | Generated batch code     |
| created_at       | Timestamp                |
| last_updated     | Timestamp                |
| remarks          | Notes                    |

### **Notes**

* No stage history (as per requirement).
* Batch numbers generated per day/order logic.

---

# 4. PACKING MODULE

### **Table: Packet**

| Field               | Description          |
| ------------------- | -------------------- |
| id (PK)             | Internal packet ID   |
| sales_order (FK)    | Linked to order      |
| sr_number           | Product identifier   |
| product_description | Human-readable       |
| units_in_packet     | Quantity             |
| unit_of_measure     | Derived from Product |
| manufacture_date    | Date                 |
| batch_number        | From production      |
| remarks             | Notes                |

### **Notes**

* Packets are atomic (no split/merge).
* Packet "IDs" are internal; not customer-facing.

---

# 5. FINISHED GOODS STOCK MODULE

## 5.1 Surplus Stock

### **Table: FinishedStockPacket**

| Field               | Description         |
| ------------------- | ------------------- |
| id (PK)             | Auto ID             |
| packet (FK)         | Packet              |
| sr_number           | Product             |
| units_in_packet     | Quantity            |
| unit_of_measure     | Unit                |
| added_to_stock_date | Date                |
| status              | in_stock / consumed |

---

## 5.2 Stock Movement

### **Table: FinishedStockMovement**

| Field         | Description                                     |
| ------------- | ----------------------------------------------- |
| id (PK)       | Auto ID                                         |
| sr_number     | Product                                         |
| movement_type | SURPLUS_IN / STOCK_OUT / RETURN_IN / RETURN_OUT |
| quantity      | Quantity                                        |
| date          | Movement date                                   |
| reference_id  | Linked document                                 |
| remarks       | Notes                                           |

---

# 6. DISPATCH MODULE

### **Table: Dispatch**

| Field            | Description         |
| ---------------- | ------------------- |
| id (PK)          | Auto ID             |
| sales_order (FK) | Sales order         |
| customer (FK)    | Customer            |
| sr_number        | Product             |
| units_dispatched | Quantity            |
| awb_number       | Tracking            |
| transporter      | Transporter name    |
| dispatch_date    | Final dispatch date |
| remarks          | Notes               |

### **Note**

* No packet-level listing (too many packets).

---

# 7. INVOICE & PAYMENTS MODULE

## 7.1 Sales Invoice (Header)

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

## 7.2 Invoice Line Items

### **Table: SalesInvoiceItem**

| Field           | Description    |
| --------------- | -------------- |
| id (PK)         | Auto ID        |
| invoice (FK)    | Invoice header |
| sr_number       | Product        |
| quantity        | Quantity       |
| unit_of_measure | Unit           |
| rate            | Rate           |
| amount          | Total          |
| remarks         | Notes          |

---

## 7.3 Payments

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

# 8. PURCHASE & RAW MATERIAL MODULE

## 8.1 Supplier

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

## 8.2 Purchase Order

### **Table: PurchaseOrder**

| Field              | Description |
| ------------------ | ----------- |
| id (PK)            | Auto ID     |
| po_number (unique) | Supplier PO |
| supplier (FK)      | Supplier    |
| po_date            | Date        |
| remarks            | Notes       |

---

## 8.3 Purchase Invoice

### **Table: PurchaseInvoice**

| Field               | Description      |
| ------------------- | ---------------- |
| id (PK)             | Auto ID          |
| supplier (FK)       | Supplier         |
| purchase_order (FK) | PO               |
| invoice_number      | Number           |
| invoice_date        | Date             |
| total_amount        | Amount           |
| pdf_path            | Invoice PDF path |
| status              | Status           |

---

## 8.4 GRN (Goods Receipt Note)

### **Table: GRN**

| Field                 | Description  |
| --------------------- | ------------ |
| id (PK)               | Auto ID      |
| purchase_invoice (FK) | Invoice      |
| product               | Product      |
| received_quantity     | Received qty |
| accepted_quantity     | Accepted qty |
| received_date         | Date         |
| remarks               | Notes        |

---

## 8.5 Raw Material Stock Movement

### **Table: RawStockMovement**

| Field         | Description                                                           |
| ------------- | --------------------------------------------------------------------- |
| id (PK)       | Auto ID                                                               |
| product       | Product                                                               |
| movement_type | PURCHASE_IN / ADJUSTMENT_IN / ADJUSTMENT_OUT / RETURN_IN / RETURN_OUT |
| quantity      | Qty                                                                   |
| date          | Movement date                                                         |
| reference_id  | Linked reference                                                      |
| remarks       | Notes                                                                 |

---

# 9. USERS & ACCESS CONTROL

## User

| Field         | Description                        |
| ------------- | ---------------------------------- |
| id (PK)       | Auto ID                            |
| username      | Username                           |
| password_hash | Hashed password                    |
| role          | employee / manager / owner / admin |
| is_active     | Active flag                        |

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

# 10. REPORTING MODULE

### Includes reports for:

* Monthly invoicing
* Sales by SR number
* Outstanding payments
* Customer-wise sales
* Dispatch summary
* Surplus stock summary
* Raw material stock
* Order progress

*(Implemented as queries/aggregations, not separate tables.)*

---

# 11. BACKUP SYSTEM

### Features:

* Daily local backup
* Weekly external backup
* Cloud backup (future S3 integration)
* Encrypted archives optional
* Backup logs stored for audit

---

#  END OF FINAL ERP SCHEMA

---

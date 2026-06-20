# ॐ Divine Hindu Bangalore Store - Enterprise Inventory Operating System (OS)

A professional, high-fidelity Next.js 16 dashboard and store-level operating system tailored to support daily workflows for retail floor employees, checkouts, and manager auditing, while providing corporate executive reports for store owners.

---

## 🌟 Key Features

### 1. Store Dashboard (Today's Executive Summary)
* **Real-time KPIs**: Tracks critical store health metrics including *Inventory Health Score*, *Stock Accuracy %*, *Low Stock Warnings*, *Pending Audits*, *Today's Sales Revenue*, and *Damaged Write-offs*.
* **Actionable Taskboards**: Interactive checklist alerting operators of low stock thresholds, open returns, and closing tasks.
* **Smart Replenishment**: Automates reorder suggestions (SKU, current stock, safety limit, suggested quantity) linking direct vendor contacts.

### 2. POS Checkout Register (Log Customer Sale)
* **Interactive Cart Builder**: Cashier checkout interface simulating POS sales.
* **Instant Safety Guards**: Front-end validation prevents transaction logs from exceeding active physical stock limits.
* **Auto-deductions**: Adjusts system stock counts and posts ledger records instantly upon transaction checkouts.

### 3. Inbound Cargo Intake (Receive Shipment)
* **Cargo Check-In**: Log incoming stock shipments from primary suppliers.
* **Receipts Audit Log**: View recent check-ins, purchase order references, and invoice logs.

### 4. Stock Take & Reconciliation Center
* **Expected vs. Physical Audit**: Compare theoretical system stock against physical floor counts.
* **Discrepancy Indicators**: Highlights stock matches (green), surpluses (amber), and deficits (red) in real-time.
* **3-Stage Workflow**: Structure for store managers (`Investigate` -> `Approve` -> `Adjust Stock`) to write discrepancies to the ledger.

### 5. Daily EOD Closing Process
* **Daily Store Lock**: Systematic walk-through for cashier/manager end-of-day checks.
* **EOD Logs**: Record daily closing remarks and download print-ready shift summaries.

### 6. Operations Intelligence Assistant
* **Inventory Capital Analytics**: Measures locked capital value and safety stock exposure.
* **Velocity Analysis**: Highlights top-moving SKUs vs. stagnant capital.
* **Damaged & Expired Analytics**: Track cost write-offs, product category losses, and active return QA parameters.

### 7. Interactive SOP & Compliance Center
* **Procedural Guides**: Standard Operating Procedures for receiving, POS checkout, returns, and audits.
* **Staff Compliance Gauge**: Checklist progress tracking for employee task verification.

### 8. Interactive Inventory Lifecycle Map
* **Sankey/Node Flow Map**: Visually trace inventory flow parameters (Supplier -> Inbound QA -> Shelving -> POS checkout -> EOD audit -> Executive reports).

---

## 💻 Tech Stack & Architecture

* **Framework**: Next.js 16 (App Router, Turbopack) & React 19.
* **Styling**: Tailwind CSS v4 featuring custom Saffron accents (`saffron-50` to `saffron-700`) mapping out light/dark modes natively.
* **Icons**: Lucide React.
* **State Engine**: React Context API with state synchronization in `localStorage` for cross-page data persistence without a database setup.
* **Data Seed**: Real-world product database featuring **105 unique SKU listings** across agnihotra kits, rudrakshas, camphor, wellness organics, brass idols, and incense.

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v18.x or higher)
* npm (v9.x or higher)

### Installation

1. Clone or download the repository:
   ```bash
   git clone https://github.com/ShivanshPandey2005/divine-hindu-inventory-os.git
   cd divine-hindu-inventory-os
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch local development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the interface.

---

## 📦 Build & Deployment

To verify compilation and generate an optimized production bundle:
```bash
npm run build
npm run start
```
The codebase compiles cleanly with zero TypeScript compiler errors or ESLint syntax warnings.

---

## 📄 Proposal Metadata
* **Project**: Divine Hindu Bangalore Store - Back-Office Operations
* **Proposal**: Prepared as part of the AI Executive Assignment
* **Build Version**: v1.2.0-beta
* **Last Code Sync**: 2026-06-20 16:51:04 (IST)

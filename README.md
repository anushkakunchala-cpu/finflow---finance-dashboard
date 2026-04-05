# FinFlow - Modern Finance Dashboard SPA

FinFlow is a high-performance, single-page finance dashboard built with React.js and Tailwind CSS. It features a smooth scroll-to-section navigation, role-based access control (RBAC), and real-time data insights derived from mock data.

## 🚀 Features

### 1. Single-Page Navigation
- **Scroll-to-Section**: Sidebar navigation with smooth scrolling to Overview, Transactions, and Insights.
- **Active Tab Highlighting**: Uses `IntersectionObserver` to automatically highlight the current section in the sidebar.
- **Sticky Sidebar**: Fixed navigation for easy access on desktop.
- **Responsive Header**: Collapsible hamburger menu for mobile users.

### 2. Dashboard Overview
- **Summary Cards**: Real-time calculation of Total Balance, Income, and Expenses with percentage change indicators.
- **Balance Trend**: Interactive line chart showing the balance history of the last 10 transactions.
- **Spending Breakdown**: Donut chart visualizing expenses by category.

### 3. Advanced Transactions Ledger
- **Search & Filter**: Real-time search by description and filtering by category.
- **Sorting**: Sortable columns for Date and Amount.
- **Pagination**: Efficient handling of 20+ transactions with clean pagination controls.
- **CSV Export**: One-click export of filtered transactions using `PapaParse`.

### 4. Financial Insights
- **Top Category**: Identifies the highest spending category for the current period.
- **Savings Rate**: Calculates the percentage of income saved.
- **Average Expense**: Tracks the average cost per transaction.

### 5. Role-Based UI (RBAC) - Demo Only
- **Admin**: Full access to view, add, and delete transactions.
- **Viewer**: Read-only access to the dashboard.
- **Guest**: Limited view with blurred sections and upgrade prompts for premium features.
- **Note**: This dashboard is a frontend demonstration only; there is no real authentication or backend logic. Role switching is simulated for UI behavior purposes.
- **Design**: Designed to be responsive and handle empty states gracefully.

### 6. State Management & Persistence
- **Context API**: Centralized `FinanceProvider` managing transactions, roles, and filters.
- **LocalStorage**: Persists your selected role and transaction history across browser sessions.
- **Loading States**: Simulated fetch with a professional loading spinner.

## 🛠️ Tech Stack

- **Frontend**: React.js (v19)
- **Styling**: Tailwind CSS (v4)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Animations**: Framer Motion (via `motion`)
- **CSV Processing**: PapaParse

## 📁 Folder Structure

```text
src/
├── components/
│   ├── Dashboard/      # SummaryCards, Charts
│   ├── Insights/       # InsightsSection
│   ├── Layout/         # Sidebar, Header
│   ├── Transactions/   # TransactionsTable
│   └── UI/             # RoleToggle, GuestOverlay
├── context/            # FinanceContext (State Management)
├── data/               # Mock Data & Constants
├── lib/                # Utility functions
└── App.tsx             # Main Layout & Scroll Logic
```

## 🚦 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Run Development Server**:
   ```bash
   npm run dev
   ```
3. **Build for Production**:
   ```bash
   npm run build
   ```

## 📝 Assumptions & Decisions

- **Mock Data**: The app uses a static array of 25 transactions to simulate a real-world scenario.
- **Intersection Observer**: Chosen for active tab detection to ensure high performance and smooth UX.
- **Guest Role**: Implemented using a CSS backdrop-blur overlay to simulate a "locked" premium state.
- **Mobile First**: All components are fully responsive, ensuring readability on screens as small as 320px.

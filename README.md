# Ad Budget Optimizer

**0-1 Knapsack — Dynamic Programming vs Greedy**  
Vaastav B · Pranav

---

## Overview

Allocates an advertising budget across campaigns to **maximise engagement**, using two algorithms:

| Algorithm | Complexity | Quality |
|-----------|-----------|---------|
| Dynamic Programming (0-1 Knapsack) | O(n × W) | ✅ Globally optimal |
| Greedy (ratio sort) | O(n log n) | ⚡ Fast — not always optimal |

The core algorithms are implemented in **C** (`backend/knapsack.c`) and ported to JavaScript for the browser UI.

---

## Project Structure

```
ad-budget-optimizer/
│
├── backend/
│   ├── knapsack.c      ← Core C algorithm (DP + Greedy)
│   ├── knapsack.h      ← Structs & prototypes
│   ├── main.c          ← CLI demo with sample data
│   ├── Makefile        ← Build the C CLI
│   ├── server.js       ← Express REST API (JS port)
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Controls.jsx
│   │   │   ├── MetricGrid.jsx
│   │   │   ├── AlgorithmEfficiency.jsx
│   │   │   ├── CompareCards.jsx
│   │   │   ├── AdEditor.jsx
│   │   │   ├── BarChart.jsx
│   │   │   ├── EngagementChart.jsx
│   │   │   ├── BudgetChart.jsx
│   │   │   ├── InventoryTable.jsx
│   │   │   └── DPTable.jsx
│   │   ├── utils/
│   │   │   ├── algorithms.js   ← JS port of knapsack.c
│   │   │   └── format.js       ← INR & engagement formatters
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## Running Locally

### Frontend (Vite + React)

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

### Backend API (optional — frontend runs standalone)

```bash
cd backend
npm install
npm start
# → http://localhost:3001
```

### C CLI

```bash
cd backend
make
./knapsack
```

---

## Features

- **INR currency** throughout — ₹K, ₹L, ₹Cr notation
- **Budget quick-select** presets: ₹50K / ₹1L / ₹2L / ₹5L / ₹10L / ₹20L
- **Editable ad inventory** — name, platform, cost, engagement, metric type
- **Cost vs Engagement chart** — selected ads highlighted, non-selected faded
- **Separate charts** for Engagement comparison and Budget used
- **Efficiency comparison** showing DP vs Greedy in plain language
- **DP sub-problem table** with traceback path visualised
- **Inventory table** showing which algorithm selected each ad

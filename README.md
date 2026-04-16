# Ad Budget Optimizer

**0-1 Knapsack — Dynamic Programming vs Greedy**  
---

## Overview

Allocates an advertising budget across campaigns to **maximise engagement**, using two algorithms:

| Algorithm | Complexity | Quality |
|-----------|-----------|---------|
| Dynamic Programming (0-1 Knapsack) | O(n × W) | ✅ Globally optimal |
| Greedy (ratio sort) | O(n log n) | ⚡ Fast — not always optimal |

---

## Project Structure

```
ad-budget-optimizer/
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

## Features

- **INR currency** throughout — ₹K, ₹L, ₹Cr notation
- **Budget quick-select** presets: ₹50K / ₹1L / ₹2L / ₹5L / ₹10L / ₹20L
- **Editable ad inventory** — name, platform, cost, engagement, metric type
- **Cost vs Engagement chart** — selected ads highlighted, non-selected faded
- **Separate charts** for Engagement comparison and Budget used
- **Efficiency comparison** showing DP vs Greedy in plain language
- **DP sub-problem table** with traceback path visualised
- **Inventory table** showing which algorithm selected each ad

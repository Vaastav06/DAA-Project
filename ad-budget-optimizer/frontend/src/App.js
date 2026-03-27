import React, { useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { formatINR, formatCompact } from "./utils/formatINR";
import "chart.js/auto";

function App() {
  const [budget, setBudget] = useState(50000);
  const [result, setResult] = useState({});
  const [ads, setAds] = useState([
    { id: 1, name: "Ad 1", cost: 10000, engagement: 200 },
    { id: 2, name: "Ad 2", cost: 20000, engagement: 400 },
    { id: 3, name: "Ad 3", cost: 15000, engagement: 350 }
  ]);

  const runAlgo = async () => {
    const res = await axios.get("http://localhost:5000/run");
    const lines = res.data.split("\n");
    const dp = parseInt(lines[0].split(":")[1]);
    const gr = parseInt(lines[1].split(":")[1]);
    setResult({ dp, gr });
  };

  const updateAd = (id, field, value) => {
    setAds(ads.map(ad =>
      ad.id === id ? { ...ad, [field]: value } : ad
    ));
  };

  const improvement = result.gr
    ? (((result.dp - result.gr) / result.gr) * 100).toFixed(2)
    : 0;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Ad Budget Optimizer (INR)</h2>

      <h4>Budget: {formatINR(budget)} ({formatCompact(budget)})</h4>

      <input
        type="range"
        min="10000"
        max="500000"
        step="5000"
        value={budget}
        onChange={(e) => setBudget(Number(e.target.value))}
      />

      <br /><br />
      <button onClick={runAlgo}>Run Algorithm</button>

      <h3>Results</h3>
      <p>DP: {result.dp}</p>
      <p>Greedy: {result.gr}</p>
      <p>Efficiency Gain: +{improvement}%</p>

      <h3>Ads (Editable)</h3>
      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Cost (₹)</th>
            <th>Engagement</th>
          </tr>
        </thead>
        <tbody>
          {ads.map(ad => (
            <tr key={ad.id}>
              <td>
                <input
                  value={ad.name}
                  onChange={(e) => updateAd(ad.id, "name", e.target.value)}
                />
              </td>
              <td>
                <input
                  value={ad.cost}
                  onChange={(e) => updateAd(ad.id, "cost", +e.target.value)}
                />
              </td>
              <td>
                <input
                  value={ad.engagement}
                  onChange={(e) => updateAd(ad.id, "engagement", +e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Graph</h3>
      <Bar
        data={{
          labels: ads.map(a => a.name),
          datasets: [
            {
              label: "Cost (₹)",
              data: ads.map(a => a.cost)
            },
            {
              label: "Engagement",
              data: ads.map(a => a.engagement)
            }
          ]
        }}
      />
    </div>
  );
}

export default App;
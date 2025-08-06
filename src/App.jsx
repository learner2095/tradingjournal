import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [trades, setTrades] = useState([]);
  const [form, setForm] = useState({
    symbol: "",
    entry: "",
    exit: "",
    quantity: "",
    charges: 70,
    notes: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTrade = () => {
    const profit =
      (parseFloat(form.exit) - parseFloat(form.entry)) *
        parseFloat(form.quantity) -
      parseFloat(form.charges);

    const newTrade = {
      ...form,
      profit,
      id: Date.now(),
    };

    setTrades((prev) => [...prev, newTrade]);
    setForm({
      symbol: "",
      entry: "",
      exit: "",
      quantity: "",
      charges: 70,
      notes: "",
      date: form.date,
    });
  };

  const filteredTrades = trades.filter((trade) => trade.date === selectedDate);

  const deployedAmount = filteredTrades.reduce(
    (sum, t) => sum + parseFloat(t.entry) * parseFloat(t.quantity),
    0
  );

  const todaysProfit = filteredTrades.reduce((sum, t) => sum + t.profit, 0);
  const overallProfit = trades.reduce((sum, t) => sum + t.profit, 0);

  return (
    <div className="app-container">
      <h1>Trading Journal</h1>

      <div className="form">
        <input
          name="symbol"
          value={form.symbol}
          onChange={handleChange}
          placeholder="Symbol"
        />
        <input
          name="entry"
          type="number"
          value={form.entry}
          onChange={handleChange}
          placeholder="Entry Price"
        />
        <input
          name="exit"
          type="number"
          value={form.exit}
          onChange={handleChange}
          placeholder="Exit Price"
        />
        <input
          name="quantity"
          type="number"
          value={form.quantity}
          onChange={handleChange}
          placeholder="Quantity"
        />
        <input
          name="charges"
          type="number"
          value={form.charges}
          onChange={handleChange}
          placeholder="Charges (Default ₹70)"
        />
        <input
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Notes"
        />
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
        />
        <button onClick={handleAddTrade}>Add Trade</button>
      </div>

      <div className="calendar">
        <label>Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <div className="summary-table">
        <h2>Summary</h2>
        <p><strong>Deployed Amount:</strong> ₹{deployedAmount.toFixed(2)}</p>
        <p><strong>Today's Profit:</strong> ₹{todaysProfit.toFixed(2)}</p>
        <p><strong>Overall Profit:</strong> ₹{overallProfit.toFixed(2)}</p>
      </div>

      <div className="trade-table">
        <h2>Trades for {selectedDate}</h2>
        <table>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Entry</th>
              <th>Exit</th>
              <th>Quantity</th>
              <th>Charges</th>
              <th>Profit</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrades.map((t) => (
              <tr key={t.id}>
                <td>{t.symbol}</td>
                <td>{t.entry}</td>
                <td>{t.exit}</td>
                <td>{t.quantity}</td>
                <td>{t.charges}</td>
                <td
                  style={{ color: t.profit >= 0 ? "green" : "red" }}
                >{`₹${t.profit.toFixed(2)}`}</td>
                <td>{t.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;

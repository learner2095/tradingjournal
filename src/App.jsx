import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Trash2 } from 'lucide-react';

function App() {
  const [symbol, setSymbol] = useState('');
  const [entry, setEntry] = useState('');
  const [exit, setExit] = useState('');
  const [quantity, setQuantity] = useState('');
  const [charges, setCharges] = useState(70);
  const [notes, setNotes] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [trades, setTrades] = useState({});
  const [deployedAmount, setDeployedAmount] = useState('');
  const [withdrawnAmount, setWithdrawnAmount] = useState('');

  const formattedDate = format(selectedDate, 'yyyy-MM-dd');

  const calculatePnL = () => {
    const ent = parseFloat(entry);
    const ex = parseFloat(exit);
    const qty = parseInt(quantity);
    const chg = parseFloat(charges);
    if (!isNaN(ent) && !isNaN(ex) && !isNaN(qty)) {
      return ((ex - ent) * qty - chg).toFixed(2);
    }
    return '';
  };

  const handleAddTrade = () => {
    const pnl = calculatePnL();
    const newTrade = {
      symbol,
      entry,
      exit,
      quantity,
      charges,
      notes,
      pnl,
    };
    const updatedTrades = {
      ...trades,
      [formattedDate]: [...(trades[formattedDate] || []), newTrade],
    };
    setTrades(updatedTrades);
    setSymbol('');
    setEntry('');
    setExit('');
    setQuantity('');
    setCharges(70);
    setNotes('');
  };

  const handleDeleteTrade = (index) => {
    const updatedTrades = {
      ...trades,
      [formattedDate]: trades[formattedDate].filter((_, i) => i !== index),
    };
    setTrades(updatedTrades);
  };

  const todaysTrades = trades[formattedDate] || [];
  const todaysProfit = todaysTrades.reduce((sum, trade) => sum + parseFloat(trade.pnl), 0).toFixed(2);
  const overallProfit = Object.values(trades).flat().reduce((sum, trade) => sum + parseFloat(trade.pnl), 0).toFixed(2);

  return (
    <div className="p-6 font-sans min-h-screen bg-gradient-to-br from-blue-100 to-white text-gray-800">
      <h1 className="text-4xl font-bold text-center mb-6 text-blue-800">Trading Journal</h1>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <label className="flex flex-col">
              Symbol
              <input value={symbol} onChange={e => setSymbol(e.target.value)} className="rounded border p-2" />
            </label>
            <label className="flex flex-col">
              Entry
              <input value={entry} onChange={e => setEntry(e.target.value)} type="number" className="rounded border p-2" />
            </label>
            <label className="flex flex-col">
              Exit
              <input value={exit} onChange={e => setExit(e.target.value)} type="number" className="rounded border p-2" />
            </label>
            <label className="flex flex-col">
              Quantity
              <input value={quantity} onChange={e => setQuantity(e.target.value)} type="number" className="rounded border p-2" />
            </label>
            <label className="flex flex-col">
              Charges
              <input value={charges} onChange={e => setCharges(e.target.value)} type="number" className="rounded border p-2" />
            </label>
            <label className="flex flex-col">
              Profit/Loss
              <input value={calculatePnL()} readOnly className="rounded border p-2 bg-gray-100" />
            </label>
          </div>

          <label className="flex flex-col">
            Notes
            <textarea value={notes} onChange={e => setNotes(e.target.value)} className="rounded border p-2" />
          </label>

          <button onClick={handleAddTrade} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
            Add Trade
          </button>
        </div>

        <div>
          <Calendar onChange={setSelectedDate} value={selectedDate} />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <label className="flex flex-col">
          Deployed Amount
          <input value={deployedAmount} onChange={e => setDeployedAmount(e.target.value)} className="rounded border p-2" />
        </label>
        <label className="flex flex-col">
          Withdrawn Amount
          <input value={withdrawnAmount} onChange={e => setWithdrawnAmount(e.target.value)} className="rounded border p-2" />
        </label>
        <label className="flex flex-col">
          Today’s Profit
          <input value={todaysProfit} readOnly className="rounded border p-2 bg-green-100" />
        </label>
        <label className="flex flex-col">
          Overall Profit
          <input value={overallProfit} readOnly className="rounded border p-2 bg-green-100" />
        </label>
      </div>

      <div className="overflow-x-auto">
        <h2 className="text-xl font-semibold mb-2 text-blue-700">Trades for {formattedDate}</h2>
        <table className="min-w-full bg-white shadow-md rounded overflow-hidden">
          <thead className="bg-blue-100 text-blue-800">
            <tr>
              <th className="px-4 py-2">Symbol</th>
              <th className="px-4 py-2">Entry</th>
              <th className="px-4 py-2">Exit</th>
              <th className="px-4 py-2">Qty</th>
              <th className="px-4 py-2">Charges</th>
              <th className="px-4 py-2">P/L</th>
              <th className="px-4 py-2">Notes</th>
              <th className="px-4 py-2">Delete</th>
            </tr>
          </thead>
          <tbody>
            {todaysTrades.map((trade, index) => (
              <tr key={index} className="text-center hover:bg-blue-50">
                <td className="border px-4 py-2">{trade.symbol}</td>
                <td className="border px-4 py-2">{trade.entry}</td>
                <td className="border px-4 py-2">{trade.exit}</td>
                <td className="border px-4 py-2">{trade.quantity}</td>
                <td className="border px-4 py-2">{trade.charges}</td>
                <td className="border px-4 py-2">{trade.pnl}</td>
                <td className="border px-4 py-2">{trade.notes}</td>
                <td className="border px-4 py-2">
                  <button onClick={() => handleDeleteTrade(index)} className="text-red-500 hover:text-red-700">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {todaysTrades.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center p-4 text-gray-500">No trades for selected date</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;

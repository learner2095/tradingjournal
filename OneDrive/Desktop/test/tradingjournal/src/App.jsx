import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  serverTimestamp
} from "firebase/firestore";

// Your Firebase config (you already got this from Firebase console)
const firebaseConfig = {
  apiKey: "AIzaSyBfbDoXu_3mlAG-rN2KxG93oVO2WPLGOxU",
  authDomain: "tradingjournal-20.firebaseapp.com",
  projectId: "tradingjournal-20",
  storageBucket: "tradingjournal-20.firebasestorage.app",
  messagingSenderId: "986043182823",
  appId: "1:986043182823:web:7c1bc18660a7dfdc593c42",
  measurementId: "G-PXH0YFZZCH"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default function TradingJournalApp() {
  const [trades, setTrades] = useState([]);
  const [form, setForm] = useState({ symbol: "", entry: "", exit: "", pl: "", notes: "" });

  useEffect(() => {
    async function fetchTrades() {
      const snapshot = await getDocs(collection(db, "trades"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTrades(data);
    }
    fetchTrades();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const docRef = await addDoc(collection(db, "trades"), {
      ...form,
      createdAt: serverTimestamp()
    });
    setTrades([...trades, { id: docRef.id, ...form }]);
    setForm({ symbol: "", entry: "", exit: "", pl: "", notes: "" });
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📈 Trading Journal</h1>

      <form onSubmit={handleSubmit} className="grid gap-2 mb-6">
        <input name="symbol" value={form.symbol} onChange={handleChange} placeholder="Symbol (e.g. AAPL)" className="p-2 border rounded" required />
        <input name="entry" value={form.entry} onChange={handleChange} placeholder="Entry Price" className="p-2 border rounded" required />
        <input name="exit" value={form.exit} onChange={handleChange} placeholder="Exit Price" className="p-2 border rounded" required />
        <input name="pl" value={form.pl} onChange={handleChange} placeholder="Profit / Loss" className="p-2 border rounded" required />
        <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Notes or Emotion" className="p-2 border rounded" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Add Trade</button>
      </form>

      <div>
        <h2 className="text-xl font-semibold mb-2">Your Trades</h2>
        {trades.map(trade => (
          <div key={trade.id} className="border p-2 mb-2 rounded">
            <div><strong>Symbol:</strong> {trade.symbol}</div>
            <div><strong>Entry:</strong> {trade.entry} | <strong>Exit:</strong> {trade.exit}</div>
            <div><strong>P/L:</strong> {trade.pl}</div>
            <div><strong>Notes:</strong> {trade.notes}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

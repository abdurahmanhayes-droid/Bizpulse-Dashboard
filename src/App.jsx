import { useState } from "react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from "recharts";

// ─── Color System ───────────────────────────────────────────────────────────
const C = {
  bg: "#0A0F1E",
  surface: "#111827",
  card: "#161D2F",
  border: "#1E2D45",
  accent: "#F59E0B",
  accentDim: "#92400E",
  green: "#10B981",
  red: "#EF4444",
  blue: "#3B82F6",
  purple: "#8B5CF6",
  text: "#F1F5F9",
  muted: "#64748B",
  sub: "#94A3B8",
};

// ─── Mock Data ───────────────────────────────────────────────────────────────
const salesData = [
  { month: "Jan", revenue: 45000, expenses: 28000, profit: 17000 },
  { month: "Feb", revenue: 52000, expenses: 31000, profit: 21000 },
  { month: "Mar", revenue: 48000, expenses: 29500, profit: 18500 },
  { month: "Apr", revenue: 61000, expenses: 34000, profit: 27000 },
  { month: "May", revenue: 55000, expenses: 32000, profit: 23000 },
  { month: "Jun", revenue: 67000, expenses: 36000, profit: 31000 },
];

const cashFlowData = [
  { week: "W1", inflow: 18500, outflow: 12000, net: 6500 },
  { week: "W2", inflow: 22000, outflow: 15500, net: 6500 },
  { week: "W3", inflow: 16000, outflow: 18000, net: -2000 },
  { week: "W4", inflow: 25000, outflow: 14000, net: 11000 },
  { week: "W5", inflow: 19500, outflow: 13000, net: 6500 },
  { week: "W6", inflow: 28000, outflow: 17000, net: 11000 },
];

const inventoryData = [
  { name: "Auto Parts", value: 38, color: C.accent },
  { name: "Lubricants", value: 24, color: C.blue },
  { name: "Tyres", value: 21, color: C.green },
  { name: "Electronics", value: 17, color: C.purple },
];

const topProducts = [
  { name: "Engine Oil 5L", sold: 142, stock: 38, revenue: 18460, trend: "up" },
  { name: "Brake Pads Set", sold: 98, stock: 15, revenue: 12740, trend: "up" },
  { name: "Air Filter", sold: 87, stock: 52, revenue: 6960, trend: "down" },
  { name: "Tyre 195/65R15", sold: 64, stock: 8, revenue: 32000, trend: "up" },
  { name: "Battery 12V", sold: 41, stock: 23, revenue: 20500, trend: "stable" },
];

const aiInsights = [
  { type: "warning", icon: "⚠️", title: "Low Stock Alert", body: "Tyre 195/65R15 has only 8 units left — based on current sales velocity, you'll stock out in ~5 days." },
  { type: "success", icon: "📈", title: "Revenue Trend", body: "June revenue is up 21.8% vs. May. Engine oil and brake pads are your top growth drivers this month." },
  { type: "info", icon: "💡", title: "Cash Flow Tip", body: "Week 3 showed a ZMW 2,000 deficit. Consider staggering supplier payments to align better with customer inflows." },
  { type: "success", icon: "🏆", title: "Best Day", body: "Fridays consistently generate 34% more revenue than Mondays. Consider scheduling promotions on Thursdays." },
];

const roles = ["Owner", "Manager", "Cashier", "Viewer"];
const users = [
  { name: "Abdu H.", role: "Owner", status: "Active", lastSeen: "Now" },
  { name: "Grace M.", role: "Manager", status: "Active", lastSeen: "2h ago" },
  { name: "Bwalya K.", role: "Cashier", status: "Active", lastSeen: "1d ago" },
  { name: "Thandiwe L.", role: "Viewer", status: "Invited", lastSeen: "—" },
];

const fmt = (n) => `ZMW ${n.toLocaleString()}`;
const pct = (a, b) => (((a - b) / b) * 100).toFixed(1);

function KPICard({ label, value, sub, delta, color }) {
  const up = parseFloat(delta) >= 0;
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`,
      borderRadius: 14, padding: "22px 24px",
      display: "flex", flexDirection: "column", gap: 8,
      position: "relative", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: color || C.accent, borderRadius: "14px 14px 0 0" }} />
      <span style={{ fontSize: 12, color: C.muted, fontFamily: "monospace", letterSpacing: 1, textTransform: "uppercase" }}>{label}</span>
      <span style={{ fontSize: 28, fontWeight: 800, color: C.text, lineHeight: 1.1 }}>{value}</span>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 12, color: up ? C.green : C.red, fontWeight: 700 }}>{up ? "▲" : "▼"} {Math.abs(delta)}%</span>
        <span style={{ fontSize: 12, color: C.muted }}>{sub}</span>
      </div>
    </div>
  );
}

function SectionTitle({ children, action }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
      <h2 style={{ fontSize: 15, fontWeight: 700, color: C.text, margin: 0 }}>{children}</h2>
      {action && <button onClick={action.fn} style={{ fontSize: 12, color: C.accent, background: "none", border: "none", cursor: "pointer" }}>{action.label}</button>}
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "11px 16px", borderRadius: 10, width: "100%",
      background: active ? `${C.accent}18` : "none",
      border: active ? `1px solid ${C.accent}30` : "1px solid transparent",
      cursor: "pointer", color: active ? C.accent : C.muted,
      fontSize: 13, fontWeight: active ? 700 : 500,
      transition: "all 0.15s",
    }}>
      <span style={{ fontSize: 16 }}>{icon}</span>
      <span>{label}</span>
      {active && <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: C.accent }} />}
    </button>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "#00000088", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 28, width: "100%", maxWidth: 460, maxHeight: "80vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <h3 style={{ margin: 0, color: C.text, fontSize: 16, fontWeight: 700 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", fontSize: 20 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, type = "text", value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 12, color: C.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>{label}</label>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%", padding: "10px 14px", background: C.bg,
          border: `1px solid ${C.border}`, borderRadius: 8,
          color: C.text, fontSize: 14, outline: "none", boxSizing: "border-box",
        }}
      />
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", style: extra }) {
  const base = { padding: "11px 22px", borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13, transition: "opacity 0.15s" };
  const variants = {
    primary: { background: C.accent, color: "#0A0F1E" },
    ghost: { background: "transparent", color: C.accent, border: `1px solid ${C.accent}` },
  };
  return <button onClick={onClick} style={{ ...base, ...variants[variant], ...extra }}>{children}</button>;
}

function Overview({ onAddSale }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <KPICard label="Total Revenue" value="ZMW 67,000" sub="vs last month" delta={pct(67000, 55000)} color={C.accent} />
        <KPICard label="Net Profit" value="ZMW 31,000" sub="vs last month" delta={pct(31000, 23000)} color={C.green} />
        <KPICard label="Expenses" value="ZMW 36,000" sub="vs last month" delta={pct(36000, 32000)} color={C.red} />
        <KPICard label="Cash on Hand" value="ZMW 44,500" sub="vs last week" delta="8.2" color={C.blue} />
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
        <SectionTitle action={{ label: "+ Log Sale", fn: onAddSale }}>Revenue vs Expenses (ZMW)</SectionTitle>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={salesData}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.accent} stopOpacity={0.3} />
                <stop offset="95%" stopColor={C.accent} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.red} stopOpacity={0.2} />
                <stop offset="95%" stopColor={C.red} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="month" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
            <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text }} formatter={v => fmt(v)} />
            <Area type="monotone" dataKey="revenue" stroke={C.accent} fill="url(#revGrad)" strokeWidth={2.5} dot={false} name="Revenue" />
            <Area type="monotone" dataKey="expenses" stroke={C.red} fill="url(#expGrad)" strokeWidth={2} dot={false} name="Expenses" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div>
        <SectionTitle>AI Insights</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
          {aiInsights.map((ins, i) => (
            <div key={i} style={{
              background: C.card,
              border: `1px solid ${ins.type === "warning" ? "#92400E" : ins.type === "success" ? "#065F46" : C.border}`,
              borderRadius: 12, padding: "16px 18px",
            }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 20 }}>{ins.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 4 }}>{ins.title}</div>
                  <div style={{ fontSize: 12, color: C.sub, lineHeight: 1.6 }}>{ins.body}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SalesPage({ sales, onAdd }) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ product: "", amount: "", qty: "", payment: "Cash" });
  const submit = () => {
    if (!form.product || !form.amount) return;
    onAdd({ ...form, date: new Date().toLocaleDateString("en-ZM"), id: Date.now() });
    setForm({ product: "", amount: "", qty: "", payment: "Cash" });
    setModal(false);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {modal && (
        <Modal title="Log New Sale" onClose={() => setModal(false)}>
          <Field label="Product / Service" value={form.product} onChange={v => setForm(f => ({ ...f, product: v }))} placeholder="e.g. Engine Oil 5L" />
          <Field label="Amount (ZMW)" type="number" value={form.amount} onChange={v => setForm(f => ({ ...f, amount: v }))} placeholder="0.00" />
          <Field label="Quantity" type="number" value={form.qty} onChange={v => setForm(f => ({ ...f, qty: v }))} placeholder="1" />
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 12, color: C.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Payment Method</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["Cash", "Airtel Money", "MTN Money", "Zamtel", "Bank"].map(m => (
                <button key={m} onClick={() => setForm(f => ({ ...f, payment: m }))} style={{
                  padding: "7px 12px", borderRadius: 6,
                  border: `1px solid ${form.payment === m ? C.accent : C.border}`,
                  background: form.payment === m ? `${C.accent}20` : "none",
                  color: form.payment === m ? C.accent : C.muted,
                  cursor: "pointer", fontSize: 11,
                }}>{m}</button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={submit}>Save Sale</Btn>
            <Btn variant="ghost" onClick={() => setModal(false)}>Cancel</Btn>
          </div>
        </Modal>
      )}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
        <SectionTitle action={{ label: "+ Log Sale", fn: () => setModal(true) }}>Monthly Performance</SectionTitle>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="month" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
            <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text }} formatter={v => fmt(v)} />
            <Bar dataKey="revenue" fill={C.accent} radius={[4, 4, 0, 0]} name="Revenue" />
            <Bar dataKey="profit" fill={C.green} radius={[4, 4, 0, 0]} name="Profit" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
        <SectionTitle>Sales Log</SectionTitle>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Date", "Product", "Qty", "Amount", "Payment", "Status"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 12px", fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: 1, borderBottom: `1px solid ${C.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sales.map((s, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.border}30` }}>
                  <td style={{ padding: "11px 12px", fontSize: 12, color: C.muted }}>{s.date}</td>
                  <td style={{ padding: "11px 12px", fontSize: 13, color: C.text, fontWeight: 600 }}>{s.product}</td>
                  <td style={{ padding: "11px 12px", fontSize: 13, color: C.sub }}>{s.qty || 1}</td>
                  <td style={{ padding: "11px 12px", fontSize: 13, color: C.accent, fontWeight: 700 }}>{fmt(Number(s.amount))}</td>
                  <td style={{ padding: "11px 12px" }}>
                    <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 20, background: s.payment === "Cash" ? "#1E3A1E" : "#1E2A3A", color: s.payment === "Cash" ? C.green : C.blue }}>{s.payment}</span>
                  </td>
                  <td style={{ padding: "11px 12px" }}>
                    <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 20, background: "#1E3A1E", color: C.green }}>Completed</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function InventoryPage() {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: "", qty: "", cost: "", reorder: "" });
  const [items, setItems] = useState(topProducts);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {modal && (
        <Modal title="Add Inventory Item" onClose={() => setModal(false)}>
          <Field label="Item Name" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="e.g. Oil Filter" />
          <Field label="Quantity in Stock" type="number" value={form.qty} onChange={v => setForm(f => ({ ...f, qty: v }))} />
          <Field label="Cost Price (ZMW)" type="number" value={form.cost} onChange={v => setForm(f => ({ ...f, cost: v }))} />
          <Field label="Reorder Level" type="number" value={form.reorder} onChange={v => setForm(f => ({ ...f, reorder: v }))} placeholder="Alert when below..." />
          <div style={{ display: "flex", gap: 10 }}>
            <Btn onClick={() => { setItems(p => [...p, { name: form.name, sold: 0, stock: Number(form.qty), revenue: 0, trend: "stable" }]); setModal(false); }}>Add Item</Btn>
            <Btn variant="ghost" onClick={() => setModal(false)}>Cancel</Btn>
          </div>
        </Modal>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
          <SectionTitle>Stock by Category</SectionTitle>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={inventoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {inventoryData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text }} formatter={v => `${v}%`} />
              <Legend formatter={(v) => <span style={{ color: C.sub, fontSize: 12 }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
          <SectionTitle>Stock Alerts</SectionTitle>
          {items.filter(i => i.stock < 20).map((i, idx) => (
            <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${C.border}30` }}>
              <div>
                <div style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>{i.name}</div>
                <div style={{ fontSize: 11, color: C.red }}>Only {i.stock} units left</div>
              </div>
              <span style={{ fontSize: 20 }}>⚠️</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
        <SectionTitle action={{ label: "+ Add Item", fn: () => setModal(true) }}>Inventory Table</SectionTitle>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Product", "Units Sold", "In Stock", "Revenue", "Trend"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 12px", fontSize: 11, color: C.muted, textTransform: "uppercase", letterSpacing: 1, borderBottom: `1px solid ${C.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((p, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.border}30` }}>
                  <td style={{ padding: "11px 12px", fontSize: 13, color: C.text, fontWeight: 600 }}>{p.name}</td>
                  <td style={{ padding: "11px 12px", fontSize: 13, color: C.sub }}>{p.sold}</td>
                  <td style={{ padding: "11px 12px" }}>
                    <span style={{ fontSize: 13, color: p.stock < 15 ? C.red : p.stock < 30 ? C.accent : C.green, fontWeight: 700 }}>{p.stock}</span>
                  </td>
                  <td style={{ padding: "11px 12px", fontSize: 13, color: C.accent, fontWeight: 700 }}>{fmt(p.revenue)}</td>
                  <td style={{ padding: "11px 12px" }}>
                    <span style={{ fontSize: 16 }}>{p.trend === "up" ? "📈" : p.trend === "down" ? "📉" : "➡️"}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CashFlowPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
        <KPICard label="Total Inflows" value="ZMW 129k" sub="last 6 weeks" delta="14.3" color={C.green} />
        <KPICard label="Total Outflows" value="ZMW 89.5k" sub="last 6 weeks" delta="9.1" color={C.red} />
        <KPICard label="Net Cash Flow" value="ZMW 39.5k" sub="last 6 weeks" delta="22.6" color={C.blue} />
        <KPICard label="Burn Rate" value="ZMW 14.9k" sub="per week avg" delta="-3.2" color={C.purple} />
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
        <SectionTitle>Cash Flow — Weekly (ZMW)</SectionTitle>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={cashFlowData}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="week" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
            <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text }} formatter={v => fmt(v)} />
            <Bar dataKey="inflow" fill={C.green} radius={[4, 4, 0, 0]} name="Inflow" />
            <Bar dataKey="outflow" fill={C.red} radius={[4, 4, 0, 0]} name="Outflow" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
        <SectionTitle>Net Cash Flow Trend</SectionTitle>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={cashFlowData}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="week" tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
            <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text }} formatter={v => fmt(v)} />
            <Line type="monotone" dataKey="net" stroke={C.blue} strokeWidth={2.5} dot={{ fill: C.blue, r: 4 }} name="Net" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ReportsPage() {
  const [generated, setGenerated] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 28 }}>
        <SectionTitle>Generate Report</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          {[["Report Type", ["Monthly P&L", "Cash Flow", "Inventory", "Sales Summary"]], ["Period", ["This Month", "Last Month", "Q2 2025", "Year to Date"]], ["Format", ["PDF", "Excel", "CSV"]], ["Currency", ["ZMW", "USD"]]].map(([label, opts]) => (
            <div key={label}>
              <label style={{ display: "block", fontSize: 11, color: C.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>{label}</label>
              <select style={{ width: "100%", padding: "10px 12px", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: 13 }}>
                {opts.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
        <Btn onClick={() => setGenerated(true)}>Generate Report</Btn>
      </div>
      {generated && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: 28 }}>📊</span>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>Monthly P&L — June 2025</div>
              <div style={{ fontSize: 12, color: C.muted }}>Generated just now · ZMW</div>
            </div>
            <Btn variant="ghost" style={{ marginLeft: "auto" }}>⬇ Download PDF</Btn>
          </div>
          {[["Total Revenue", "67,000", C.accent], ["Cost of Goods", "22,400", C.red], ["Gross Profit", "44,600", C.green], ["Operating Expenses", "13,600", C.red], ["Net Profit", "31,000", C.green]].map(([l, v, c]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${C.border}30` }}>
              <span style={{ fontSize: 13, color: C.sub }}>{l}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: c }}>ZMW {v}</span>
            </div>
          ))}
          <div style={{ marginTop: 16, padding: "14px 16px", background: `${C.green}15`, border: `1px solid ${C.green}30`, borderRadius: 10 }}>
            <div style={{ fontSize: 12, color: C.green, fontWeight: 700 }}>✅ Profit Margin: 46.3% — Healthy</div>
            <div style={{ fontSize: 12, color: C.sub, marginTop: 4 }}>Your business is performing above the SME average for this sector in Zambia.</div>
          </div>
        </div>
      )}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
        <SectionTitle>Recent Reports</SectionTitle>
        {[
          { name: "Cash Flow — May 2025", date: "Jun 1, 2025", type: "PDF" },
          { name: "Inventory — Q1 2025", date: "Apr 3, 2025", type: "Excel" },
          { name: "Monthly P&L — April 2025", date: "May 2, 2025", type: "PDF" },
        ].map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: `1px solid ${C.border}30` }}>
            <div>
              <div style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>{r.name}</div>
              <div style={{ fontSize: 11, color: C.muted }}>{r.date}</div>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 20, background: r.type === "PDF" ? "#3B1F1F" : "#1E3A2A", color: r.type === "PDF" ? C.red : C.green }}>{r.type}</span>
              <button style={{ background: "none", border: "none", color: C.accent, cursor: "pointer", fontSize: 16 }}>⬇</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeamPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
        <SectionTitle>Team Members</SectionTitle>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {users.map((u, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 16px", background: C.bg, borderRadius: 10, border: `1px solid ${C.border}` }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${C.accent}, ${C.blue})`, display: "flex", alignItems: "center", justifyContent: "center", color: "#0A0F1E", fontWeight: 800, fontSize: 15, flexShrink: 0 }}>
                {u.name[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{u.name}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{u.lastSeen === "Now" ? "🟢 Online now" : `Last seen ${u.lastSeen}`}</div>
              </div>
              <select defaultValue={u.role} style={{ padding: "6px 10px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 6, color: C.sub, fontSize: 11 }}>
                {roles.map(r => <option key={r}>{r}</option>)}
              </select>
              <span style={{ fontSize: 11, padding: "4px 10px", borderRadius: 20, background: u.status === "Active" ? "#0B3321" : "#2A2010", color: u.status === "Active" ? C.green : C.accent }}>{u.status}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 24 }}>
        <SectionTitle>Role Permissions</SectionTitle>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "10px 12px", fontSize: 11, color: C.muted, textTransform: "uppercase", borderBottom: `1px solid ${C.border}` }}>Permission</th>
                {roles.map(r => <th key={r} style={{ textAlign: "center", padding: "10px 12px", fontSize: 11, color: C.muted, textTransform: "uppercase", borderBottom: `1px solid ${C.border}` }}>{r}</th>)}
              </tr>
            </thead>
            <tbody>
              {[
                ["View Dashboard", true, true, true, true],
                ["Log Sales", true, true, true, false],
                ["Edit Inventory", true, true, false, false],
                ["Manage Users", true, false, false, false],
                ["Export Reports", true, true, false, false],
                ["View AI Insights", true, true, false, false],
              ].map(([perm, ...vals]) => (
                <tr key={perm} style={{ borderBottom: `1px solid ${C.border}20` }}>
                  <td style={{ padding: "11px 12px", fontSize: 13, color: C.sub }}>{perm}</td>
                  {vals.map((v, i) => (
                    <td key={i} style={{ textAlign: "center", padding: "11px 12px", fontSize: 16 }}>{v ? "✅" : "—"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("overview");
  const [sideOpen, setSideOpen] = useState(true);
  const [sales, setSales] = useState([
    { date: "Jun 10, 2025", product: "Engine Oil 5L", qty: 4, amount: 5200, payment: "Airtel Money" },
    { date: "Jun 10, 2025", product: "Brake Pads Set", qty: 2, amount: 2600, payment: "Cash" },
    { date: "Jun 9, 2025", product: "Tyre 195/65R15", qty: 1, amount: 5000, payment: "MTN Money" },
    { date: "Jun 9, 2025", product: "Battery 12V", qty: 1, amount: 2500, payment: "Cash" },
  ]);

  const nav = [
    { id: "overview", icon: "⚡", label: "Overview" },
    { id: "sales", icon: "💰", label: "Sales" },
    { id: "inventory", icon: "📦", label: "Inventory" },
    { id: "cashflow", icon: "💳", label: "Cash Flow" },
    { id: "reports", icon: "📊", label: "Reports" },
    { id: "team", icon: "👥", label: "Team & Access" },
  ];

  const pages = {
    overview: <Overview onAddSale={() => setPage("sales")} />,
    sales: <SalesPage sales={sales} onAdd={s => setSales(p => [s, ...p])} />,
    inventory: <InventoryPage />,
    cashflow: <CashFlowPage />,
    reports: <ReportsPage />,
    team: <TeamPage />,
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0A0F1E; color: #F1F5F9; font-family: sans-serif; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1E2D45; border-radius: 2px; }
        select { appearance: none; cursor: pointer; }
      `}</style>
      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
        <div style={{
          width: sideOpen ? 220 : 0, flexShrink: 0, overflow: "hidden",
          background: "#111827", borderRight: "1px solid #1E2D45",
          display: "flex", flexDirection: "column", transition: "width 0.2s",
        }}>
          <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid #1E2D45" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#F59E0B" }}>BIZPULSE</div>
            <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>Zambia SME Analytics</div>
          </div>
          <div style={{ padding: "16px 12px", flex: 1, display: "flex", flexDirection: "column", gap: 4, overflowY: "auto" }}>
            {nav.map(n => <NavItem key={n.id} {...n} active={page === n.id} onClick={() => setPage(n.id)} />)}
          </div>
          <div style={{ padding: "16px 12px", borderTop: "1px solid #1E2D45" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #F59E0B, #3B82F6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#0A0F1E", fontSize: 14 }}>A</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#F1F5F9" }}>Abdu H.</div>
                <div style={{ fontSize: 10, color: "#64748B" }}>Owner · PRO-TECH</div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ height: 60, borderBottom: "1px solid #1E2D45", display: "flex", alignItems: "center", padding: "0 24px", gap: 16, background: "#111827", flexShrink: 0 }}>
            <button onClick={() => setSideOpen(s => !s)} style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer", fontSize: 18 }}>☰</button>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9" }}>{nav.find(n => n.id === page)?.label}</span>
            <div style={{ marginLeft: "auto" }}>
              <span style={{ fontSize: 11, color: "#64748B" }}>🇿🇲 ZMW · BizPulse Zambia</span>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
            {pages[page]}
          </div>
        </div>
      </div>
    </>
  );
}

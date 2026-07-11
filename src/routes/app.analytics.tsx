import { createFileRoute } from "@tanstack/react-router";
import { responseTrend } from "@/lib/mock";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";

export const Route = createFileRoute("/app/analytics")({
  head: () => ({ meta: [{ title: "Analytics · ResQFlow" }] }),
  component: AnalyticsPage,
});

const deficit = [
  { zone: "Zone 1", incidents: 12, volunteers: 18, gap: 0 },
  { zone: "Zone 2", incidents: 22, volunteers: 14, gap: 8 },
  { zone: "Zone 3", incidents: 31, volunteers: 9, gap: 22 },
  { zone: "Zone 4", incidents: 8, volunteers: 11, gap: 0 },
  { zone: "Zone 5", incidents: 17, volunteers: 12, gap: 5 },
];
const breakdown = [
  { name: "Medical", value: 38, color: "oklch(0.6 0.235 27)" },
  { name: "Flood", value: 27, color: "oklch(0.546 0.215 262)" },
  { name: "Fire", value: 14, color: "oklch(0.7 0.18 50)" },
  { name: "Cyclone", value: 12, color: "oklch(0.62 0.18 150)" },
  { name: "Other", value: 9, color: "oklch(0.55 0.04 260)" },
];

function AnalyticsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Resource Deficit Analytics</h1>
        <p className="text-sm text-muted-foreground">Forecast shortages before they become failures</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-4 lg:col-span-2">
          <div className="text-sm font-semibold">Incident vs Responder Ratio</div>
          <div className="text-xs text-muted-foreground">Zones with red gap need surge support</div>
          <div className="h-[300px] mt-3">
            <ResponsiveContainer>
              <BarChart data={deficit}>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1}/>
                <XAxis dataKey="zone" tick={{ fontSize: 11 }}/>
                <YAxis tick={{ fontSize: 11 }}/>
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }}/>
                <Legend wrapperStyle={{ fontSize: 11 }}/>
                <Bar dataKey="incidents" fill="oklch(0.6 0.235 27)" radius={[6,6,0,0]}/>
                <Bar dataKey="volunteers" fill="oklch(0.546 0.215 262)" radius={[6,6,0,0]}/>
                <Bar dataKey="gap" fill="oklch(0.78 0.16 90)" radius={[6,6,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="glass rounded-2xl p-4">
          <div className="text-sm font-semibold">Incident type breakdown</div>
          <div className="text-xs text-muted-foreground">Last 24 hours</div>
          <div className="h-[300px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={breakdown} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                  {breakdown.map((d) => <Cell key={d.name} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {breakdown.map(b => (
              <div key={b.name} className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{background:b.color}}/>{b.name} <span className="ml-auto text-muted-foreground">{b.value}%</span></div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-4">
        <div className="text-sm font-semibold">Resource demand forecast · next 12h</div>
        <div className="h-[280px] mt-3">
          <ResponsiveContainer>
            <LineChart data={responseTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1}/>
              <XAxis dataKey="t" tick={{ fontSize: 11 }}/>
              <YAxis tick={{ fontSize: 11 }}/>
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }}/>
              <Legend wrapperStyle={{ fontSize: 11 }}/>
              <Line type="monotone" dataKey="incidents" stroke="oklch(0.6 0.235 27)" strokeWidth={2} dot={{ r: 3 }}/>
              <Line type="monotone" dataKey="resolved" stroke="oklch(0.546 0.215 262)" strokeWidth={2} dot={{ r: 3 }}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

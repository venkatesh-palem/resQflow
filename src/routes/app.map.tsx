import { createFileRoute } from "@tanstack/react-router";
import { MiniMap } from "@/components/MiniMap";
import { incidents } from "@/lib/mock";
import { PriorityBadge } from "@/components/PriorityBadge";
import { Layers, Locate, ZoomIn, ZoomOut } from "lucide-react";

export const Route = createFileRoute("/app/map")({
  head: () => ({ meta: [{ title: "Live Map · ResQFlow" }] }),
  component: MapPage,
});

function MapPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Interactive Disaster Map</h1>
          <p className="text-sm text-muted-foreground">Leaflet · OpenStreetMap · live heatmap</p>
        </div>
        <div className="flex gap-2">
          {["Incidents","Volunteers","Hospitals","Shelters","Boats","Depots"].map((l,i) => (
            <label key={l} className="text-xs rounded-full border bg-card px-3 py-1.5 inline-flex items-center gap-2">
              <input type="checkbox" defaultChecked={i<4} className="accent-primary"/> {l}
            </label>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 relative">
          <MiniMap height={620} />
          <div className="absolute top-3 left-3 flex gap-1.5">
            {[ZoomIn, ZoomOut, Locate, Layers].map((I, k) => (
              <button key={k} className="h-9 w-9 rounded-lg glass grid place-items-center hover:bg-accent"><I className="h-4 w-4"/></button>
            ))}
          </div>
        </div>
        <div className="glass rounded-2xl p-4 max-h-[620px] overflow-y-auto">
          <div className="text-sm font-semibold">Active pins</div>
          <ul className="mt-3 space-y-2">
            {incidents.map(i => (
              <li key={i.id} className="rounded-lg border bg-card p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-mono text-xs">{i.id}</div>
                  <PriorityBadge p={i.priority}/>
                </div>
                <div className="mt-1 text-sm">{i.icon} {i.type}</div>
                <div className="text-xs text-muted-foreground">{i.location}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

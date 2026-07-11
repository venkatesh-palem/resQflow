import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/app")({
  head: () => ({ meta: [{ title: "Command Center · ResQFlow" }] }),
  component: AppShell,
});

export type Status = "todo" | "in_progress" | "done" | "overdue";
export type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  assigneeInitials: string;
  status: Status;
  priority: Priority;
  dueDate: string; // ISO
  aiScore?: number;
  aiFlags?: string[];
  logsCount: number;
}

const now = Date.now();
const day = 86400000;

export const mockTasks: Task[] = [
  { id: "t1", title: "Q3 Sales Report — South Region", description: "Compile revenue + churn data from Salesforce.", assignee: "Priya Sharma", assigneeInitials: "PS", status: "in_progress", priority: "high", dueDate: new Date(now + day).toISOString(), aiScore: 84, logsCount: 3 },
  { id: "t2", title: "Vendor contract renewal — Acme Corp", description: "Negotiate 12-month renewal, review T&Cs.", assignee: "Rohan Mehta", assigneeInitials: "RM", status: "todo", priority: "high", dueDate: new Date(now + 3 * day).toISOString(), logsCount: 0 },
  { id: "t3", title: "Onboarding deck v2", description: "Update slides 4–11 with new pricing.", assignee: "Ananya Iyer", assigneeInitials: "AI", status: "in_progress", priority: "medium", dueDate: new Date(now + 2 * day).toISOString(), aiScore: 32, aiFlags: ["vague"], logsCount: 2 },
  { id: "t4", title: "Inventory reconciliation — Warehouse 4", description: "Match physical count vs system.", assignee: "Kabir Nair", assigneeInitials: "KN", status: "overdue", priority: "high", dueDate: new Date(now - 2 * day).toISOString(), aiScore: 18, aiFlags: ["no_detail", "vague"], logsCount: 1 },
  { id: "t5", title: "Customer NPS analysis", description: "Q3 responses, segment by tier.", assignee: "Priya Sharma", assigneeInitials: "PS", status: "done", priority: "medium", dueDate: new Date(now - 1 * day).toISOString(), aiScore: 91, logsCount: 4 },
  { id: "t6", title: "Refactor billing webhook", description: "Idempotency keys + retry queue.", assignee: "Devansh Rao", assigneeInitials: "DR", status: "in_progress", priority: "medium", dueDate: new Date(now + 5 * day).toISOString(), aiScore: 76, logsCount: 2 },
  { id: "t7", title: "Quarterly OKR draft", description: "Draft team OKRs for review.", assignee: "Ananya Iyer", assigneeInitials: "AI", status: "todo", priority: "low", dueDate: new Date(now + 7 * day).toISOString(), logsCount: 0 },
  { id: "t8", title: "Hire — Senior Data Analyst", description: "Source 5 candidates, schedule loops.", assignee: "Rohan Mehta", assigneeInitials: "RM", status: "done", priority: "high", dueDate: new Date(now - 3 * day).toISOString(), aiScore: 88, logsCount: 5 },
];

export interface AuditEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  diff?: string;
  timestamp: string;
}

export const mockAudit: AuditEntry[] = [
  { id: "a1", actor: "Priya Sharma", action: "submitted log", target: "Q3 Sales Report — South Region", diff: "AI score: 84/100", timestamp: new Date(now - 1000 * 60 * 12).toISOString() },
  { id: "a2", actor: "Kabir Nair", action: "auto-flagged overdue", target: "Inventory reconciliation — Warehouse 4", diff: "due_date < now", timestamp: new Date(now - 1000 * 60 * 47).toISOString() },
  { id: "a3", actor: "Ananya Iyer", action: "moved task", target: "Onboarding deck v2", diff: "todo → in_progress", timestamp: new Date(now - 1000 * 60 * 60 * 2).toISOString() },
  { id: "a4", actor: "Rohan Mehta", action: "created task", target: "Hire — Senior Data Analyst", timestamp: new Date(now - 1000 * 60 * 60 * 5).toISOString() },
  { id: "a5", actor: "System AI", action: "verified log", target: "Refactor billing webhook", diff: "flags: [genuine_effort]", timestamp: new Date(now - 1000 * 60 * 60 * 8).toISOString() },
  { id: "a6", actor: "Devansh Rao", action: "edited task", target: "Refactor billing webhook", diff: "priority: low → medium", timestamp: new Date(now - 1000 * 60 * 60 * 26).toISOString() },
];

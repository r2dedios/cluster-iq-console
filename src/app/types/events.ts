export interface Event {
  id: number;
  action: string;
  resourceId: string;
  resourceType: string;
  timestamp: string; // ISO date string
  result: string;
  severity: string;
  triggeredBy: string;
  description?: string;
  accountID: string;
}

export interface EventsResponse {
  events: Event[];
  total: number;
}

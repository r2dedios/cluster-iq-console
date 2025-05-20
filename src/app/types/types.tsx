export type ClusterData = {
  count: number;
  clusters: Cluster[];
};

export type Cluster = {
  id: string;
  name: string;
  provider: string;
  status: string;
  region: string;
  consoleLink: string;
  accountName: string;
  instanceCount: number;
  creationTimestamp: string;
  lastScanTimestamp: string;
  totalCost: number;
  last15DaysCost: number;
  lastMonthCost: number;
  currentMonthSoFarCost: number;
  instances: Instance[];
};

export type AccountData = {
  count: number;
  accounts: Account[];
};

export type Account = {
  id: string;
  name: string;
  provider: string;
  clusterCount: number;
  lastScanTimestamp: string;
  totalCost: number;
  last15DaysCost: number;
  lastMonthCost: number;
  currentMonthSoFarCost: number;
  clusters: Record<string, Cluster>;
};

export type TagData = {
  count: number;
  tags: Tag[];
};

export type Tag = {
  key: string;
  value: string;
};

export type ClusterPerCP = {
  count: number;
  accounts: Account[];
};

export type Instance = {
  id: string;
  name: string;
  availabilityZone: string;
  instanceType: string;
  status: string;
  clusterID: string;
  provider: string;
  lastScanTimestamp: string;
  creationTimestamp: string;
  dailyCost: number;
  totalCost: number;
  tags: Array<Tag>;
};

export type Instances = {
  count: number;
  instances: Instance[];
};

export type AuditEvent = {
  id: number;
  action_name: string;
  account_id?: string;
  provider?: string;
  event_timestamp: string;
  description?: string;
  resource_id: string;
  resource_type: string;
  result: string;
  // Should be typed?
  severity: string;
  triggered_by: string;
};

export type AuditEvents = {
  count: number;
  events: AuditEvent[];
};

export enum ClusterStates {
  Running = 'Running',
  Stopped = 'Stopped',
  Terminated = 'Terminated',
  Unknown = 'Unknown',
}

export enum CloudProvider {
  AWS = 'AWS',
  GCP = 'GCP',
  Azure = 'Azure',
}

export enum ClusterActions {
  PowerOn = 'PowerOn',
  PowerOff = 'PowerOff',
}

export enum ResultStatus {
  Success = 'Success',
  Failed = 'Failed',
  Warning = 'Warning',
}

export enum ScheduledActionStatus {
  Success = 'Success',
  Failed = 'Failed',
  Pending = 'Pending',
  Unknown = 'Unknown',
}

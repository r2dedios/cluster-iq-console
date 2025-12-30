// TODO REMOVE
export enum ClusterActions {
  PowerOn = 'PowerOn',
  PowerOff = 'PowerOff',
  PowerOnCluster = 'PowerOnCluster',
  PowerOffCluster = 'PowerOffCluster',
}

// TODO REMOVE
export enum ActionType {
  InstantAction = 'instant_action',
  ScheduledAction = 'scheduled_action',
  CronAction = 'cron_action',
}

export enum ResultStatus {
  Pending = 'Pending',
  Running = 'Running',
  Success = 'Success',
  Failed = 'Failed',
  Warning = 'Warning',
  Unknown = 'Unknown',
}

export enum ActionStatus {
  Running = 'Running',
  Success = 'Success',
  Failed = 'Failed',
  Pending = 'Pending',
  Unknown = 'Unknown',
}

export enum ActionOperations {
  POWER_ON = 'PowerOn',
  POWER_OFF = 'PowerOff',
}

export enum ActionTypes {
  INSTANT_ACTION = 'instant_action',
  SCHEDULED_ACTION = 'scheduled_action',
  CRON_ACTION = 'cron_action',
}

// TODO: REMOVE
export enum PowerAction {
  POWER_ON = 'Power on',
  POWER_OFF = 'Power off',
}

export interface BaseAction {
  type: 'scheduled_action' | 'cron_action';
  operation: 'PowerOffCluster' | 'PowerOnCluster';
  target: {
    clusterID: string;
  };
  status: 'Pending';
  enabled: boolean;
}

export interface ScheduledAction extends BaseAction {
  type: 'scheduled_action';
  time: string;
}

export interface CronAction extends BaseAction {
  type: 'cron_action';
  cronExp: string;
}

export interface InstantAction {
  description?: string;
}

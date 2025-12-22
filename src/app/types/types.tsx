export enum ClusterActions {
  PowerOn = 'PowerOn',
  PowerOff = 'PowerOff',
  PowerOnCluster = 'PowerOnCluster',
  PowerOffCluster = 'PowerOffCluster',
}

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
}

export enum ScheduledActionStatus {
  Success = 'Success',
  Failed = 'Failed',
  Pending = 'Pending',
  Unknown = 'Unknown',
}

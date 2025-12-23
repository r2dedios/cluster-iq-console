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
  Unknown = 'Unknown',
}

export enum ScheduledActionStatus {
  Success = 'Success',
  Failed = 'Failed',
  Pending = 'Pending',
  Unknown = 'Unknown',
}

export enum ActionOperations {
  POWER_ON = 'Power On',
  POWER_OFF = 'Power Off',
}

export enum ActionTypes {
  INSTANT_ACTION = 'Instant Action',
  SCHEDULED_ACTION = 'Scheduled Action',
  CRON_ACTION = 'Cron Action',
}

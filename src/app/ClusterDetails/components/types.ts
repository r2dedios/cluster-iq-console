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

export interface ImmediateAction {
  description?: string;
}

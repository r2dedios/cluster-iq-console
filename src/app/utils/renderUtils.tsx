import React from 'react';
import { ActionType, ActionStatus, ClusterActions, ResultStatus } from '@app/types/types';
import { ResourceStatusApi } from '@api';
import { Label } from '@patternfly/react-core';
import {
  PendingIcon,
  OnRunningIcon,
  InfoCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  UnknownIcon,
} from '@patternfly/react-icons';

export function renderActionStatusLabel(labelText: string | null | undefined) {
  switch (labelText) {
    case ActionStatus.Running:
      return <Label color="purple">{labelText}</Label>;
    case ActionStatus.Success:
      return <Label color="green">{labelText}</Label>;
    case ActionStatus.Failed:
      return <Label color="red">{labelText}</Label>;
    case ActionStatus.Pending:
      return <Label color="gold">{labelText}</Label>;
    default:
      return <Label color="grey">{labelText}</Label>;
  }
}

export function renderStatusLabel(labelText: string | null | undefined) {
  switch (labelText) {
    case ResourceStatusApi.Running:
      return <Label color="green">{labelText}</Label>;
    case ResourceStatusApi.Stopped:
      return <Label color="red">{labelText}</Label>;
    case ResourceStatusApi.Terminated:
      return <Label color="purple">{labelText}</Label>;
    default:
      return <Label color="grey">{labelText}</Label>;
  }
}

export function renderActionTypeLabel(labelText: string | null | undefined) {
  switch (labelText) {
    case ActionType.InstantAction:
      return <Label color="orange">Instant Action</Label>;
    case ActionType.ScheduledAction:
      return <Label color="green">Scheduled Action</Label>;
    case ActionType.CronAction:
      return <Label color="blue">Cron Action</Label>;
    default:
      return <Label color="grey">{labelText}</Label>;
  }
}

export function renderOperationLabel(labelText: string | null | undefined) {
  switch (labelText) {
    case ClusterActions.PowerOn:
      return <Label color="green">{labelText}</Label>;
    case ClusterActions.PowerOff:
      return <Label color="red">{labelText}</Label>;
    case ClusterActions.PowerOnCluster:
      return <Label color="green">{labelText}</Label>;
    case ClusterActions.PowerOffCluster:
      return <Label color="red">{labelText}</Label>;
    default:
      return <Label color="grey">{labelText}</Label>;
  }
}

export const getResultIcon = (result: ResultStatus) => {
  return (
    {
      [ResultStatus.Success]: <InfoCircleIcon color="var(--pf-v5-global--success-color--100)" title="Success" />,
      [ResultStatus.Running]: <OnRunningIcon color="var(--pf-v5-global--info-color--100)" title="Running" />,
      [ResultStatus.Pending]: <PendingIcon color="var(--pf-v5-global--warning-color--100)" title="Pending" />,
      [ResultStatus.Failed]: <ExclamationTriangleIcon color="var(--pf-v5-global--danger-color--100)" title="Error" />,
      [ResultStatus.Warning]: <ExclamationCircleIcon color="var(--pf-v5-global--warning-color--100)" title="Warning" />,
      [ResultStatus.Unknown]: <UnknownIcon color="gray" title="Unknown" />,
    }[result] || <UnknownIcon color="gray" title="Unknown" />
  );
};

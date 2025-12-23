import { ClusterActions } from '@app/types/types';

export interface SchedulerTableToolbarProps {
  searchValue: string;
  setSearchValue: (value: string) => void;
  action: ClusterActions[] | null;
  setAction: (value: ClusterActions[] | null) => void;
  type: string;
  setType: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  enabled: 'yes' | 'no' | '';
  setEnabled: (value: 'yes' | 'no' | '') => void;
}

export interface SchedulerTableProps {
  type: string;
  action: ClusterActions[];
  accountName: string;
  cluster: string;
  status: string;
  enabled: 'yes' | 'no' | '';
}

export const apiOperationToClusterAction: Record<string, ClusterActions> = {
  PowerOffCluster: ClusterActions.PowerOff,
  PowerOnCluster: ClusterActions.PowerOn,
};

export const clusterActionToApiOperation: Record<ClusterActions, string> = {
  [ClusterActions.PowerOff]: 'PowerOffCluster',
  [ClusterActions.PowerOn]: 'PowerOnCluster',
};
